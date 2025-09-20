const fs = require('fs');
const path = require('path');
const STATE_FILE = path.join('/tmp', 'state.json');

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return { tshirtData: {} }; }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  const state = loadState();
  if (!state.tshirtData) state.tshirtData = {};
  return res.status(200).json(state);
};
