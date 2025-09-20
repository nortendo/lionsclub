// Vercel Serverless Function (no Express)
const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join('/tmp', 'state.json'); // stockage éphémère

function loadState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
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

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { name, size, remove } = (typeof req.body === 'string')
      ? JSON.parse(req.body || '{}')
      : (req.body || {});

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ ok: false, error: 'Paramètre "name" invalide.' });
    }

    const allowed = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const isRemove = remove === true || size === null || size === '';

    const state = loadState();

    if (isRemove) {
      state.tshirtData[name] = '';
    } else {
      if (typeof size !== 'string' || !allowed.includes(size)) {
        return res.status(400).json({ ok: false, error: `Taille invalide. Tailles acceptées: ${allowed.join(', ')}` });
      }
      state.tshirtData[name] = size;
    }

    saveState(state);
    return res.status(200).json({ ok: true, name, size: state.tshirtData[name] || '' });
  } catch (err) {
    console.error('state-set-tshirt error:', err);
    return res.status(500).json({ ok: false, error: 'Erreur serveur' });
  }
};
