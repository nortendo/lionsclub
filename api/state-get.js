const { getState } = require('./_kv.js');

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
  try {
    const state = await getState();
    return res.status(200).json(state);
  } catch (e) {
    console.error('state-get error', e);
    return res.status(500).json({ ok:false, error:'Erreur serveur' });
  }
};
