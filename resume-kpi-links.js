
(function () {
  function containsText(el, text) {
    if (!el) return false;
    return (el.textContent || "").trim().toLowerCase() === text.trim().toLowerCase();
  }
  function queryLinkByText(text) {
    const anchors = Array.from(document.querySelectorAll('a, button'));
    return anchors.find(a => (a.textContent || '').trim().toLowerCase() === text.toLowerCase());
  }
  function findKpiCardByLabel(labelText) {
    const all = Array.from(document.querySelectorAll('div, span, h3, h4, h5'));
    const holder = all.find(node => (node.textContent || '').trim().toLowerCase() === labelText.toLowerCase());
    if (!holder) return null;
    let p = holder;
    let depth = 0;
    while (p && depth < 6) {
      if (
        p.classList &&
        (
          /kpi|card|stat|resume|box|panel/.test(p.className) ||
          p.getAttribute('data-kpi') !== null ||
          p.style.border ||
          p.style.boxShadow
        )
      ) {
        return p;
      }
      p = p.parentElement;
      depth++;
    }
    return holder.parentElement || null;
  }
  function moveLinkIntoCard(linkText, cardLabel) {
    const link = queryLinkByText(linkText);
    const card = findKpiCardByLabel(cardLabel);
    if (!link || !card) return;
    const cloned = link.cloneNode(true);
    cloned.classList.add('kpi-inline-link');
    if (cloned.id) cloned.id = cloned.id + "-inline";
    let numberEl = card.querySelector('.stat-value, .kpi-value, .value, .text-4xl, .text-5xl, strong, b, .big');
    if (!numberEl) {
      card.appendChild(cloned);
    } else {
      numberEl.insertAdjacentElement('afterend', cloned);
    }
    const originalWrapper = link.closest('p, div, li') || link;
    originalWrapper.style.display = 'none';
  }
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    const resumeMarker = Array.from(document.querySelectorAll('*')).find(n => (n.textContent||'').includes("Résumé de l'organisation"));
    if (!resumeMarker) return;
    moveLinkIntoCard("Voir détails T-Shirts", "T‑Shirts choisis");
    moveLinkIntoCard("Voir détails T-Shirts", "T-Shirts choisis");
    moveLinkIntoCard("Voir détails créneaux réservés", "Créneaux réservés");
    moveLinkIntoCard("Voir détails créneaux réservés", "Créneaux réservés");
  });
})();
