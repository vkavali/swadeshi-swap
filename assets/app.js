(function () {
  "use strict";

  const COUNTRIES = window.COUNTRIES || {};
  const CURATED = window.PRODUCTS || [];

  // -------- Storage --------
  const FAVS_KEY = "swadeshi.favs";
  const THEME_KEY = "swadeshi.theme";
  const CONTRIBS_KEY = "swadeshi.contribs.v1";

  let favs = new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || "[]"));
  function saveFavs() { localStorage.setItem(FAVS_KEY, JSON.stringify([...favs])); }

  let contribs = (() => {
    try {
      const raw = JSON.parse(localStorage.getItem(CONTRIBS_KEY) || "null");
      if (raw && raw.products && raw.alternatives && raw.notes) return raw;
    } catch (e) {}
    return { products: [], alternatives: {}, notes: {} };
  })();
  function saveContribs() { localStorage.setItem(CONTRIBS_KEY, JSON.stringify(contribs)); }

  // -------- Theme --------
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || (!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  // -------- Element refs --------
  const $ = id => document.getElementById(id);
  const els = {
    search: $("search"), category: $("category"), country: $("country"),
    recommendation: $("recommendation"), sort: $("sort"),
    favsOnly: $("favs-only"), mineOnly: $("mine-only"),
    reset: $("reset"), surprise: $("surprise"), themeToggle: $("theme-toggle"),
    addProduct: $("add-product"), exportContribs: $("export-contribs"), submitContribs: $("submit-contribs"),
    grid: $("grid"), empty: $("empty"), meta: $("results-meta"), stats: $("stats"),
    modal: $("modal"), modalBody: $("modal-body"),
    addModal: $("add-modal"), addForm: $("add-form"), addCountry: $("add-country"),
    altModal: $("alt-modal"), altForm: $("alt-form"), altContext: $("alt-context"),
    noteModal: $("note-modal"), noteForm: $("note-form"), noteContext: $("note-context"),
    panelCatalogue: $("panel-catalogue"), panelLive: $("panel-live"),
    liveQ: $("live-q"), liveGo: $("live-go"), liveGrid: $("live-grid"), liveMeta: $("live-meta"),
    tabs: document.querySelectorAll(".tab")
  };

  // -------- Helpers --------
  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }
  function buyLinks(name) {
    const q = encodeURIComponent(name);
    return [
      { label: "Amazon.in", url: `https://www.amazon.in/s?k=${q}` },
      { label: "Flipkart", url: `https://www.flipkart.com/search?q=${q}` },
      { label: "JioMart", url: `https://www.jiomart.com/search/${q}` }
    ];
  }
  function recLabel(r) {
    return ({ prefer: "Prefer", neutral: "Neutral", caution: "Caution", avoid: "Avoid" })[r] || "—";
  }
  const REC_ORDER = { avoid: 0, caution: 1, neutral: 2, prefer: 3 };

  // Combined catalogue = curated + user-contributed
  function allProducts() {
    const userProducts = contribs.products.map(p => ({ ...p, _user: true }));
    return [...CURATED, ...userProducts].map(p => {
      const userAlts = (contribs.alternatives[p.id] || []).map(a => ({ ...a, _user: true }));
      return { ...p, indian: [...p.indian, ...userAlts] };
    });
  }

  // -------- Filter dropdown population --------
  function populateFilters() {
    const products = allProducts();
    const cats = Array.from(new Set(products.map(p => p.category))).sort();
    els.category.innerHTML = '<option value="">All categories</option>';
    cats.forEach(c => {
      const o = document.createElement("option");
      o.value = c; o.textContent = c;
      els.category.appendChild(o);
    });
    const codes = Array.from(new Set(products.map(p => p.foreign.country))).sort();
    els.country.innerHTML = '<option value="">All origin countries</option>';
    codes.forEach(code => {
      const c = COUNTRIES[code];
      if (!c) return;
      const o = document.createElement("option");
      o.value = code; o.textContent = `${c.flag} ${c.name}`;
      els.country.appendChild(o);
    });
    // also populate add-product country dropdown
    els.addCountry.innerHTML = "";
    Object.values(COUNTRIES).forEach(c => {
      const o = document.createElement("option");
      o.value = c.code; o.textContent = `${c.flag} ${c.name}`;
      els.addCountry.appendChild(o);
    });
  }

  // -------- Stats --------
  function renderStats() {
    const products = allProducts();
    const totalAlts = products.reduce((n, p) => n + p.indian.length, 0);
    const distinctCountries = new Set(products.map(p => p.foreign.country)).size;
    const cats = new Set(products.map(p => p.category));
    const avoidShare = products.filter(p => (COUNTRIES[p.foreign.country] || {}).recommendation === "avoid").length;
    const preferShare = products.filter(p => (COUNTRIES[p.foreign.country] || {}).recommendation === "prefer").length;
    els.stats.innerHTML = `
      <span class="stat-chip"><strong>${products.length}</strong> products</span>
      <span class="stat-chip"><strong>${totalAlts}</strong> alternatives</span>
      <span class="stat-chip"><strong>${distinctCountries}</strong> countries</span>
      <span class="stat-chip"><strong>${cats.size}</strong> categories</span>
      <span class="stat-chip">★ <strong>${favs.size}</strong> favorites</span>
      <span class="stat-chip">👤 <strong>${contribs.products.length}</strong> your products</span>
      <span class="stat-chip" style="color:var(--avoid)">⚠ <strong>${avoidShare}</strong> avoid</span>
      <span class="stat-chip" style="color:var(--prefer)">✓ <strong>${preferShare}</strong> prefer</span>
    `;
  }

  // -------- Render product card --------
  function renderCard(p) {
    const country = COUNTRIES[p.foreign.country] || { name: p.foreign.country, flag: "🏳️", recommendation: "neutral" };
    const isFav = favs.has(p.id);
    const altsHtml = p.indian.map((a, idx) => `
      <div class="alt">
        <div>
          <div class="name">${escapeHtml(a.name)}${a._user ? '<span class="user-badge">You</span>' : ""}</div>
          <div class="meta">${escapeHtml(a.brand)}${a.madeIn ? " • " + escapeHtml(a.madeIn) : ""}</div>
          <div class="buy-row">
            ${buyLinks(a.name).map(b => `<a href="${b.url}" target="_blank" rel="noopener">Buy on ${b.label}</a>`).join("")}
          </div>
        </div>
        <div class="price">${escapeHtml(a.priceInr || "")}</div>
      </div>
    `).join("");

    const userNotes = (contribs.notes[p.id] || []).map((n, i) => `
      <div class="note-block">
        <button class="delete" data-del-note="${p.id}::${i}" title="Delete note">×</button>
        <span class="who">Your note</span> · <span class="meta">${escapeHtml(new Date(n.ts).toLocaleDateString())}</span>
        <div>${escapeHtml(n.text)}</div>
      </div>
    `).join("");

    const card = document.createElement("article");
    card.className = "card";
    card.id = "card-" + p.id;
    card.innerHTML = `
      <div class="row">
        <div class="foreign">
          <h3>${escapeHtml(p.foreign.name)}${p._user ? '<span class="user-badge">You</span>' : ""}</h3>
          <div class="brand-line">${escapeHtml(p.foreign.brand)} • ${escapeHtml(p.foreign.priceInr || "")}</div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="category-pill">${escapeHtml(p.category)}</span>
          <button class="fav-btn ${isFav ? "on" : ""}" data-fav="${p.id}" type="button" aria-pressed="${isFav}" title="Favorite">${isFav ? "★" : "☆"}</button>
        </div>
      </div>
      <div class="row">
        <button class="country-chip" data-country="${country.code || p.foreign.country}" type="button">
          <span class="flag">${country.flag || "🏳️"}</span>
          <span>From ${escapeHtml(country.name || p.foreign.country)}</span>
        </button>
        <span class="rec ${country.recommendation || "neutral"}">${recLabel(country.recommendation)}</span>
      </div>
      <div class="divider"></div>
      <div class="alts">
        <h4>Indian alternatives</h4>
        ${altsHtml || '<div class="meta">No alternatives mapped yet — be the first to suggest one.</div>'}
      </div>
      <div class="suggest-row">
        <button class="link-btn" data-add-alt="${p.id}" type="button">＋ Suggest an alternative</button>
        <button class="link-btn" data-add-note="${p.id}" type="button">＋ Add your note</button>
      </div>
      ${p.notes ? `<div class="notes">${escapeHtml(p.notes)}</div>` : ""}
      ${userNotes}
    `;
    return card;
  }

  // -------- Sort & filter --------
  function sortProducts(list) {
    const mode = els.sort.value;
    const arr = list.slice();
    if (mode === "alpha") arr.sort((a, b) => a.foreign.name.localeCompare(b.foreign.name));
    else if (mode === "category") arr.sort((a, b) => a.category.localeCompare(b.category) || a.foreign.name.localeCompare(b.foreign.name));
    else if (mode === "recommendation") arr.sort((a, b) => {
      const ra = (COUNTRIES[a.foreign.country] || {}).recommendation || "neutral";
      const rb = (COUNTRIES[b.foreign.country] || {}).recommendation || "neutral";
      return (REC_ORDER[ra] ?? 9) - (REC_ORDER[rb] ?? 9) || a.foreign.name.localeCompare(b.foreign.name);
    });
    else if (mode === "favorites") arr.sort((a, b) => Number(favs.has(b.id)) - Number(favs.has(a.id)));
    return arr;
  }

  function applyFilters({ skipUrl = false } = {}) {
    const q = els.search.value.trim().toLowerCase();
    const cat = els.category.value;
    const ctry = els.country.value;
    const rec = els.recommendation.value;

    let filtered = allProducts().filter(p => {
      if (cat && p.category !== cat) return false;
      if (ctry && p.foreign.country !== ctry) return false;
      if (els.favsOnly.checked && !favs.has(p.id)) return false;
      if (els.mineOnly.checked && !p._user) return false;
      if (rec) {
        const c = COUNTRIES[p.foreign.country];
        if (!c || c.recommendation !== rec) return false;
      }
      if (q) {
        const hay = [p.foreign.name, p.foreign.brand, p.category,
          ...p.indian.flatMap(a => [a.name, a.brand])].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    filtered = sortProducts(filtered);
    els.grid.innerHTML = "";
    for (const p of filtered) els.grid.appendChild(renderCard(p));
    els.empty.classList.toggle("hidden", filtered.length > 0);
    els.meta.textContent = `${filtered.length} of ${allProducts().length} products`;
    renderStats();
    if (!skipUrl) writeUrl();
  }

  // -------- Country modal --------
  function openCountry(code) {
    const c = COUNTRIES[code];
    if (!c) return;
    const rec = c.recommendation || "neutral";
    const verdict = {
      prefer: "Friendly partner. Buy if Indian alternative isn't available — but consider Indian options first.",
      neutral: "Mixed picture. Indian alternatives are usually a smart choice.",
      caution: "Watch the political weather. Prefer Indian alternatives where viable.",
      avoid: "Strategic concerns. Strongly prefer Indian alternatives — every rupee diverted helps."
    }[rec];

    const fromHere = allProducts().filter(p => p.foreign.country === code).slice(0, 12);
    const relatedHtml = fromHere.length
      ? `<div class="stat-row">
           <div class="label">Products tracked from ${escapeHtml(c.name)} (${fromHere.length})</div>
           <div class="related-list">
             ${fromHere.map(p => `<a href="#card-${p.id}" data-jump="${p.id}">${escapeHtml(p.foreign.name)} — ${escapeHtml(p.foreign.brand)}</a>`).join("")}
           </div>
         </div>` : "";

    const meaSlug = encodeURIComponent(c.name);
    els.modalBody.innerHTML = `
      <h2 id="modal-title">${c.flag} ${escapeHtml(c.name)}</h2>
      <div class="country-line">Country profile vs. India</div>

      <div class="stat-row"><div class="label">Diplomatic relationship</div><div class="value">${escapeHtml(c.relationship || "—")}</div></div>
      <div class="stat-row"><div class="label">Treatment of Indians</div><div class="value">${escapeHtml(c.treatmentOfIndians || "—")}</div></div>
      <div class="stat-row"><div class="label">Indian diaspora</div><div class="value">${escapeHtml(c.diaspora || "—")}</div></div>
      <div class="stat-row"><div class="label">Trade balance with India</div><div class="value">${escapeHtml(c.tradeBalance || "—")}</div></div>
      <div class="stat-row"><div class="label">FDI / investment posture</div><div class="value">${escapeHtml(c.fdiPosture || "—")}</div></div>

      <div class="verdict ${rec}">
        <strong>${recLabel(rec)}.</strong> ${escapeHtml(verdict || "")}
        ${c.note ? `<div style="margin-top:6px;">${escapeHtml(c.note)}</div>` : ""}
      </div>

      <div class="stat-row">
        <div class="label">Sources / further reading</div>
        <div class="related-list">
          <a href="https://www.mea.gov.in/foreign-relation.htm" target="_blank" rel="noopener">MEA bilateral briefs</a>
          <a href="https://commerce.gov.in/trade-statistics/" target="_blank" rel="noopener">India MoCI trade statistics</a>
          <a href="https://www.mea.gov.in/overseas-indian-affairs.htm" target="_blank" rel="noopener">MEA / MoIA: overseas Indians</a>
          <a href="https://wits.worldbank.org/CountryProfile/en/Country/IND" target="_blank" rel="noopener">World Bank WITS: India</a>
          <a href="https://en.wikipedia.org/wiki/India%E2%80%93${meaSlug}_relations" target="_blank" rel="noopener">Wikipedia: India–${escapeHtml(c.name)} relations</a>
        </div>
      </div>

      ${relatedHtml}
    `;
    els.modal.classList.remove("hidden");
  }

  // -------- Live search (Open Food Facts) --------
  const OFF_COUNTRY_MAP = {
    "en:india": "IN", "en:china": "CN", "en:united-states": "US", "en:united-states-of-america": "US",
    "en:united-kingdom": "GB", "en:germany": "DE", "en:france": "FR", "en:japan": "JP",
    "en:south-korea": "KR", "en:republic-of-korea": "KR", "en:switzerland": "CH",
    "en:netherlands": "NL", "en:italy": "IT", "en:spain": "ES", "en:sweden": "SE",
    "en:australia": "AU", "en:canada": "CA", "en:singapore": "SG",
    "en:united-arab-emirates": "AE", "en:taiwan": "TW", "en:vietnam": "VN", "en:thailand": "TH",
    "en:israel": "IL", "en:russia": "RU", "en:russian-federation": "RU",
    "en:saudi-arabia": "SA", "en:qatar": "QA", "en:kuwait": "KW",
    "en:malaysia": "MY", "en:indonesia": "ID", "en:turkey": "TR", "en:turkiye": "TR",
    "en:pakistan": "PK", "en:bangladesh": "BD", "en:sri-lanka": "LK", "en:nepal": "NP",
    "en:brazil": "BR", "en:south-africa": "ZA", "en:mexico": "MX"
  };
  function offTagToCode(tags) {
    if (!Array.isArray(tags)) return null;
    for (const t of tags) {
      const code = OFF_COUNTRY_MAP[t];
      if (code) return code;
    }
    return null;
  }

  async function searchLive(query) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=24&fields=code,product_name,brands,brands_tags,countries_tags,origins,image_thumb_url,image_small_url,categories_tags`;
    els.liveMeta.textContent = "Searching Open Food Facts…";
    els.liveGrid.innerHTML = "";
    let data;
    try {
      const r = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      data = await r.json();
    } catch (e) {
      els.liveMeta.textContent = "Couldn't reach Open Food Facts: " + e.message;
      return;
    }
    const products = data.products || [];
    els.liveMeta.innerHTML = `${products.length} real result(s) for <strong>${escapeHtml(query)}</strong> — source: <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener">Open Food Facts</a>. Country-of-origin may be missing in source data.`;
    products.forEach(p => els.liveGrid.appendChild(renderLiveCard(p)));
  }

  function findCuratedAltsByBrand(brandStr) {
    if (!brandStr) return [];
    const b = brandStr.toLowerCase();
    return allProducts().filter(p => {
      const fb = (p.foreign.brand || "").toLowerCase();
      return fb && (fb.includes(b) || b.includes(fb));
    });
  }

  function renderLiveCard(p) {
    const card = document.createElement("article");
    card.className = "card";
    const code = offTagToCode(p.countries_tags);
    const country = code ? COUNTRIES[code] : null;
    const name = p.product_name || "(no name)";
    const brand = p.brands || "(no brand)";
    const matches = findCuratedAltsByBrand((p.brands_tags && p.brands_tags[0]) || p.brands);

    const altsHtml = matches.length
      ? matches.slice(0, 3).map(m => `
          <div class="alt">
            <div>
              <div class="name">Mapped: ${escapeHtml(m.foreign.name)}</div>
              <div class="meta">Indian alternatives:</div>
              <ul style="margin:4px 0 0 16px; padding:0; font-size:13px;">
                ${m.indian.slice(0, 4).map(a => `<li>${escapeHtml(a.name)} <span class="meta">— ${escapeHtml(a.brand)}${a.priceInr ? " · " + escapeHtml(a.priceInr) : ""}</span></li>`).join("")}
              </ul>
              <div class="buy-row">
                <a href="#card-${m.id}" data-jump-live="${m.id}">Open in catalogue →</a>
              </div>
            </div>
          </div>`).join("")
      : `<div class="meta">No Indian alternative is mapped yet for this brand. <button class="link-btn" data-suggest-from-live="1" data-name="${escapeHtml(name)}" data-brand="${escapeHtml(brand)}" data-country="${code || ""}">＋ Suggest one</button></div>`;

    card.innerHTML = `
      ${p.image_thumb_url || p.image_small_url
        ? `<img class="live-img" src="${escapeHtml(p.image_thumb_url || p.image_small_url)}" alt="" loading="lazy"/>`
        : `<div class="no-image">No image</div>`}
      <div class="row">
        <div class="foreign">
          <h3>${escapeHtml(name)}</h3>
          <div class="brand-line">${escapeHtml(brand)}</div>
        </div>
        ${country
          ? `<button class="country-chip" data-country="${country.code}"><span class="flag">${country.flag}</span><span>${escapeHtml(country.name)}</span></button>`
          : `<span class="meta">Origin unknown</span>`}
      </div>
      ${country ? `<div class="row"><span></span><span class="rec ${country.recommendation || "neutral"}">${recLabel(country.recommendation)}</span></div>` : ""}
      <div class="divider"></div>
      <div class="alts"><h4>Indian alternatives</h4>${altsHtml}</div>
      <div class="meta" style="font-size:11px;">OFF code: <a href="https://world.openfoodfacts.org/product/${escapeHtml(p.code)}" target="_blank" rel="noopener">${escapeHtml(p.code)}</a></div>
    `;
    return card;
  }

  // -------- Contributions: add product / alt / note --------
  function openAddProduct() { els.addModal.classList.remove("hidden"); }
  function openAddAlt(targetId, prefill = {}) {
    els.altForm.reset();
    els.altForm.elements.targetId.value = targetId;
    const target = allProducts().find(p => p.id === targetId);
    els.altContext.textContent = target ? `For: ${target.foreign.name} — ${target.foreign.brand}` : "";
    if (prefill.iName) els.altForm.elements.iName.value = prefill.iName;
    if (prefill.iBrand) els.altForm.elements.iBrand.value = prefill.iBrand;
    els.altModal.classList.remove("hidden");
  }
  function openAddNote(targetId) {
    els.noteForm.reset();
    els.noteForm.elements.targetId.value = targetId;
    const target = allProducts().find(p => p.id === targetId);
    els.noteContext.textContent = target ? `For: ${target.foreign.name} — ${target.foreign.brand}` : "";
    els.noteModal.classList.remove("hidden");
  }

  els.addProduct.addEventListener("click", openAddProduct);

  els.addForm.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(els.addForm);
    const id = "user-" + Date.now().toString(36);
    const product = {
      id,
      category: f.get("category").trim(),
      foreign: {
        name: f.get("fName").trim(),
        brand: f.get("fBrand").trim(),
        country: f.get("fCountry"),
        priceInr: f.get("fPrice").trim()
      },
      indian: [{
        name: f.get("iName").trim(),
        brand: f.get("iBrand").trim(),
        priceInr: f.get("iPrice").trim(),
        madeIn: f.get("iMadeIn").trim() || "India"
      }],
      notes: f.get("notes").trim()
    };
    contribs.products.push(product);
    saveContribs();
    populateFilters();
    applyFilters();
    els.addModal.classList.add("hidden");
    els.addForm.reset();
    const card = document.getElementById("card-" + id);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("flash");
      setTimeout(() => card.classList.remove("flash"), 1400);
    }
  });

  els.altForm.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(els.altForm);
    const id = f.get("targetId");
    const alt = {
      name: f.get("iName").trim(),
      brand: f.get("iBrand").trim(),
      priceInr: f.get("iPrice").trim(),
      madeIn: f.get("iMadeIn").trim() || "India"
    };
    contribs.alternatives[id] = contribs.alternatives[id] || [];
    contribs.alternatives[id].push(alt);
    saveContribs();
    applyFilters();
    els.altModal.classList.add("hidden");
  });

  els.noteForm.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(els.noteForm);
    const id = f.get("targetId");
    const text = f.get("note").trim();
    if (!text) return;
    contribs.notes[id] = contribs.notes[id] || [];
    contribs.notes[id].push({ text, ts: Date.now() });
    saveContribs();
    applyFilters();
    els.noteModal.classList.add("hidden");
  });

  // Export contributions
  els.exportContribs.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(contribs, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `swadeshi-contributions-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Submit as GitHub issue
  els.submitContribs.addEventListener("click", () => {
    const body = "```json\n" + JSON.stringify(contribs, null, 2) + "\n```";
    const url = "https://github.com/vkavali/Order-managment/issues/new"
      + "?title=" + encodeURIComponent("Community contribution: products / alternatives / notes")
      + "&body=" + encodeURIComponent("Submitting from Swadeshi Swap. Please review and merge into the canonical dataset if appropriate.\n\n" + body);
    if (encodeURIComponent(body).length > 7000) {
      alert("Your contributions are too large for a GitHub issue URL. Use Export instead and attach the JSON file.");
      return;
    }
    window.open(url, "_blank", "noopener");
  });

  // -------- URL state sync --------
  function readUrl() {
    const h = location.hash.replace(/^#/, "");
    if (!h) return;
    const params = new URLSearchParams(h);
    if (params.get("tab") === "live") activateTab("live");
    if (params.get("q")) els.search.value = params.get("q");
    if (params.get("cat")) els.category.value = params.get("cat");
    if (params.get("country")) els.country.value = params.get("country");
    if (params.get("rec")) els.recommendation.value = params.get("rec");
    if (params.get("sort")) els.sort.value = params.get("sort");
    if (params.get("fav") === "1") els.favsOnly.checked = true;
    if (params.get("mine") === "1") els.mineOnly.checked = true;
  }
  function writeUrl() {
    const params = new URLSearchParams();
    if (currentTab === "live") params.set("tab", "live");
    if (els.search.value) params.set("q", els.search.value);
    if (els.category.value) params.set("cat", els.category.value);
    if (els.country.value) params.set("country", els.country.value);
    if (els.recommendation.value) params.set("rec", els.recommendation.value);
    if (els.sort.value && els.sort.value !== "default") params.set("sort", els.sort.value);
    if (els.favsOnly.checked) params.set("fav", "1");
    if (els.mineOnly.checked) params.set("mine", "1");
    const s = params.toString();
    const newHash = s ? "#" + s : "";
    if (location.hash !== newHash) history.replaceState(null, "", location.pathname + location.search + newHash);
  }

  // -------- Tabs --------
  let currentTab = "catalogue";
  function activateTab(name) {
    currentTab = name;
    els.tabs.forEach(t => {
      const on = t.dataset.tab === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    els.panelCatalogue.classList.toggle("hidden", name !== "catalogue");
    els.panelLive.classList.toggle("hidden", name !== "live");
    writeUrl();
  }
  els.tabs.forEach(t => t.addEventListener("click", () => activateTab(t.dataset.tab)));

  // -------- Surprise & reset --------
  function surpriseMe() {
    activateTab("catalogue");
    els.search.value = ""; els.category.value = ""; els.country.value = "";
    els.recommendation.value = ""; els.favsOnly.checked = false; els.mineOnly.checked = false;
    els.sort.value = "default";
    applyFilters();
    const list = allProducts();
    if (!list.length) return;
    const pick = list[Math.floor(Math.random() * list.length)];
    const card = document.getElementById("card-" + pick.id);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("flash");
    setTimeout(() => card.classList.remove("flash"), 1400);
  }
  function resetAll() {
    els.search.value = ""; els.category.value = ""; els.country.value = "";
    els.recommendation.value = ""; els.sort.value = "default";
    els.favsOnly.checked = false; els.mineOnly.checked = false;
    applyFilters();
  }
  els.surprise.addEventListener("click", surpriseMe);
  els.reset.addEventListener("click", resetAll);
  els.themeToggle.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, next);
  });

  // -------- Catalogue events --------
  ["input", "change"].forEach(ev => els.search.addEventListener(ev, () => applyFilters()));
  [els.category, els.country, els.recommendation, els.sort].forEach(el => el.addEventListener("change", () => applyFilters()));
  els.favsOnly.addEventListener("change", () => applyFilters());
  els.mineOnly.addEventListener("change", () => applyFilters());

  els.grid.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) { const id = fav.dataset.fav; favs.has(id) ? favs.delete(id) : favs.add(id); saveFavs(); applyFilters(); return; }
    const chip = e.target.closest(".country-chip");
    if (chip) { openCountry(chip.dataset.country); return; }
    const addAlt = e.target.closest("[data-add-alt]");
    if (addAlt) { openAddAlt(addAlt.dataset.addAlt); return; }
    const addNote = e.target.closest("[data-add-note]");
    if (addNote) { openAddNote(addNote.dataset.addNote); return; }
    const delNote = e.target.closest("[data-del-note]");
    if (delNote) {
      const [id, idxStr] = delNote.dataset.delNote.split("::");
      const idx = parseInt(idxStr, 10);
      if (contribs.notes[id]) {
        contribs.notes[id].splice(idx, 1);
        if (!contribs.notes[id].length) delete contribs.notes[id];
        saveContribs(); applyFilters();
      }
    }
  });

  // -------- Live tab events --------
  els.liveGo.addEventListener("click", () => { if (els.liveQ.value.trim()) searchLive(els.liveQ.value.trim()); });
  els.liveQ.addEventListener("keydown", e => { if (e.key === "Enter" && els.liveQ.value.trim()) searchLive(els.liveQ.value.trim()); });
  els.liveGrid.addEventListener("click", e => {
    const chip = e.target.closest(".country-chip");
    if (chip) { openCountry(chip.dataset.country); return; }
    const jump = e.target.closest("[data-jump-live]");
    if (jump) {
      e.preventDefault();
      activateTab("catalogue");
      const id = jump.dataset.jumpLive;
      setTimeout(() => {
        const card = document.getElementById("card-" + id);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.add("flash");
          setTimeout(() => card.classList.remove("flash"), 1400);
        }
      }, 50);
      return;
    }
    const sug = e.target.closest("[data-suggest-from-live]");
    if (sug) {
      const name = sug.dataset.name;
      const brand = sug.dataset.brand;
      const country = sug.dataset.country;
      // Pre-create a curated-style entry so the user can attach an alternative.
      const id = "user-" + Date.now().toString(36);
      contribs.products.push({
        id, category: "Imported from OFF",
        foreign: { name, brand, country: country || "US", priceInr: "" },
        indian: [], notes: "Imported from Open Food Facts via Live Search."
      });
      saveContribs();
      populateFilters();
      activateTab("catalogue");
      applyFilters();
      openAddAlt(id);
    }
  });

  // -------- Modal close handling (delegated) --------
  document.addEventListener("click", e => {
    const closer = e.target.closest("[data-close-modal]");
    if (closer) closer.closest(".modal").classList.add("hidden");
  });
  [els.modal, els.addModal, els.altModal, els.noteModal].forEach(m => {
    m.addEventListener("click", e => { if (e.target === m) m.classList.add("hidden"); });
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
  });

  els.modal.addEventListener("click", e => {
    const jump = e.target.closest("[data-jump]");
    if (jump) {
      els.modal.classList.add("hidden");
      const id = jump.dataset.jump;
      const card = document.getElementById("card-" + id);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("flash");
        setTimeout(() => card.classList.remove("flash"), 1400);
      }
    }
  });

  // -------- Boot --------
  populateFilters();
  readUrl();
  applyFilters({ skipUrl: true });
})();
