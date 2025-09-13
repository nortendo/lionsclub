import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { slotId, action, member, members } = await req.json();
  if (!slotId || !action) {
    return new Response("slotId and action required", { status: 400 });
  }

  const store = getStore({ name: "relais-vie", consistency: "eventual" });
  const text = await store.get("state.json");
  const state = text ? JSON.parse(text) : { tshirtData: {}, scheduleData: {}, members: [] };

  state.scheduleData = state.scheduleData || {};
  const arr = state.scheduleData[slotId] || [];

  if (action === "add") {
    if (member && !arr.includes(member) && arr.length < 2) {
      arr.push(member);
    }
  } else if (action === "remove") {
    if (typeof member === "string") {
      const idx = arr.indexOf(member);
      if (idx !== -1) arr.splice(idx, 1);
    }
  } else if (action === "clear") {
    state.scheduleData[slotId] = [];
  }

  if (action !== "clear") {
    state.scheduleData[slotId] = arr;
  }

  if (Array.isArray(members) && members.length) {
    state.members = members;
  }

  await store.set("state.json", JSON.stringify(state));
  return new Response("ok", { status: 200 });
};
