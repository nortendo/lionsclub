const { getState, setState } = require('./_upstash.js');

function normPos(pos){
  if (pos === 'p1' || pos === 'p2') return pos;
  if (pos === 0 || pos === '0' || pos === 1 || pos === '1'){
    return (String(pos) === '0') ? 'p1' : 'p2';
  }
  return null;
}

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

  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body || {});
    const slotId = body.slotId;
    const rawPos = body.pos;
    const remove = body.remove === true;
    const name = body.name;

    const pos = normPos(rawPos);
    if (!slotId || !pos){
      // be lenient: silently no-op to avoid breaking UI if spurious calls happen
      return res.status(200).json({ ok:false, ignored:true });
    }

    const state = getState();
    state.scheduleData = state.scheduleData || {};
    const current = state.scheduleData[slotId] || { p1:null, p2:null };

    if (remove){
      current[pos] = null;
    } else {
      if (!name || typeof name !== 'string' || !name.trim()){
        return res.status(200).json({ ok:false, ignored:true });
      }
      current[pos] = name;
    }

    state.scheduleData[slotId] = current;
    setState(state);
    return res.status(200).json({ ok:true, slot: current });
  } catch(e){
    console.error('state-set-slot error', e);
    return res.status(500).json({ ok:false, error:'Erreur serveur' });
  }
};
