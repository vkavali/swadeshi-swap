(function () {
  "use strict";

  const COUNTRIES = window.COUNTRIES || {};
  const PRODUCTS = window.PRODUCTS || [];

  const els = {
    search: document.getElementById("search"),
    category: document.getElementById("category"),
    country: document.getElementById("country"),
    recommendation: document.getElementById("recommendation"),
    sort: document.getElementById("sort"),
    favsOnly: document.getElementById("favs-only"),
    reset: document.getElementById("reset"),
    surprise: document.getElementById("surprise"),
    themeToggle: document.getElementById("theme-toggle"),
    grid: document.getElementById("grid"),
    empty: document.getElementById("empty"),
    meta: document.getElementById("results-meta"),
    stats: document.getElementById("stats"),
    modal: document.getElementById("modal"),
    modalBody: document.getElementById("modal-body"),
    modalClose: document.getElementById("modal-close")
  };

  // ---- Persistent state ----
  const FAVS_KEY = "swadeshi.favs";
  const THEME_KEY = "swadeshi.theme";
  let favs = new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || "[]"));
  function saveFavs() { localStorage.setItem(FAVS_KEY, JSON.stringify([...favs])); }

  // Theme
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || (!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
  els.themeToggle.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, next);
  });

  // ---- Filter dropdown population ----
  const categories = Array.from(new Set(PRODUCTS.map(p => p.category))).sort();
  for (const c of categories) {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    els.category.appendChild(opt);
  }

  const usedCountryCodes = Array.from(new Set(PRODUCTS.map(p => p.foreign.country))).sort();
  for (const code of usedCountryCodes) {
    const c = COUNTRIES[code];
    if (!c) continue;
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `${c.flag} ${c.name}`;
    els.country.appendChild(opt);
  }

  // ---- Stats bar ----
  function renderStats() {
    const totalAlts = PRODUCTS.reduce((n, p) => n + p.indian.length, 0);
    const distinctCountries = new Set(PRODUCTS.map(p => p.foreign.country)).size;
    const avoidShare = PRODUCTS.filter(p => (COUNTRIES[p.foreign.country] || {}).recommendation === "avoid").length;
    const preferShare = PRODUCTS.filter(p => (COUNTRIES[p.foreign.country] || {}).recommendation === "prefer").length;
    els.stats.innerHTML = `
      <span class="stat-chip"><strong>${PRODUCTS.length}</strong> products tracked</span>
      <span class="stat-chip"><strong>${totalAlts}</strong> Indian alternatives</span>
      <span class="stat-chip"><strong>${distinctCountries}</strong> origin countries</span>
      <span class="stat-chip"><strong>${categories.length}</strong> categories</span>
      <span class="stat-chip">★ <strong>${favs.size}</strong> favorites</span>
      <span class="stat-chip" style="color:var(--avoid)">⚠ <strong>${avoidShare}</strong> avoid</span>
      <span class="stat-chip" style="color:var(--prefer)">✓ <strong>${preferShare}</strong> prefer</span>
    `;
  }

  // ---- Helpers ----
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({
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
  const RECOMMENDATION_ORDER = { avoid: 0, caution: 1, neutral: 2, prefer: 3 };

  // ---- Render card ----
  function renderCard(p) {
    const country = COUNTRIES[p.foreign.country] || { name: p.foreign.country, flag: "🏳️", recommendation: "neutral" };
    const isFav = favs.has(p.id);
    const altsHtml = p.indian.map(a => `
      <div class="alt">
        <div>
          <div class="name">${escapeHtml(a.name)}</div>
          <div class="meta">${escapeHtml(a.brand)}${a.madeIn ? " • " + escapeHtml(a.madeIn) : ""}</div>
          <div class="buy-row">
            ${buyLinks(a.name).map(b => `<a href="${b.url}" target="_blank" rel="noopener">Buy on ${b.label}</a>`).join("")}
          </div>
        </div>
        <div class="price">${escapeHtml(a.priceInr || "")}</div>
      </div>
    `).join("");

    const card = document.createElement("article");
    card.className = "card";
    card.id = "card-" + p.id;
    card.innerHTML = `
      <div class="row">
        <div class="foreign">
          <h3>${escapeHtml(p.foreign.name)}</h3>
          <div class="brand-line">${escapeHtml(p.foreign.brand)} • ${escapeHtml(p.foreign.priceInr || "")}</div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="category-pill">${escapeHtml(p.category)}</span>
          <button class="fav-btn ${isFav ? "on" : ""}" data-fav="${p.id}" type="button" aria-pressed="${isFav}" aria-label="Toggle favorite" title="Favorite">${isFav ? "★" : "☆"}</button>
        </div>
      </div>
      <div class="row">
        <button class="country-chip" data-country="${country.code || p.foreign.country}" type="button" aria-label="Show country details">
          <span class="flag">${country.flag || "🏳️"}</span>
          <span>From ${escapeHtml(country.name || p.foreign.country)}</span>
        </button>
        <span class="rec ${country.recommendation || "neutral"}">${recLabel(country.recommendation)}</span>
      </div>
      <div class="divider"></div>
      <div class="alts">
        <h4>Indian alternatives</h4>
        ${altsHtml}
      </div>
      ${p.notes ? `<div class="notes">${escapeHtml(p.notes)}</div>` : ""}
    `;
    return card;
  }

  // ---- Sort ----
  function sortProducts(list) {
    const mode = els.sort.value;
    const arr = list.slice();
    if (mode === "alpha") {
      arr.sort((a, b) => a.foreign.name.localeCompare(b.foreign.name));
    } else if (mode === "category") {
      arr.sort((a, b) => a.category.localeCompare(b.category) || a.foreign.name.localeCompare(b.foreign.name));
    } else if (mode === "recommendation") {
      arr.sort((a, b) => {
        const ra = (COUNTRIES[a.foreign.country] || {}).recommendation || "neutral";
        const rb = (COUNTRIES[b.foreign.country] || {}).recommendation || "neutral";
        return (RECOMMENDATION_ORDER[ra] ?? 9) - (RECOMMENDATION_ORDER[rb] ?? 9)
            || a.foreign.name.localeCompare(b.foreign.name);
      });
    } else if (mode === "favorites") {
      arr.sort((a, b) => Number(favs.has(b.id)) - Number(favs.has(a.id)));
    }
    return arr;
  }

  // ---- Filters ----
  function applyFilters({ skipUrl = false } = {}) {
    const q = els.search.value.trim().toLowerCase();
    const cat = els.category.value;
    const ctry = els.country.value;
    const rec = els.recommendation.value;
    const favsOnly = els.favsOnly.checked;

    let filtered = PRODUCTS.filter(p => {
      if (cat && p.category !== cat) return false;
      if (ctry && p.foreign.country !== ctry) return false;
      if (favsOnly && !favs.has(p.id)) return false;
      if (rec) {
        const c = COUNTRIES[p.foreign.country];
        if (!c || c.recommendation !== rec) return false;
      }
      if (q) {
        const hay = [
          p.foreign.name, p.foreign.brand, p.category,
          ...p.indian.flatMap(a => [a.name, a.brand])
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    filtered = sortProducts(filtered);

    els.grid.innerHTML = "";
    for (const p of filtered) els.grid.appendChild(renderCard(p));
    els.empty.classList.toggle("hidden", filtered.length > 0);
    els.meta.textContent = `${filtered.length} of ${PRODUCTS.length} products`;
    renderStats();

    if (!skipUrl) writeUrl();
  }

  // ---- Country modal ----
  function openCountry(code) {
    const c = COUNTRIES[code];
    if (!c) return;
    const rec = c.recommendation || "neutral";
    const verdictText = {
      prefer: "Friendly partner. Buy if Indian alternative isn't available — but consider Indian options first.",
      neutral: "Mixed picture. Indian alternatives are usually a smart choice.",
      caution: "Watch the political weather. Prefer Indian alternatives where viable.",
      avoid: "Strategic concerns. Strongly prefer Indian alternatives — every rupee diverted helps."
    }[rec];

    const fromHere = PRODUCTS.filter(p => p.foreign.country === code).slice(0, 12);
    const relatedHtml = fromHere.length
      ? `<div class="stat-row">
           <div class="label">Products tracked from ${escapeHtml(c.name)} (${fromHere.length})</div>
           <div class="related-list">
             ${fromHere.map(p => `<a href="#card-${p.id}" data-jump="${p.id}">${escapeHtml(p.foreign.name)} — ${escapeHtml(p.foreign.brand)}</a>`).join("")}
           </div>
         </div>` : "";

    els.modalBody.innerHTML = `
      <h2 id="modal-title">${c.flag} ${escapeHtml(c.name)}</h2>
      <div class="country-line">Country profile vs. India</div>

      <div class="stat-row"><div class="label">Diplomatic relationship</div>
        <div class="value">${escapeHtml(c.relationship || "—")}</div></div>
      <div class="stat-row"><div class="label">Treatment of Indians</div>
        <div class="value">${escapeHtml(c.treatmentOfIndians || "—")}</div></div>
      <div class="stat-row"><div class="label">Indian diaspora</div>
        <div class="value">${escapeHtml(c.diaspora || "—")}</div></div>
      <div class="stat-row"><div class="label">Trade balance with India</div>
        <div class="value">${escapeHtml(c.tradeBalance || "—")}</div></div>
      <div class="stat-row"><div class="label">FDI / investment posture</div>
        <div class="value">${escapeHtml(c.fdiPosture || "—")}</div></div>

      <div class="verdict ${rec}">
        <strong>${recLabel(rec)}.</strong> ${escapeHtml(verdictText || "")}
        ${c.note ? `<div style="margin-top:6px;">${escapeHtml(c.note)}</div>` : ""}
      </div>

      ${relatedHtml}
    `;
    els.modal.classList.remove("hidden");
  }
  function closeModal() { els.modal.classList.add("hidden"); }

  // ---- URL state sync ----
  function readUrl() {
    const h = location.hash.replace(/^#/, "");
    if (!h) return;
    const params = new URLSearchParams(h);
    if (params.get("q")) els.search.value = params.get("q");
    if (params.get("cat")) els.category.value = params.get("cat");
    if (params.get("country")) els.country.value = params.get("country");
    if (params.get("rec")) els.recommendation.value = params.get("rec");
    if (params.get("sort")) els.sort.value = params.get("sort");
    if (params.get("fav") === "1") els.favsOnly.checked = true;
  }
  function writeUrl() {
    const params = new URLSearchParams();
    if (els.search.value) params.set("q", els.search.value);
    if (els.category.value) params.set("cat", els.category.value);
    if (els.country.value) params.set("country", els.country.value);
    if (els.recommendation.value) params.set("rec", els.recommendation.value);
    if (els.sort.value && els.sort.value !== "default") params.set("sort", els.sort.value);
    if (els.favsOnly.checked) params.set("fav", "1");
    const s = params.toString();
    const newHash = s ? "#" + s : "";
    if (location.hash !== newHash) history.replaceState(null, "", location.pathname + location.search + newHash);
  }

  // ---- Surprise me ----
  function surpriseMe() {
    if (!PRODUCTS.length) return;
    // clear filters so the picked product is visible
    els.search.value = "";
    els.category.value = "";
    els.country.value = "";
    els.recommendation.value = "";
    els.favsOnly.checked = false;
    els.sort.value = "default";
    applyFilters();
    const pick = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const card = document.getElementById("card-" + pick.id);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("flash");
    setTimeout(() => card.classList.remove("flash"), 1400);
  }

  // ---- Reset ----
  function resetAll() {
    els.search.value = "";
    els.category.value = "";
    els.country.value = "";
    els.recommendation.value = "";
    els.sort.value = "default";
    els.favsOnly.checked = false;
    applyFilters();
  }

  // ---- Events ----
  ["input", "change"].forEach(ev => els.search.addEventListener(ev, () => applyFilters()));
  els.category.addEventListener("change", () => applyFilters());
  els.country.addEventListener("change", () => applyFilters());
  els.recommendation.addEventListener("change", () => applyFilters());
  els.sort.addEventListener("change", () => applyFilters());
  els.favsOnly.addEventListener("change", () => applyFilters());
  els.reset.addEventListener("click", resetAll);
  els.surprise.addEventListener("click", surpriseMe);

  els.grid.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      const id = fav.dataset.fav;
      if (favs.has(id)) favs.delete(id); else favs.add(id);
      saveFavs();
      applyFilters();
      return;
    }
    const chip = e.target.closest(".country-chip");
    if (chip) openCountry(chip.dataset.country);
  });

  els.modalClose.addEventListener("click", closeModal);
  els.modal.addEventListener("click", e => {
    if (e.target === els.modal) closeModal();
    const jump = e.target.closest("[data-jump]");
    if (jump) {
      closeModal();
      const id = jump.dataset.jump;
      const card = document.getElementById("card-" + id);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("flash");
        setTimeout(() => card.classList.remove("flash"), 1400);
      }
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // ---- Boot ----
  readUrl();
  applyFilters({ skipUrl: true });
})();
