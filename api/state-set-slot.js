export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  const { slotId, action, member, members } = req.body || {};
  if (!slotId || !action) return res.status(400).end("slotId and action required");

  const h = { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` };
  let r = await fetch(process.env.UPSTASH_REDIS_REST_URL + "/get/state:schedule", { headers: h });
  const raw = (await r.json()).result;
  const cur = raw ? JSON.parse(raw) : {};
  const arr = cur[slotId] || [];

  if (action === "add" && member) {
    if (!arr.includes(member) && arr.length < 2) arr.push(member);
  } else if (action === "remove" && member) {
    const i = arr.indexOf(member); if (i !== -1) arr.splice(i, 1);
  } else if (action === "clear") {
    cur[slotId] = [];
  }
  if (action !== "clear") cur[slotId] = arr;

  const ops = [["SET", "state:schedule", JSON.stringify(cur)]];
  if (Array.isArray(members) && members.length) ops.push(["SET","state:members", JSON.stringify(members)]);

  await fetch(process.env.UPSTASH_REDIS_REST_URL + "/pipeline", {
    method: "POST",
    headers: { "content-type":"application/json", ...h },
    body: JSON.stringify(ops)
  });
  res.status(200).end("ok");
}