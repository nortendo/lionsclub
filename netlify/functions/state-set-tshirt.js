import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { member, size, members } = await req.json();
  if (!member) {
    return new Response("member required", { status: 400 });
  }

  const store = getStore({ name: "relais-vie", consistency: "eventual" });
  const text = await store.get("state.json");
  const state = text ? JSON.parse(text) : { tshirtData: {}, scheduleData: {}, members: [] };

  state.tshirtData = state.tshirtData || {};
  state.tshirtData[member] = size ?? null;

  if (Array.isArray(members) && members.length) {
    state.members = members;
  }

  await store.set("state.json", JSON.stringify(state));
  return new Response("ok", { status: 200 });
};
