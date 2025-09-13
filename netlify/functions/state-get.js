import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore({ name: "relais-vie", consistency: "strong" });
  const text = await store.get("state.json");
  const init = text ? JSON.parse(text) : { tshirtData: {}, scheduleData: {}, members: [] };
  return new Response(JSON.stringify(init), { headers: { "content-type": "application/json" } });
};
