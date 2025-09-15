export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  const { member, size, members } = req.body || {};
  if (!member) return res.status(400).end("member required");

  const h = { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` };
  let r = await fetch(process.env.UPSTASH_REDIS_REST_URL + "/get/state:tshirts", { headers: h });
  const raw = (await r.json()).result;
  const cur = raw ? JSON.parse(raw) : {};

  cur[member] = size ?? null;

  const ops = [["SET", "state:tshirts", JSON.stringify(cur)]];
  if (Array.isArray(members) && members.length) ops.push(["SET", "state:members", JSON.stringify(members)]);

  await fetch(process.env.UPSTASH_REDIS_REST_URL + "/pipeline", {
    method: "POST",
    headers: { "content-type": "application/json", ...h },
    body: JSON.stringify(ops)
  });

  res.status(200).end("ok");
}