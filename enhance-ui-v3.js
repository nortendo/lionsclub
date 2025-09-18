
// UI Enhancer v3: KPI hover/click, remove duplicate links, recolor badges (pris/dispo)
document.addEventListener("DOMContentLoaded", () => {
  function scrollToAndHighlight(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const orig = el.style.outline;
    el.style.outline = "3px solid #ffd166";
    setTimeout(() => { el.style.outline = orig; }, 1400);
  }

  function findCardByTitle(title) {
    // Find an element that contains the title and looks like a KPI block
    const all = Array.from(document.querySelectorAll("div, section, article"));
    for (const node of all) {
      const txt = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (txt && txt.toLowerCase().includes(title.toLowerCase())) {
        // Heuristic: prefer nodes that have numeric big value inside
        if (node.querySelector("strong, .big, .value, .stat-value, h3, .count, b")) {
          return node.closest(".stat-card, .card, .tile, .box, .panel, .shadow, .kpi") || node;
        }
      }
    }
    return null;
  }

  function makeKpiInteractive(title, targetId) {
    const card = findCardByTitle(title);
    if (!card) return;
    card.style.cursor = "pointer";
    card.style.transition = "background-color .15s ease";
    card.addEventListener("mouseenter", () => {
      card.dataset.origBg = getComputedStyle(card).backgroundColor;
      card.style.backgroundColor = "rgba(0,0,0,0.04)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.backgroundColor = card.dataset.origBg || "";
    });
    card.addEventListener("click", () => scrollToAndHighlight(targetId));
  }

  makeKpiInteractive("T-Shirts choisis", "tshirtsDetails");
  makeKpiInteractive("Créneaux réservés", "slotsDetails");

  // Remove duplicate "Voir détails ..." links (since KPI are clickable)
  Array.from(document.querySelectorAll("a")).forEach(a => {
    const t = (a.textContent || "").trim();
    if (/^voir détails (t-shirts|créneaux réservés)/i.test(t)) {
      a.classList.add("kpi-dup-link");
      a.remove();
    }
  });

  // Recolor badges under summary
  function recolorBadges() {
    function styleBadges(root, bg, border, color) {
      if (!root) return;
      const pills = root.querySelectorAll("a, span, .badge, .pill, .chip");
      pills.forEach(p => {
        p.style.background = bg;
        p.style.border = `1px solid ${border}`;
        p.style.color = color;
        p.style.borderRadius = "10px";
      });
    }
    // Find headings
    const takenHeader = Array.from(document.querySelectorAll("*")).find(n => /créneaux déjà pris/i.test(n.textContent || ""));
    const availHeader = Array.from(document.querySelectorAll("*")).find(n => /créneaux disponibles/i.test(n.textContent || ""));

    // Assume the list is in the next sibling container or same parent
    const takenContainer = takenHeader ? (takenHeader.nextElementSibling || takenHeader.parentElement) : null;
    const availContainer = availHeader ? (availHeader.nextElementSibling || availHeader.parentElement) : null;

    // Red for pris, Green for dispo
    styleBadges(takenContainer, "#ffe5e5", "#f5b5b5", "#7a1f1f");
    styleBadges(availContainer, "#e8f8ee", "#b8ebc9", "#1e6f3d");
  }

  recolorBadges();
  // In case content is injected later
  setTimeout(recolorBadges, 400);
  setTimeout(recolorBadges, 1200);
});
