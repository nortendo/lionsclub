
import { getState, setState } from './_upstash.js';
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { name, size, email } = body;
    if (!name || !size) return res.status(400).json({ error: "name et size requis" });
    const state = await getState();
    state.tshirtData[name] = size;
    if (email && !state.members.find(m => m.email === email)) {
      state.members.push({ name, email });
    }
    await setState(state);
    res.status(200).json({ ok: true, state });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
