
import { getState } from './_upstash.js';
export default async function handler(req, res) {
  try {
    const state = await getState();
    res.status(200).json(state);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
