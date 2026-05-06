# Swadeshi Swap

Find Indian-made alternatives to foreign products, with country-of-origin context (relationship with India, treatment of Indians, diaspora, trade balance) and a buy / avoid recommendation.

The data shown is either **curated and editorial** (clearly labelled) or **fetched live from a public API** (clearly labelled). Nothing is fabricated. There are no reviews and no derived ratings.

## Data sources

| Source | Used for | License / API |
|---|---|---|
| **Curated dataset** in `data/products.js` and `data/countries.js` | Foreign↔Indian alternative pairings, country profiles | This repo (editorial) |
| **Open Food Facts** | Live search of real packaged-food / grocery products with brand and country-of-origin | Open Database License (ODbL); no key required; CORS-enabled |
| **MEA, MoCI, MoIA, World Bank, WITS** | Linked from each country profile as "Sources / further reading" | Public; linked, not scraped |

There is currently **no public API anywhere that maps a foreign brand to its Indian alternative** — that mapping is editorial. When a live OFF result has no curated match, the app says so honestly and lets you suggest one.

## Run it

It's a static site — no build step.

```
python3 -m http.server 8000
# visit http://localhost:8000
```

## Tabs

- **📚 Catalogue** — curated pairings + your contributions, with search, category/country/recommendation filters, sort, favorites, dark mode, "surprise me", and shareable URL state.
- **🔎 Live search · Open Food Facts** — type a name (e.g. "Nutella"); results come straight from OFF. If we have a curated Indian alternative for that brand, it's shown alongside; otherwise you can click **＋ Suggest one**.

## Contributions

This is a static site — there is no backend, so contributions are stored in your browser via `localStorage`. Two ways to share them:

1. **⇧ Submit** in the header → opens a **pre-filled GitHub issue** at `vkavali/Order-managment` containing your contributions as JSON. Maintainers review and merge into the canonical dataset.
2. **⇩ Export** → downloads a JSON file you can email or attach to a PR.

Three kinds of contribution:

- **＋ Product** — add a foreign product / brand the catalogue is missing, with a suggested Indian alternative.
- **＋ Suggest an alternative** (on each card) — add another Indian option for an existing entry.
- **＋ Add your note** (on each card) — leave a personal experience note. Notes are factual and stored locally to you. The app does not aggregate, average, or display reviews from other users.

You can browse just your own additions with the "👤 My contributions" toggle.

## Structure

```
index.html
assets/styles.css
assets/app.js
data/countries.js
data/products.js
```

Browser tooling: vanilla JS, no framework, no build, no dependencies.

## Caveats

- Diplomatic, diaspora, and trade figures are indicative and dated; the app links to primary sources for verification.
- Open Food Facts data is community-maintained — fields like `countries_tags` may be missing or imprecise on some products. The app surfaces what's there and labels gaps as "Origin unknown" rather than guessing.
- A real multi-user community feature (other users seeing your contributions live) needs a database backend (Supabase / Firebase / a custom API). Until that's wired up, contributions are local until submitted.
