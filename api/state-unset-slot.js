
import { getState, setState } from './_upstash.js';
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { slotId, name } = body;
    if (!slotId || !name) return res.status(400).json({ error: "slotId et name requis" });
    const state = await getState();
    const arr = state.scheduleData[slotId] || [];
    const idx = arr.indexOf(name);
    if (idx !== -1) {
      arr.splice(idx,1);
      state.scheduleData[slotId] = arr;
      await setState(state);
    }
    res.status(200).json({ ok: true, state, taken: state.scheduleData[slotId] || [] });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
