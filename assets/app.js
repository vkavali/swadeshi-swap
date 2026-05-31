(function () {
  "use strict";

  const COUNTRIES = window.COUNTRIES || {};
  const CURATED = window.PRODUCTS || [];

  // -------- Storage --------
  const FAVS_KEY = "swadeshi.favs";
  const THEME_KEY = "swadeshi.theme";
  const CONTRIBS_KEY = "swadeshi.contribs.v1";
  const API_KEY = "swadeshi.api";

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

  // Backend config: localStorage > window.SWADESHI_CONFIG.apiBase
  let apiBase = (localStorage.getItem(API_KEY) || (window.SWADESHI_CONFIG && window.SWADESHI_CONFIG.apiBase) || "").replace(/\/+$/, "");
  let serverProducts = [];      // [{id, category, foreign, indian, notes}]
  let serverAltsByPid = {};     // {pid: [{name,brand,priceInr,madeIn}]}
  let serverNotesByPid = {};    // {pid: [{text, ts}]}

  async function api(path, opts = {}) {
    if (!apiBase) throw new Error("No backend configured");
    const r = await fetch(apiBase + path, {
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) }
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      throw new Error("API " + r.status + (t ? ": " + t : ""));
    }
    return r.status === 204 ? null : r.json();
  }

  async function loadFromBackend() {
    if (!apiBase) return;
    try {
      const data = await api("/api/products");
      serverProducts = data.products || [];
      serverAltsByPid = data.alternatives || {};
      serverNotesByPid = data.notes || {};
    } catch (e) {
      console.warn("Backend unreachable; using local data.", e.message);
      serverProducts = []; serverAltsByPid = {}; serverNotesByPid = {};
    }
  }

  // -------- Theme (light default) --------
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  // -------- Element refs --------
  const $ = id => document.getElementById(id);
  const els = {
    search: $("search"), category: $("category"), country: $("country"),
    recommendation: $("recommendation"), sort: $("sort"),
    favsOnly: $("favs-only"), mineOnly: $("mine-only"), needsOnly: $("needs-only"),
    reset: $("reset"), surprise: $("surprise"), themeToggle: $("theme-toggle"),
    addProduct: $("add-product"), exportContribs: $("export-contribs"), importContribs: $("import-contribs"),
    importFile: $("import-file"), submitContribs: $("submit-contribs"),
    grid: $("grid"), empty: $("empty"), meta: $("results-meta"), insights: $("insights"), stats: $("stats"),
    modal: $("modal"), modalBody: $("modal-body"),
    addModal: $("add-modal"), addForm: $("add-form"), addCountry: $("add-country"),
    altModal: $("alt-modal"), altForm: $("alt-form"), altContext: $("alt-context"),
    noteModal: $("note-modal"), noteForm: $("note-form"), noteContext: $("note-context"),
    panelCatalogue: $("panel-catalogue"), panelLive: $("panel-live"),
    liveQ: $("live-q"), liveGo: $("live-go"), liveGrid: $("live-grid"), liveMeta: $("live-meta"),
    tabs: document.querySelectorAll(".tab"),
    filterBadge: $("filter-badge")
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

  function hasContributions(data = contribs) {
    return Boolean(
      (data.products || []).length ||
      Object.values(data.alternatives || {}).some(items => (items || []).length) ||
      Object.values(data.notes || {}).some(items => (items || []).length)
    );
  }

  function productNeedsAlternatives(p) {
    return !(p.indian || []).length;
  }

  function productSourceLabel(p) {
    if (p._user) return "You";
    if (p._community) return "Community";
    return "Curated";
  }

  function searchTextFor(p) {
    const country = COUNTRIES[p.foreign.country] || {};
    return [
      p.foreign.name, p.foreign.brand, p.category, p.notes,
      country.name, country.recommendation, country.relationship,
      country.treatmentOfIndians, country.tradeBalance,
      ...(p.indian || []).flatMap(a => [a.name, a.brand, a.madeIn, a.priceInr]),
      ...(contribs.notes[p.id] || []).map(n => n.text),
      ...(serverNotesByPid[p.id] || []).map(n => n.text)
    ].join(" ").toLowerCase();
  }

  // Combined catalogue = curated + community (from backend) + user-local-only
  function allProducts() {
    const community = serverProducts.map(p => ({ ...p, _community: true }));
    // User-local products that haven't been pushed to backend yet
    const serverIds = new Set(serverProducts.map(p => p.id));
    const userOnly = contribs.products.filter(p => !serverIds.has(p.id)).map(p => ({ ...p, _user: true }));
    const merged = [...CURATED, ...community, ...userOnly];

    return merged.map(p => {
      const srvAlts = (serverAltsByPid[p.id] || []).map(a => ({ ...a, _community: true }));
      const localAlts = (contribs.alternatives[p.id] || []).map(a => ({ ...a, _user: true }));
      return {
        ...p,
        indian: [
          ...p.indian.map(a => p._community ? { ...a, _community: true } : a),
          // For curated products, server alts are extras (not in p.indian); for community ones the alts come via serverAltsByPid already, but p.indian already has them too. Dedupe by name+brand:
          ...srvAlts.filter(a => !(p.indian || []).some(b => b.name === a.name && b.brand === a.brand)),
          ...localAlts
        ]
      };
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
      <span class="stat-chip"><strong>${totalAlts}</strong> alt</span>
      <span class="stat-chip"><strong>${distinctCountries}</strong> countries</span>
      <span class="stat-chip"><strong>${cats.size}</strong> cat</span>
      <span class="stat-chip"><strong>${favs.size}</strong> fav</span>
      <span class="stat-chip"><strong>${contribs.products.length}</strong> yours</span>
      <span class="stat-chip" style="color:var(--avoid)"><strong>${avoidShare}</strong> avoid</span>
      <span class="stat-chip" style="color:var(--prefer)"><strong>${preferShare}</strong> prefer</span>
    `;
  }

  function renderInsights(filtered) {
    const total = allProducts().length;
    const visibleAlts = filtered.reduce((n, p) => n + (p.indian || []).length, 0);
    const needs = filtered.filter(productNeedsAlternatives).length;
    const watch = filtered.filter(p => {
      const rec = (COUNTRIES[p.foreign.country] || {}).recommendation;
      return rec === "avoid" || rec === "caution";
    }).length;
    const userVisible = filtered.filter(p => p._user || p._community).length;
    const categories = new Set(filtered.map(p => p.category)).size;
    const topCategory = Object.entries(filtered.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})).sort((a, b) => b[1] - a[1])[0];

    els.insights.innerHTML = `
      <div class="insight">
        <strong data-count="${filtered.length}">${filtered.length}</strong>
        <span>§ Visible · ${total}</span>
      </div>
      <div class="insight ${watch ? "warning" : ""}">
        <strong data-count="${watch}">${watch}</strong>
        <span>§ Watch list</span>
      </div>
      <div class="insight ${needs ? "warning" : ""}">
        <strong data-count="${needs}">${needs}</strong>
        <span>§ Needs alt</span>
      </div>
      <div class="insight">
        <strong data-count="${visibleAlts}">${visibleAlts}</strong>
        <span>§ Alternatives</span>
      </div>
      <div class="insight">
        <strong data-count="${categories}">${categories}</strong>
        <span>§ ${topCategory ? escapeHtml(topCategory[0]) : "Categories"}</span>
      </div>
      <div class="insight">
        <strong data-count="${userVisible}">${userVisible}</strong>
        <span>§ Community</span>
      </div>
    `;
    animateCounters();
  }

  // -------- Animate insight counters --------
  function animateCounters() {
    const targets = els.insights.querySelectorAll("strong[data-count]");
    targets.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target) || target === 0) { el.textContent = "0"; return; }
      const duration = 600;
      const start = performance.now();
      el.textContent = "0";
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
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

    const localNotes = (contribs.notes[p.id] || []).map((n, i) => `
      <div class="note-block">
        <button class="delete" data-del-note="${p.id}::${i}" title="Delete note">×</button>
        <span class="who">Your note</span> · <span class="meta">${escapeHtml(new Date(n.ts).toLocaleDateString())}</span>
        <div>${escapeHtml(n.text)}</div>
      </div>
    `).join("");
    const communityNotes = (serverNotesByPid[p.id] || []).map(n => `
      <div class="note-block">
        <span class="who">Community note</span> · <span class="meta">${escapeHtml(new Date(n.ts).toLocaleDateString())}</span>
        <div>${escapeHtml(n.text)}</div>
      </div>
    `).join("");
    const userNotes = communityNotes + localNotes;
    const needsAlt = productNeedsAlternatives(p);

    const altCount = (p.indian || []).length;
    const altsOpen = altCount <= 2;
    const altsSection = altCount > 0
      ? `<details class="alts-panel"${altsOpen ? " open" : ""}>
           <summary>Indian alternatives <span class="alt-count">${altCount}</span></summary>
           <div>${altsHtml}</div>
         </details>`
      : `<div class="alts"><h4>Indian alternatives</h4><div class="meta">No alternatives mapped yet — be the first to suggest one.</div></div>`;

    const card = document.createElement("article");
    card.className = "card";
    card.id = "card-" + p.id;
    const rec = country.recommendation || "neutral";
    card.setAttribute("data-rec", rec);
    card.innerHTML = `
      <div class="card-accent"></div>
      <div class="card-inner">
        <div class="card-top">
          <div class="card-flag-wrap">
            <button class="card-flag" data-country="${country.code || p.foreign.country}" type="button" title="${escapeHtml(country.name || p.foreign.country)}">${country.flag || "🏳️"}</button>
            <span class="rec-dot ${rec}"></span>
          </div>
          <div class="card-top-right">
            <span class="category-pill">${escapeHtml(p.category)}</span>
            <button class="fav-btn ${isFav ? "on" : ""}" data-fav="${p.id}" type="button" aria-pressed="${isFav}" title="Favorite">${isFav ? "★" : "☆"}</button>
          </div>
        </div>
        <div class="card-identity">
          <h3 class="card-title">${escapeHtml(p.foreign.name)}${p._user ? '<span class="user-badge">You</span>' : ""}</h3>
          <div class="card-brand">${escapeHtml(p.foreign.brand)}${p.foreign.priceInr ? " · " + escapeHtml(p.foreign.priceInr) : ""}</div>
        </div>
        <div class="card-meta-row">
          <button class="country-chip" data-country="${country.code || p.foreign.country}" type="button">
            From ${escapeHtml(country.name || p.foreign.country)}
          </button>
          <span class="rec-pill ${rec}">${recLabel(rec)}</span>
          ${needsAlt ? '<span class="needs-pill">Needs alts</span>' : ""}
        </div>
        <div class="card-alts">
          ${altsSection}
        </div>
        ${p.notes ? `<div class="notes">${escapeHtml(p.notes)}</div>` : ""}
        ${userNotes}
        <div class="card-actions">
          <button class="action-btn" data-add-alt="${p.id}" type="button"><span class="action-icon">+</span> Suggest alt</button>
          <button class="action-btn" data-add-note="${p.id}" type="button"><span class="action-icon">✎</span> Note</button>
          <span class="card-source">${productSourceLabel(p)}</span>
        </div>
      </div>
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
    else if (mode === "needs") arr.sort((a, b) => {
      const ra = (COUNTRIES[a.foreign.country] || {}).recommendation || "neutral";
      const rb = (COUNTRIES[b.foreign.country] || {}).recommendation || "neutral";
      return Number(productNeedsAlternatives(b)) - Number(productNeedsAlternatives(a))
        || (a.indian || []).length - (b.indian || []).length
        || (REC_ORDER[ra] ?? 9) - (REC_ORDER[rb] ?? 9)
        || a.foreign.name.localeCompare(b.foreign.name);
    });
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
      if (els.needsOnly.checked && !productNeedsAlternatives(p)) return false;
      if (rec) {
        const c = COUNTRIES[p.foreign.country];
        if (!c || c.recommendation !== rec) return false;
      }
      if (q) {
        if (!searchTextFor(p).includes(q)) return false;
      }
      return true;
    });

    filtered = sortProducts(filtered);

    // Grid opacity fade
    els.grid.style.opacity = "0";
    els.grid.innerHTML = "";
    let cardIndex = 0;
    for (const p of filtered) {
      const card = renderCard(p);
      card.style.setProperty("--card-index", cardIndex++);
      els.grid.appendChild(card);
    }
    // Trigger reflow then fade in
    void els.grid.offsetHeight;
    els.grid.style.opacity = "1";

    els.empty.classList.toggle("hidden", filtered.length > 0);
    els.meta.textContent = `${filtered.length} of ${allProducts().length} products`; // styled by CSS .results-meta
    renderInsights(filtered);
    renderStats();

    // Update active filter count badge
    let activeCount = 0;
    if (cat) activeCount++;
    if (ctry) activeCount++;
    if (rec) activeCount++;
    if (els.sort.value && els.sort.value !== "default") activeCount++;
    if (els.favsOnly.checked) activeCount++;
    if (els.mineOnly.checked) activeCount++;
    if (els.needsOnly.checked) activeCount++;
    if (els.filterBadge) {
      els.filterBadge.textContent = activeCount;
      els.filterBadge.setAttribute("data-count", activeCount);
    }

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
      <div class="country-line">§ Country profile vs. India</div>

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

  // -------- Eco-score / Nutri-score helpers --------
  const SCORE_COLORS = { a: "#4A7355", b: "#5A8A66", c: "#C69A2C", d: "#FF5722", e: "#BF3B2C" };
  function scoreHTML(grade, label) {
    if (!grade || grade === "unknown" || grade === "not-applicable") return "";
    const g = grade.toLowerCase();
    const color = SCORE_COLORS[g] || "#888";
    return `<span class="score-badge" style="--score-color:${color}" title="${label}: ${g.toUpperCase()}">${g.toUpperCase()}</span>`;
  }

  async function searchLive(query) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=24&fields=code,product_name,brands,brands_tags,countries_tags,origins,image_thumb_url,image_small_url,categories_tags,ecoscore_grade,ecoscore_score,nutriscore_grade,nutriscore_score`;
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

    const ecoGrade = p.ecoscore_grade;
    const nutriGrade = p.nutriscore_grade;

    card.innerHTML = `
      <div class="card-accent"></div>
      ${p.image_thumb_url || p.image_small_url
        ? `<img class="live-img" src="${escapeHtml(p.image_thumb_url || p.image_small_url)}" alt="" loading="lazy"/>`
        : `<div class="no-image">No image</div>`}
      <div class="card-inner">
        <div class="card-identity">
          <h3 class="card-title">${escapeHtml(name)}</h3>
          <div class="card-brand">${escapeHtml(brand)}</div>
        </div>
        <div class="score-row">
          ${scoreHTML(ecoGrade, "Eco-Score")}${ecoGrade && ecoGrade !== "unknown" ? '<span class="score-label">Eco</span>' : ""}
          ${scoreHTML(nutriGrade, "Nutri-Score")}${nutriGrade && nutriGrade !== "unknown" ? '<span class="score-label">Nutri</span>' : ""}
          ${(!ecoGrade || ecoGrade === "unknown") && (!nutriGrade || nutriGrade === "unknown") ? '<span class="score-label" style="opacity:.4">No scores available</span>' : ""}
        </div>
        ${country ? `<div class="card-meta-row">
          <button class="country-chip" data-country="${country.code}">From ${escapeHtml(country.name)}</button>
          <span class="rec-pill ${country.recommendation || "neutral"}">${recLabel(country.recommendation)}</span>
        </div>` : ""}
        <div class="card-alts">
          <div class="alts"><h4>Indian alternatives</h4>${altsHtml}</div>
        </div>
        <div class="card-actions">
          <a class="action-btn" href="https://world.openfoodfacts.org/product/${escapeHtml(p.code)}" target="_blank" rel="noopener"><span class="action-icon">↗</span> OFF page</a>
        </div>
      </div>
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

  els.addForm.addEventListener("submit", async e => {
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

    let pushed = false;
    if (apiBase) {
      try {
        await api("/api/products", { method: "POST", body: JSON.stringify(product) });
        await loadFromBackend();
        pushed = true;
      } catch (err) {
        alert("Backend save failed (" + err.message + "). Saved locally instead.");
      }
    }
    if (!pushed) {
      contribs.products.push(product);
      saveContribs();
    }

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

  els.altForm.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(els.altForm);
    const id = f.get("targetId");
    const alt = {
      name: f.get("iName").trim(),
      brand: f.get("iBrand").trim(),
      priceInr: f.get("iPrice").trim(),
      madeIn: f.get("iMadeIn").trim() || "India"
    };

    let pushed = false;
    if (apiBase) {
      try {
        await api(`/api/products/${encodeURIComponent(id)}/alternatives`, { method: "POST", body: JSON.stringify(alt) });
        await loadFromBackend();
        pushed = true;
      } catch (err) {
        alert("Backend save failed (" + err.message + "). Saved locally instead.");
      }
    }
    if (!pushed) {
      contribs.alternatives[id] = contribs.alternatives[id] || [];
      contribs.alternatives[id].push(alt);
      saveContribs();
    }
    applyFilters();
    els.altModal.classList.add("hidden");
  });

  els.noteForm.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(els.noteForm);
    const id = f.get("targetId");
    const text = f.get("note").trim();
    if (!text) return;

    let pushed = false;
    if (apiBase) {
      try {
        await api(`/api/products/${encodeURIComponent(id)}/notes`, { method: "POST", body: JSON.stringify({ text }) });
        await loadFromBackend();
        pushed = true;
      } catch (err) {
        alert("Backend save failed (" + err.message + "). Saved locally instead.");
      }
    }
    if (!pushed) {
      contribs.notes[id] = contribs.notes[id] || [];
      contribs.notes[id].push({ text, ts: Date.now() });
      saveContribs();
    }
    applyFilters();
    els.noteModal.classList.add("hidden");
  });

  function compactContributionPayload(raw) {
    if (!raw || typeof raw !== "object") throw new Error("JSON must be an object.");
    const products = Array.isArray(raw.products)
      ? raw.products.filter(p =>
          p && p.id && p.category && p.foreign &&
          p.foreign.name && p.foreign.brand && p.foreign.country &&
          Array.isArray(p.indian)
        )
      : [];

    function compactMap(map, keep) {
      if (!map || typeof map !== "object") return {};
      return Object.fromEntries(Object.entries(map)
        .map(([id, items]) => [id, Array.isArray(items) ? items.filter(keep) : []])
        .filter(([, items]) => items.length));
    }

    const alternatives = compactMap(raw.alternatives, a => a && a.name && a.brand);
    const notes = compactMap(raw.notes, n => n && n.text);
    const payload = { products, alternatives, notes };
    if (!hasContributions(payload)) throw new Error("No valid products, alternatives, or notes found.");
    return payload;
  }

  function mergeContributions(incoming) {
    let products = 0, alternatives = 0, notes = 0;
    const productIds = new Set(contribs.products.map(p => p.id));
    for (const p of incoming.products) {
      if (productIds.has(p.id)) continue;
      contribs.products.push(p);
      productIds.add(p.id);
      products++;
    }

    for (const [pid, items] of Object.entries(incoming.alternatives)) {
      contribs.alternatives[pid] = contribs.alternatives[pid] || [];
      const seen = new Set(contribs.alternatives[pid].map(a => [a.name, a.brand, a.priceInr, a.madeIn].join("|").toLowerCase()));
      for (const a of items) {
        const key = [a.name, a.brand, a.priceInr, a.madeIn].join("|").toLowerCase();
        if (seen.has(key)) continue;
        contribs.alternatives[pid].push(a);
        seen.add(key);
        alternatives++;
      }
    }

    for (const [pid, items] of Object.entries(incoming.notes)) {
      contribs.notes[pid] = contribs.notes[pid] || [];
      const seen = new Set(contribs.notes[pid].map(n => String(n.text || "").trim().toLowerCase()));
      for (const n of items) {
        const text = String(n.text || "").trim();
        const key = text.toLowerCase();
        if (!text || seen.has(key)) continue;
        contribs.notes[pid].push({ text, ts: n.ts || Date.now() });
        seen.add(key);
        notes++;
      }
    }

    saveContribs();
    return { products, alternatives, notes };
  }

  // Import / export contributions
  els.importContribs.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", async () => {
    const file = els.importFile.files && els.importFile.files[0];
    els.importFile.value = "";
    if (!file) return;
    try {
      const incoming = compactContributionPayload(JSON.parse(await file.text()));
      const counts = mergeContributions(incoming);
      populateFilters();
      applyFilters();
      alert(`Imported ${counts.products} products, ${counts.alternatives} alternatives, and ${counts.notes} notes.`);
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  });

  els.exportContribs.addEventListener("click", () => {
    if (!hasContributions()) {
      alert("No local contributions to export yet.");
      return;
    }
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
    if (!hasContributions()) {
      alert("No local contributions to submit yet.");
      return;
    }
    const body = "```json\n" + JSON.stringify(contribs, null, 2) + "\n```";
    const url = "https://github.com/vkavali/swadeshi-swap/issues/new"
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
    if (params.get("needs") === "1") els.needsOnly.checked = true;
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
    if (els.needsOnly.checked) params.set("needs", "1");
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
    els.recommendation.value = ""; els.favsOnly.checked = false; els.mineOnly.checked = false; els.needsOnly.checked = false;
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
    els.favsOnly.checked = false; els.mineOnly.checked = false; els.needsOnly.checked = false;
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
  els.needsOnly.addEventListener("change", () => applyFilters());

  els.grid.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) { const id = fav.dataset.fav; favs.has(id) ? favs.delete(id) : favs.add(id); saveFavs(); applyFilters(); return; }
    const flag = e.target.closest(".card-flag");
    if (flag) { openCountry(flag.dataset.country); return; }
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

  // -------- Settings (backend connection) --------
  const settingsModal = document.getElementById("settings-modal");
  const settingsForm = document.getElementById("settings-form");
  const settingsInput = document.getElementById("settings-api-base");
  const settingsStatus = document.getElementById("settings-status");
  const settingsTest = document.getElementById("settings-test");
  const settingsSync = document.getElementById("settings-sync");

  document.getElementById("settings").addEventListener("click", () => {
    settingsInput.value = apiBase || "";
    settingsStatus.textContent = apiBase ? `Connected to ${apiBase}` : "Not connected (local-only).";
    settingsModal.classList.remove("hidden");
  });

  settingsTest.addEventListener("click", async () => {
    const url = (settingsInput.value || "").replace(/\/+$/, "");
    if (!url) { settingsStatus.textContent = "Enter a URL first."; return; }
    settingsStatus.textContent = "Testing…";
    try {
      const r = await fetch(url + "/api/health");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      settingsStatus.textContent = j.ok ? `OK · ${j.ts}` : "Server replied but not ok.";
    } catch (e) {
      settingsStatus.textContent = "Failed: " + e.message;
    }
  });

  settingsForm.addEventListener("submit", async e => {
    e.preventDefault();
    const url = (settingsInput.value || "").replace(/\/+$/, "");
    apiBase = url;
    if (url) localStorage.setItem(API_KEY, url); else localStorage.removeItem(API_KEY);
    settingsStatus.textContent = "Saved. Loading community data…";
    await loadFromBackend();
    populateFilters();
    applyFilters();
    settingsStatus.textContent = url ? `Connected. ${serverProducts.length} community products loaded.` : "Local-only mode.";
    setTimeout(() => settingsModal.classList.add("hidden"), 600);
  });

  settingsSync.addEventListener("click", async () => {
    if (!apiBase) { settingsStatus.textContent = "Connect a backend first (Save URL)."; return; }
    settingsStatus.textContent = "Syncing…";
    let okP = 0, okA = 0, okN = 0, fail = 0;
    for (const p of contribs.products) {
      try { await api("/api/products", { method: "POST", body: JSON.stringify(p) }); okP++; }
      catch (e) { if (!String(e.message).includes("409")) fail++; }
    }
    for (const [pid, alts] of Object.entries(contribs.alternatives)) {
      for (const a of alts) {
        try { await api(`/api/products/${encodeURIComponent(pid)}/alternatives`, { method: "POST", body: JSON.stringify(a) }); okA++; }
        catch { fail++; }
      }
    }
    for (const [pid, notesArr] of Object.entries(contribs.notes)) {
      for (const n of notesArr) {
        try { await api(`/api/products/${encodeURIComponent(pid)}/notes`, { method: "POST", body: JSON.stringify({ text: n.text }) }); okN++; }
        catch { fail++; }
      }
    }
    settingsStatus.textContent = `Synced: ${okP} products, ${okA} alts, ${okN} notes${fail ? `, ${fail} failed` : ""}.`;
    await loadFromBackend();
    populateFilters();
    applyFilters();
  });

  // -------- Boot --------
  populateFilters();
  readUrl();
  applyFilters({ skipUrl: true });
  // Pull community data if a backend is configured
  if (apiBase) {
    loadFromBackend().then(() => {
      populateFilters();
      applyFilters({ skipUrl: true });
    });
  }
})();
