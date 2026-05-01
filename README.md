# Swadeshi Swap

A simple web app that helps you find **Indian-made alternatives to foreign products**, with:

- Indian alternative names, brands, and indicative prices
- Where to buy (Amazon.in, Flipkart, JioMart search links that always resolve)
- Country of origin of the foreign product
- A country profile showing:
  - Diplomatic **relationship with India**
  - **Treatment of Indians** in that country
  - Size of the **Indian diaspora**
  - **Trade balance** with India
  - **FDI / investment** posture
  - A **buy / avoid recommendation**

## Run it

It's a static site — no build step, no server needed.

```
# from the repo root
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows
```

Or serve it locally:

```
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
index.html            # page shell
assets/styles.css     # styling
assets/app.js         # search, filter, render, country modal
data/countries.js     # country profiles vs. India
data/products.js      # foreign products → Indian alternatives
```

## Adding a product

Append an object to `window.PRODUCTS` in `data/products.js`:

```js
{
  id: "p-some-id",
  category: "Electronics",
  foreign: { name: "Foreign Product", brand: "Brand", country: "US", priceInr: "₹X – ₹Y" },
  indian: [
    { name: "Indian Alt", brand: "Brand", priceInr: "₹X", madeIn: "India" }
  ],
  notes: "Optional context."
}
```

Country codes must exist in `window.COUNTRIES` (`data/countries.js`). Add a new country there if needed.

## Data caveat

Diplomatic, diaspora and trade figures are **indicative** and drawn from publicly available
sources (MEA, Ministry of Commerce, MoIA, World Bank, company filings). They drift over time
— double-check before citing. Prices are MRP-style ranges; verify at point of sale.

## Why

Buying Indian alternatives — when quality and price are comparable — keeps capital in the
country, builds Indian brands, and reduces dependency on suppliers from less friendly
jurisdictions. This tool makes the choice visible and easy.
