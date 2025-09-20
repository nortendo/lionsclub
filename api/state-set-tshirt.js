// state-set-tshirt.js
// Express router pour gérer la mise à jour des tailles de t-shirts
// Persistance simple dans ./state.json (à adapter selon ton infra)

const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const STATE_FILE = path.resolve(__dirname, 'state.json');

// --- Utils persistance -------------------------------------------------------
function loadState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    // structure attendue: { tshirtData: { [name]: "S|M|...|''" }, ... }
    if (!parsed || typeof parsed !== 'object') throw new Error('bad state');
    if (!parsed.tshirtData || typeof parsed.tshirtData !== 'object') {
      parsed.tshirtData = {};
    }
    return parsed;
  } catch {
    return { tshirtData: {} };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// --- Endpoint ---------------------------------------------------------------
// POST /api/state-set-tshirt
// Body attendu (JSON): { name, size } OU { name, remove: true }
router.post('/api/state-set-tshirt', express.json(), (req, res) => {
  try {
    const { name } = req.body || {};
    let { size, remove } = req.body || {};

    // Validation basique
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ ok: false, error: 'Paramètre "name" invalide.' });
    }

    const allowed = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const isRemove = remove === true || size === null || size === '';

    const state = loadState();
    state.tshirtData = state.tshirtData || {};

    if (isRemove) {
      // On normalise à '' (UI comprend que '' = pas de taille choisie)
      state.tshirtData[name] = '';
    } else {
      // Validation de la taille
      if (typeof size !== 'string' || !allowed.includes(size)) {
        return res.status(400).json({
          ok: false,
          error: `Taille invalide. Tailles acceptées: ${allowed.join(', ')}`
        });
      }
      state.tshirtData[name] = size;
    }

    saveState(state);

    return res.json({
      ok: true,
      name,
      size: state.tshirtData[name] || ''
    });
  } catch (err) {
    console.error('state-set-tshirt error:', err);
    return res.status(500).json({ ok: false, error: 'Erreur serveur' });
  }
});

module.exports = router;
