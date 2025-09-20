const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;

async function kvGet(key) {
  const r = await fetch(`${KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
  });
  if (!r.ok) return null;
  const { result } = await r.json();
  return result;
}

async function kvSet(key, value) {
  const r = await fetch(`${KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ value })
  });
  if (!r.ok) throw new Error('KV set failed ' + r.status);
  return true;
}

function ensureShape(state) {
  if (!state || typeof state !== 'object') state = {};
  if (!state.tshirtData || typeof state.tshirtData !== 'object') state.tshirtData = {};
  if (!state.scheduleData || typeof state.scheduleData !== 'object') state.scheduleData = {};
  return state;
}

async function getState() {
  const s = await kvGet('lionsclub:state');
  return ensureShape(s || {});
}

async function setState(state) {
  await kvSet('lionsclub:state', ensureShape(state));
}

module.exports = { getState, setState };
