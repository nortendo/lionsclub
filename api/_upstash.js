
const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!URL || !TOKEN) { throw new Error("Upstash env vars missing"); }
const KEY = "state-json";
async function upstash(cmd, ...args) {
  const path = [URL, cmd, ...args].map(s => String(s)).join("/");
  const res = await fetch(path, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) { throw new Error(`Upstash ${cmd} failed: ${res.status}`); }
  return res.json();
}
async function getState() {
  const data = await upstash("get", KEY);
  if (data && data.result) {
    try { return JSON.parse(data.result); } catch {}
  }
  return { tshirtData:{}, scheduleData:{}, members:[] };
}
async function setState(state) {
  const payload = JSON.stringify(state);
  return upstash("set", KEY, encodeURIComponent(payload));
}
export { getState, setState };
