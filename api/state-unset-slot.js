// For compatibility if called; proxies to state-set-slot with remove:true
module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow','POST,OPTIONS');
    return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  }
  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body || {});
    body.remove = true;
    req.body = JSON.stringify(body);
    const handler = require('./state-set-slot.js');
    return handler(req, res);
  }catch(e){
    console.error('state-unset-slot error', e);
    return res.status(500).json({ ok:false, error:'Erreur serveur' });
  }
};
