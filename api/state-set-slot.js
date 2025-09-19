import { getState, setState } from './_upstash.js';

function normalizeSlot(slotVal) {
  if (!slotVal) return { p1: null, p2: null };
  if (Array.isArray(slotVal)) {
    return { p1: slotVal[0] || null, p2: slotVal[1] || null };
  }
  if (typeof slotVal === 'object') {
    if ('p1' in slotVal || 'p2' in slotVal) {
      return { p1: slotVal.p1 || null, p2: slotVal.p2 || null };
    }
    return { p1: slotVal[0] || slotVal["0"] || null, p2: slotVal[1] || slotVal["1"] || null };
  }
  return { p1: null, p2: null };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { slotId, pos, name, remove } = body;
    if (!slotId) return res.status(400).json({ error: "slotId requis" });

    const state = await getState();
    state.scheduleData = state.scheduleData || {};
    const current = normalizeSlot(state.scheduleData[slotId]);

    if (!pos) {
      if (remove && name) {
        if (current.p1 === name) current.p1 = null;
        else if (current.p2 === name) current.p2 = null;
      } else if (name) {
        if (!current.p1) current.p1 = name;
        else if (!current.p2) current.p2 = name;
      }
    } else {
      const p = Number(pos) === 2 ? 'p2' : 'p1';
      if (remove) {
        current[p] = null;
      } else {
        if (!name) return res.status(400).json({ error: "name requis" });
        current[p] = name;
      }
    }

    state.scheduleData[slotId] = current;
    await setState(state);
    res.status(200).json({ ok: true, slot: current, state });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
