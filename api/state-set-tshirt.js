const { getState, setState } = require('./_kv.js');

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
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body || {});
    const { name } = body;
    let { size, remove } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ ok:false, error:'Paramètre "name" invalide' });
    }

    const allowed = ['XS','S','M','L','XL','XXL'];
    const isRemove = remove === true || size === null || size === '';

    const state = await getState();

    if (isRemove) {
      state.tshirtData[name] = '';
    } else {
      if (typeof size !== 'string' || !allowed.includes(size)) {
        return res.status(400).json({ ok:false, error:`Taille invalide. Tailles acceptées: ${allowed.join(', ')}` });
      }
      state.tshirtData[name] = size;
    }

    await setState(state);
    return res.status(200).json({ ok:true, name, size: state.tshirtData[name] || '' });
  } catch (e) {
    console.error('state-set-tshirt error', e);
    return res.status(500).json({ ok:false, error:'Erreur serveur' });
  }
};
