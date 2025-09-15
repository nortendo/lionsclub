export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL + "/mget/state:tshirts/state:schedule/state:members";
  const r = await fetch(url, { headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }});
  const { result } = await r.json();
  const [tshirtDataRaw, scheduleDataRaw, membersRaw] = result || [];
  const tshirtData = tshirtDataRaw ? JSON.parse(tshirtDataRaw) : {};
  const scheduleData = scheduleDataRaw ? JSON.parse(scheduleDataRaw) : {};
  const members = membersRaw ? JSON.parse(membersRaw) : [];
  res.status(200).json({ tshirtData, scheduleData, members });
}