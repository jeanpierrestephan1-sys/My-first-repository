// One endpoint for the whole game. POST { a: action, code, pid, ... } -> { state } or { error }.
const crypto = require('crypto');
const store = require('../lib/store');
const E = require('../lib/engine');

const LETTERS = 'BCDFGHJKLMNPQRSTVWXZ'; // no vowels, so codes never spell anything
const REACTIONS = ['🏈', '🔥', '😂', '😱', '👏', '🚩'];

function newCode() {
  let s = '';
  for (let i = 0; i < 4; i++) s += LETTERS[crypto.randomInt(LETTERS.length)];
  return s;
}

// Read, change, write-if-unchanged; retry when two phones act in the same instant.
async function mutate(code, fn) {
  for (let i = 0; i < 8; i++) {
    const room = await store.get(code);
    if (!room) throw E.fail('That game has ended. Start a new one.');
    const v = room.v;
    if (fn(room) === false) return room;
    room.v = v + 1;
    if (await store.cas(code, v, room)) return room;
  }
  throw E.fail('Busy field. Try that again.');
}

const actions = {
  async create(b) {
    const name = E.cleanName(b.name);
    if (!name) throw E.fail('Add your name first.');
    const pid = crypto.randomBytes(12).toString('hex');
    for (let i = 0; i < 20; i++) {
      const code = newCode();
      const room = E.newRoom(code, pid);
      E.addPlayer(room, pid, name);
      room.v = 1;
      if (await store.cas(code, 0, room)) return { room, pid };
    }
    throw E.fail('Could not open a game. Try again.');
  },

  async join(b) {
    const name = E.cleanName(b.name);
    if (!name) throw E.fail('Add your name first.');
    let pid = b.pid;
    const room = await mutate(b.code, (r) => {
      if (pid && r.players[pid]) { r.players[pid].name = name; return; }
      pid = crypto.randomBytes(12).toString('hex');
      E.addPlayer(r, pid, name);
    });
    return { room, pid };
  },

  async state(b) {
    let room = await store.get(b.code);
    if (!room) throw E.fail('That game has ended. Start a new one.');
    const now = Date.now();
    const due = ['answer', 'review', 'result'].includes(room.phase) &&
      (now >= room.deadline || (room.phase === 'answer' && room.order.every((p) => room.answers[p])));
    if (due) room = await mutate(b.code, (r) => E.tick(r, Date.now(), false));
    return { room };
  },

  async cfg(b) {
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase !== 'lobby') return false;
      if ([6, 8, 12].includes(b.plays)) r.cfg.plays = b.plays;
      if (['family', 'fans'].includes(b.crowd)) r.cfg.crowd = b.crowd;
    }) };
  },

  async start(b) {
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase !== 'lobby') return false;
      if (r.order.length < 2) throw E.fail('You need at least two players. Share the code.');
      E.start(r);
    }) };
  },

  async answer(b) {
    const t = String(b.text || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    if (!t) throw E.fail('Type an answer first.');
    return { room: await mutate(b.code, (r) => {
      const p = r.players[b.pid];
      if (!p || r.phase !== 'answer' || r.answers[b.pid]) return false;
      const hm = !!b.hm && p.hm > 0 && r.plays[r.idx].type === 'deep';
      if (hm) p.hm -= 1;
      r.answers[b.pid] = { t, hm };
      E.tick(r, Date.now(), false); // last one in snaps the ball
    }) };
  },

  async flag(b) {
    return { room: await mutate(b.code, (r) => {
      const g = r.groups[b.gi];
      if (!r.players[b.pid] || r.phase !== 'review' || !g || g.pids.includes(b.pid)) return false;
      if (r.plays[r.idx].type !== 'deep') return false;
      const f = r.flags[b.gi] || (r.flags[b.gi] = []);
      const i = f.indexOf(b.pid);
      if (i >= 0) f.splice(i, 1); else f.push(b.pid);
    }) };
  },

  async skip(b) { // host moves things along
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase !== b.phase) return false;
      return E.tick(r, Date.now(), true);
    }) };
  },

  async react(b) {
    if (!REACTIONS.includes(b.e)) return actions.state(b);
    return { room: await mutate(b.code, (r) => {
      const p = r.players[b.pid];
      if (!p) return false;
      r.rxn += 1;
      r.rx.push({ id: r.rxn, pub: p.pub, e: b.e });
      if (r.rx.length > 12) r.rx.shift();
    }) };
  },

  async again(b) {
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase !== 'final') return false;
      r.phase = 'lobby'; r.plays = []; r.idx = 0; r.answers = {}; r.groups = []; r.results = null; r.deadline = 0;
      for (const id of r.order) Object.assign(r.players[id], { yards: 0, pts: 0, tds: 0, total: 0, fg: false });
    }) };
  },
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!store.configured()) {
    return res.status(503).json({ error: 'Almost there: add Upstash Redis to this Vercel project (Storage tab), then redeploy.' });
  }
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    b.code = String(b.code || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    const fn = Object.prototype.hasOwnProperty.call(actions, b.a) ? actions[b.a] : null;
    if (!fn) return res.status(400).json({ error: 'Unknown action' });
    if (b.a !== 'create' && b.code.length !== 4) throw E.fail('Game codes are four letters.');
    const { room, pid } = await fn(b);
    const me = pid || b.pid;
    if (!room.players[me] && b.a === 'state') return res.status(200).json({ error: 'You are not in this game yet.', gone: true });
    res.status(200).json({ pid, state: E.view(room, me, Date.now()) });
  } catch (e) {
    if (e.user) return res.status(200).json({ error: e.message, gone: /ended/.test(e.message) });
    console.error(e);
    res.status(500).json({ error: 'Something went wrong on our side. Try again.' });
  }
};
