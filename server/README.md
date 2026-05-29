# Swadeshi Swap — API

Tiny Node + Express + Postgres backend for community-submitted products, alternatives, and notes.

No auth (anonymous contributions). Rate-limited. Input is length-validated. There are no reviews and no derived ratings.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Liveness + DB ping |
| GET | `/api/products` | All community products with their alternatives & notes |
| POST | `/api/products` | Submit a new product (id, category, foreign{name,brand,country,priceInr}, indian[], notes) |
| POST | `/api/products/:id/alternatives` | Add an alternative to an existing product (curated or community) |
| POST | `/api/products/:id/notes` | Add a factual experience note |

## Deploy to Railway

1. Push this repo to GitHub (already done).
2. https://railway.app/new → **Deploy from GitHub repo** → pick `vkavali/swadeshi-swap`.
3. In the service settings: **Root Directory** → `server`.
4. Add a **Postgres** plugin to the project. Railway auto-injects `DATABASE_URL`.
5. (Optional) set `ALLOWED_ORIGINS` to your frontend's URL (e.g. `https://your-static-host.com`). Defaults to `*`.
6. Railway exposes `PORT` automatically; the server reads it.
7. Wait for the first deploy. Health check: `https://<your-service>.up.railway.app/api/health` should return `{"ok":true,...}`.

## Wire the frontend

In the deployed Swadeshi Swap UI, click the ⚙ icon in the header, paste your Railway URL (e.g. `https://swadeshi-api.up.railway.app`), Save. The app will fetch community products from that URL and POST your contributions there.

You can also pre-bake it: edit `assets/config.js` and set `window.SWADESHI_CONFIG.apiBase`.

## Local dev

```
cd server
cp .env.example .env       # set DATABASE_URL to a local Postgres
npm install
npm run dev
```

The frontend will work against `http://localhost:3000`.

## Schema

```sql
products(id PK, category, foreign_name, foreign_brand, foreign_country, foreign_price_inr, notes, source, created_at)
alternatives(id PK, product_id, name, brand, price_inr, made_in, created_at)
notes(id PK, product_id, note, created_at)
```

`product_id` in `alternatives` and `notes` is a free-form string — it can reference either a community product (`user-...`) or a curated id (`p-...`) from `data/products.js`.

## What this isn't

- No auth, no user accounts.
- No moderation queue (yet). Add a `pending` column + admin endpoint when needed.
- No CAPTCHA. Rate limit + length caps for now.
- No reviews / ratings / sentiment scraping. Notes are factual user experience, not aggregated.
