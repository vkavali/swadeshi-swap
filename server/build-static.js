// Copies frontend static files into server/public/ for Railway deployment.
// Railway may deploy only the server/ directory, so the parent-directory
// static files need to be bundled in here.

import { cpSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dest = path.join(__dirname, "public");

// Only copy if parent directory has the frontend files
// (i.e. we're running from the full repo, not an isolated server/ deploy)
const indexPath = path.join(root, "index.html");

if (existsSync(indexPath)) {
  console.log("Copying frontend files to server/public/...");
  mkdirSync(dest, { recursive: true });

  const toCopy = ["index.html", "assets", "data"];
  for (const item of toCopy) {
    const src = path.join(root, item);
    if (existsSync(src)) {
      cpSync(src, path.join(dest, item), { recursive: true });
      console.log(`  ${item} -> public/${item}`);
    }
  }
  console.log("Done.");
} else {
  console.log("No parent index.html found — skipping static copy (server-only deploy).");
  // Ensure public/ exists with a minimal fallback
  mkdirSync(dest, { recursive: true });
}
