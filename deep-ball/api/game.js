// One endpoint for the whole game. POST { a: action, code, pid, ... } -> { state } or { error }.
const crypto = require('crypto');
const store = require('../lib/store');
const E = require('../lib/engine');
const League = require('../lib/league');

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
    const fx = room._fx; delete room._fx; // side effects for the family's league, never stored in the room
    room.v = v + 1;
    if (await store.cas(code, v, room)) {
      if (!fx || !room.league) return room;
      try {
        const lg = await League.apply(room.league, fx);
        if (lg && fx.final) return await mutate(code, (r) => { r.season = League.summary(lg); });
      } catch (e) { console.error('league', e); }
      return room;
    }
  }
  throw E.fail('Busy field. Try that again.');
}

const actions = {
  async create(b) {
    const name = E.cleanName(b.name);
    if (!name) throw E.fail('Add your name first.');
    const pid = crypto.randomBytes(12).toString('hex');
    // A returning family keeps its league (its burned answers and standings); a new one gets a fresh league.
    const league = /^[A-Z]{8}$/.test(String(b.league || '')) ? b.league : Array.from({ length: 8 }, () => LETTERS[crypto.randomInt(LETTERS.length)]).join('');
    const season = League.summary(await League.load(league));
    for (let i = 0; i < 20; i++) {
      const code = newCode();
      const room = E.newRoom(code, pid, league);
      room.season = season;
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
      if (pid && r.players[pid]) { r.players[pid].name = name; if (!r.order.includes(pid)) r.order.push(pid); return; }
      pid = crypto.randomBytes(12).toString('hex');
      E.addPlayer(r, pid, name);
    });
    return { room, pid };
  },

  async state(b) {
    let room = await store.get(b.code);
    if (!room) throw E.fail('That game has ended. Start a new one.');
    const now = Date.now();
    const due = ['pick', 'wager', 'answer', 'review', 'result'].includes(room.phase) &&
      (now >= room.deadline || (room.phase === 'answer' && room.order.every((p) => room.answers[p])));
    if (due) room = await mutate(b.code, (r) => E.tick(r, Date.now(), false));
    return { room };
  },

  async cfg(b) {
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase !== 'lobby') return false;
      if ([6, 8, 12].includes(b.plays)) r.cfg.plays = b.plays;
      if (['family', 'buffs'].includes(b.crowd)) r.cfg.crowd = b.crowd;
    }) };
  },

  async start(b) {
    const cur = await store.get(b.code);
    const lg = cur && cur.league ? await League.load(cur.league) : null;
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase !== 'lobby') return false;
      if (r.order.length < 2) throw E.fail('You need at least two players. Share the code.');
      E.start(r, lg);
    }) };
  },

  async answer(b) {
    const tidy = (x) => String(x || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    const t = tidy(b.text);
    const cov = (Array.isArray(b.cov) ? b.cov : []).map(tidy).filter(Boolean).slice(0, 3);
    if (!t && !cov.length) throw E.fail('Type an answer first.');
    return { room: await mutate(b.code, (r) => {
      const p = r.players[b.pid];
      if (!p || !r.order.includes(b.pid) || r.phase !== 'answer' || r.answers[b.pid]) return false;
      if (r.def === b.pid) { // the defender names up to three answers instead of giving one
        if (!cov.length) throw E.fail('Name at least one answer to cover.');
        r.answers[b.pid] = { t: '', cov };
        E.tick(r, Date.now(), false);
        return;
      }
      if (!t) throw E.fail('Type an answer first.');
      const hm = !!b.hm && p.hm > 0 && r.plays[r.idx].type === 'deep' && !r.plays[r.idx].final;
      if (hm) p.hm -= 1;
      r.answers[b.pid] = { t, hm };
      E.tick(r, Date.now(), false); // last one in snaps the ball
    }) };
  },

  async pick(b) {
    return { room: await mutate(b.code, (r) => {
      if (r.phase !== 'pick' || !r.pick || r.pick.pid !== b.pid) return false;
      return E.choose(r, String(b.cat), Date.now());
    }) };
  },

  async wager(b) {
    return { room: await mutate(b.code, (r) => {
      if (r.phase !== 'wager' || !r.order.includes(b.pid) || r.wagers[b.pid]) return false;
      if (!E.setWager(r, b.pid, Number(b.amt))) return false;
      E.tick(r, Date.now(), false); // last stake in reveals the question
    }) };
  },

  async merge(b) { // host rules two answers are the same
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase !== 'review') return false;
      return E.merge(r, Number(b.from), Number(b.into), Date.now());
    }) };
  },

  async ready(b) {
    return { room: await mutate(b.code, (r) => {
      if (r.phase !== 'review' || !r.order.includes(b.pid) || r.ready.includes(b.pid)) return false;
      r.ready.push(b.pid);
      E.tick(r, Date.now(), false); // everyone ready: score it now
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
      E.nudge(r, Date.now());
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
      E.toLobby(r);
    }) };
  },

  async end(b) { // host calls the game off; everyone goes back to the lobby
    return { room: await mutate(b.code, (r) => {
      if (r.host !== b.pid || r.phase === 'lobby') return false;
      E.toLobby(r);
    }) };
  },

  async leave(b) {
    const room = await mutate(b.code, (r) => E.removePlayer(r, b.pid, Date.now()));
    return { room, left: true };
  },
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!store.configured()) {
    return res.status(503).json({ error: 'Almost there: add Upstash Redis to this Vercel project (Storage tab), then redeploy.', seen: store.seen() });
  }
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    b.code = String(b.code || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    const fn = Object.prototype.hasOwnProperty.call(actions, b.a) ? actions[b.a] : null;
    if (!fn) return res.status(400).json({ error: 'Unknown action' });
    if (b.a !== 'create' && b.code.length !== 4) throw E.fail('Game codes are four letters.');
    const { room, pid, left } = await fn(b);
    if (left) return res.status(200).json({ left: true });
    const me = pid || b.pid;
    if (!room.order.includes(me) && b.a === 'state') return res.status(200).json({ error: 'You are not in this game yet.', gone: true });
    res.status(200).json({ pid, state: E.view(room, me, Date.now()) });
  } catch (e) {
    if (e.user) return res.status(200).json({ error: e.message, gone: /ended/.test(e.message) });
    console.error(e);
    res.status(500).json({ error: 'Something went wrong on our side. Try again.' });
  }
};
