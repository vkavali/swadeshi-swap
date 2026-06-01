import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || "3000", 10);
const DATABASE_URL = process.env.DATABASE_URL;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "*")
  .split(",").map(s => s.trim()).filter(Boolean);

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required (Railway Postgres add-on provides it).");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false }
});

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      foreign_name TEXT NOT NULL,
      foreign_brand TEXT NOT NULL,
      foreign_country TEXT NOT NULL,
      foreign_price_inr TEXT,
      notes TEXT,
      source TEXT NOT NULL DEFAULT 'community',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS alternatives (
      id BIGSERIAL PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      price_inr TEXT,
      made_in TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_alternatives_product_id ON alternatives(product_id);
    CREATE TABLE IF NOT EXISTS notes (
      id BIGSERIAL PRIMARY KEY,
      product_id TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_notes_product_id ON notes(product_id);
  `);
}

const app = express();
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ALLOWED_ORIGINS.includes("*") ? true : ALLOWED_ORIGINS,
  credentials: false
}));
app.use(express.json({ limit: "256kb" }));

const writeLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false });
const readLimiter  = rateLimit({ windowMs: 60_000, limit: 200, standardHeaders: "draft-7", legacyHeaders: false });

function trimOrNull(v, max = 1000) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.slice(0, max);
}
function require_(v, name, max = 200) {
  const s = trimOrNull(v, max);
  if (!s) throw Object.assign(new Error(`missing field: ${name}`), { status: 400 });
  return s;
}

// -------- API routes --------

app.get("/api/health", readLimiter, async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: "db" });
  }
});

app.get("/api/products", readLimiter, async (_req, res) => {
  try {
    const products = (await pool.query("SELECT * FROM products ORDER BY created_at DESC LIMIT 5000")).rows;
    const alts = (await pool.query("SELECT * FROM alternatives ORDER BY created_at ASC")).rows;
    const notes = (await pool.query("SELECT * FROM notes ORDER BY created_at ASC")).rows;

    const altsByPid = new Map();
    for (const a of alts) {
      if (!altsByPid.has(a.product_id)) altsByPid.set(a.product_id, []);
      altsByPid.get(a.product_id).push({
        name: a.name, brand: a.brand,
        priceInr: a.price_inr || "", madeIn: a.made_in || "India"
      });
    }
    const notesByPid = new Map();
    for (const n of notes) {
      if (!notesByPid.has(n.product_id)) notesByPid.set(n.product_id, []);
      notesByPid.get(n.product_id).push({ text: n.note, ts: new Date(n.created_at).getTime() });
    }

    res.json({
      products: products.map(p => ({
        id: p.id,
        category: p.category,
        foreign: {
          name: p.foreign_name, brand: p.foreign_brand,
          country: p.foreign_country, priceInr: p.foreign_price_inr || ""
        },
        indian: altsByPid.get(p.id) || [],
        notes: p.notes || ""
      })),
      alternatives: Object.fromEntries(altsByPid),
      notes: Object.fromEntries(notesByPid)
    });
  } catch (e) {
    console.error("GET /api/products", e);
    res.status(500).json({ error: "internal" });
  }
});

app.post("/api/products", writeLimiter, async (req, res) => {
  try {
    const b = req.body || {};
    const id = require_(b.id, "id", 64);
    const category = require_(b.category, "category", 80);
    const fName = require_(b?.foreign?.name, "foreign.name", 200);
    const fBrand = require_(b?.foreign?.brand, "foreign.brand", 200);
    const fCountry = require_(b?.foreign?.country, "foreign.country", 4);
    const fPrice = trimOrNull(b?.foreign?.priceInr, 80);
    const notes = trimOrNull(b?.notes, 4000);

    await pool.query(
      `INSERT INTO products (id, category, foreign_name, foreign_brand, foreign_country, foreign_price_inr, notes, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'community')`,
      [id, category, fName, fBrand, fCountry, fPrice, notes]
    );
    if (Array.isArray(b.indian)) {
      for (const a of b.indian) {
        if (!a) continue;
        const aName = trimOrNull(a.name, 200);
        const aBrand = trimOrNull(a.brand, 200);
        if (!aName || !aBrand) continue;
        await pool.query(
          `INSERT INTO alternatives (product_id, name, brand, price_inr, made_in) VALUES ($1,$2,$3,$4,$5)`,
          [id, aName, aBrand, trimOrNull(a.priceInr, 80), trimOrNull(a.madeIn, 120)]
        );
      }
    }
    res.json({ ok: true, id });
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "duplicate id" });
    if (e.status === 400)   return res.status(400).json({ error: e.message });
    console.error("POST /api/products", e);
    res.status(500).json({ error: "internal" });
  }
});

app.post("/api/products/:id/alternatives", writeLimiter, async (req, res) => {
  try {
    const id = require_(req.params.id, "id", 64);
    const a = req.body || {};
    const name = require_(a.name, "name", 200);
    const brand = require_(a.brand, "brand", 200);
    await pool.query(
      `INSERT INTO alternatives (product_id, name, brand, price_inr, made_in) VALUES ($1,$2,$3,$4,$5)`,
      [id, name, brand, trimOrNull(a.priceInr, 80), trimOrNull(a.madeIn, 120)]
    );
    res.json({ ok: true });
  } catch (e) {
    if (e.status === 400) return res.status(400).json({ error: e.message });
    console.error("POST alternative", e);
    res.status(500).json({ error: "internal" });
  }
});

app.post("/api/products/:id/notes", writeLimiter, async (req, res) => {
  try {
    const id = require_(req.params.id, "id", 64);
    const text = require_(req.body?.text, "text", 4000);
    await pool.query(`INSERT INTO notes (product_id, note) VALUES ($1, $2)`, [id, text]);
    res.json({ ok: true });
  } catch (e) {
    if (e.status === 400) return res.status(400).json({ error: e.message });
    console.error("POST note", e);
    res.status(500).json({ error: "internal" });
  }
});

// -------- Static frontend --------
// Serve from repo root (Railway deploys from repo root, server is a subdirectory)
const staticRoot = path.join(__dirname, "..");
app.use(express.static(staticRoot, { index: "index.html" }));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "not found" });
  res.sendFile(path.join(staticRoot, "index.html"));
});

migrate()
  .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
  .catch(e => { console.error("Migration failed", e); process.exit(1); });
