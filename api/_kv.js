// _kv.js compatible Vercel KV & Upstash Redis REST (fallback sur les deux jeux de variables)
const {
  KV_REST_API_URL,
  KV_REST_API_TOKEN,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
} = process.env;

const BASE_URL = KV_REST_API_URL || UPSTASH_REDIS_REST_URL;
const TOKEN = KV_REST_API_TOKEN || UPSTASH_REDIS_REST_TOKEN;

if (!BASE_URL || !TOKEN) {
  console.error('KV config manquante: définis KV_REST_API_URL/KV_REST_API_TOKEN ou UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN');
}

async function kvGet(key) {
  const r = await fetch(`${BASE_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  if (!r.ok) return null;
  const data = await r.json();
  let result = data.result;
  // si on stocke du JSON stringifié, reparse
  if (typeof result === 'string') {
    try { result = JSON.parse(result); } catch {}
  }
  return result;
}

// Upstash REST: /set/<key>/<value> avec POST (value dans l'URL)
async function kvSet(key, value) {
  const json = JSON.stringify(value);
  const r = await fetch(`${BASE_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(json)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` }
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
