(function () {
  "use strict";

  const COUNTRIES = window.COUNTRIES || {};
  const PRODUCTS = window.PRODUCTS || [];

  const els = {
    search: document.getElementById("search"),
    category: document.getElementById("category"),
    country: document.getElementById("country"),
    recommendation: document.getElementById("recommendation"),
    grid: document.getElementById("grid"),
    empty: document.getElementById("empty"),
    meta: document.getElementById("results-meta"),
    modal: document.getElementById("modal"),
    modalBody: document.getElementById("modal-body"),
    modalClose: document.getElementById("modal-close")
  };

  // ---- Build filter options ----
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
  function recommendationLabel(r) {
    return ({ prefer: "Prefer", neutral: "Neutral", caution: "Caution", avoid: "Avoid" })[r] || "—";
  }

  // ---- Render ----
  function renderCard(p) {
    const country = COUNTRIES[p.foreign.country] || { name: p.foreign.country, flag: "🏳️", recommendation: "neutral" };
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
    card.innerHTML = `
      <div class="row">
        <div class="foreign">
          <h3>${escapeHtml(p.foreign.name)}</h3>
          <div class="brand-line">${escapeHtml(p.foreign.brand)} • ${escapeHtml(p.foreign.priceInr || "")}</div>
        </div>
        <span class="category-pill">${escapeHtml(p.category)}</span>
      </div>
      <div class="row">
        <button class="country-chip" data-country="${country.code || p.foreign.country}" type="button" aria-label="Show country details">
          <span class="flag">${country.flag || "🏳️"}</span>
          <span>From ${escapeHtml(country.name || p.foreign.country)}</span>
        </button>
        <span class="rec ${country.recommendation || "neutral"}">${recommendationLabel(country.recommendation)}</span>
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

  function applyFilters() {
    const q = els.search.value.trim().toLowerCase();
    const cat = els.category.value;
    const ctry = els.country.value;
    const rec = els.recommendation.value;

    const filtered = PRODUCTS.filter(p => {
      if (cat && p.category !== cat) return false;
      if (ctry && p.foreign.country !== ctry) return false;
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

    els.grid.innerHTML = "";
    for (const p of filtered) els.grid.appendChild(renderCard(p));
    els.empty.classList.toggle("hidden", filtered.length > 0);
    els.meta.textContent = `${filtered.length} of ${PRODUCTS.length} products`;
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

    els.modalBody.innerHTML = `
      <h2 id="modal-title">${c.flag} ${escapeHtml(c.name)}</h2>
      <div class="country-line">Country profile vs. India</div>

      <div class="stat"><div class="label">Diplomatic relationship</div>
        <div class="value">${escapeHtml(c.relationship || "—")}</div></div>

      <div class="stat"><div class="label">Treatment of Indians</div>
        <div class="value">${escapeHtml(c.treatmentOfIndians || "—")}</div></div>

      <div class="stat"><div class="label">Indian diaspora</div>
        <div class="value">${escapeHtml(c.diaspora || "—")}</div></div>

      <div class="stat"><div class="label">Trade balance with India</div>
        <div class="value">${escapeHtml(c.tradeBalance || "—")}</div></div>

      <div class="stat"><div class="label">FDI / investment posture</div>
        <div class="value">${escapeHtml(c.fdiPosture || "—")}</div></div>

      <div class="verdict ${rec}">
        <strong>${recommendationLabel(rec)}.</strong> ${escapeHtml(verdictText || "")}
        ${c.note ? `<div style="margin-top:6px;">${escapeHtml(c.note)}</div>` : ""}
      </div>
    `;
    els.modal.classList.remove("hidden");
  }
  function closeModal() { els.modal.classList.add("hidden"); }

  // ---- Events ----
  ["input", "change"].forEach(ev => {
    els.search.addEventListener(ev, applyFilters);
  });
  els.category.addEventListener("change", applyFilters);
  els.country.addEventListener("change", applyFilters);
  els.recommendation.addEventListener("change", applyFilters);

  els.grid.addEventListener("click", e => {
    const chip = e.target.closest(".country-chip");
    if (chip) openCountry(chip.dataset.country);
  });
  els.modalClose.addEventListener("click", closeModal);
  els.modal.addEventListener("click", e => { if (e.target === els.modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // ---- Initial render ----
  applyFilters();
})();
