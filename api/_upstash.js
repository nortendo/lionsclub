// Lightweight /tmp-backed storage for Vercel Serverless (no external DB)
const fs = require('fs');
const path = require('path');
const STATE_FILE = path.join('/tmp', 'state.json');

function ensureShape(state){
  if (!state || typeof state !== 'object') state = {};
  if (!state.tshirtData || typeof state.tshirtData !== 'object') state.tshirtData = {};
  if (!state.scheduleData || typeof state.scheduleData !== 'object') state.scheduleData = {};
  return state;
}

function getState(){
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return ensureShape(JSON.parse(raw));
  } catch {
    return ensureShape({});
  }
}

function setState(state){
  fs.writeFileSync(STATE_FILE, JSON.stringify(ensureShape(state), null, 2), 'utf8');
}

module.exports = { getState, setState, STATE_FILE };
