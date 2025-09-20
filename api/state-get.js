const { getState } = require('./_upstash.js');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow','GET,OPTIONS');
    return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  const state = getState();
  return res.status(200).json(state);
};
