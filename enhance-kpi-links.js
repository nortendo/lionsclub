
// Enhance KPI cards: clickable scroll to sections
document.addEventListener("DOMContentLoaded", () => {
  function scrollToAndHighlight(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({behavior: "smooth", block: "start"});
    el.style.transition = "background 0.6s";
    const orig = el.style.background;
    el.style.background = "#fff3cd";
    setTimeout(() => { el.style.background = orig; }, 1200);
  }

  const tshirtCard = document.querySelector(".stat-title:contains('T‑Shirts choisis')");
  const slotsCard = document.querySelector(".stat-title:contains('Créneaux réservés')");

  // Fallback: find via IDs
  const tshirtEl = document.getElementById("k2")?.closest(".stat-card");
  const slotEl = document.getElementById("k3")?.closest(".stat-card");

  if (tshirtEl) {
    tshirtEl.style.cursor = "pointer";
    tshirtEl.addEventListener("click", () => scrollToAndHighlight("tshirtsDetails"));
  }
  if (slotEl) {
    slotEl.style.cursor = "pointer";
    slotEl.addEventListener("click", () => scrollToAndHighlight("slotsDetails"));
  }
});
