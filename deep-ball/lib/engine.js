// Game rules. Pure functions over a room object; the API layer handles storage.
const { buildGame, shuffle } = require('./prompts');

const T = { pick: 12000, wager: 15000, answer: 30000, review: 12000, reviewHuddle: 7000, result: 9000, nudge: 6000 };
const COLORS = ['#E4002B', '#1D4ED8', '#F59E0B', '#7C3AED', '#0891B2', '#DB2777', '#111827', '#EA580C', '#0D9488', '#4D7C0F', '#9F1239', '#475569'];
const MAX_PLAYERS = 12;
const MIN_WAGER = 200;

function newRoom(code, hostPid) {
  return {
    v: 0, code, host: hostPid, phase: 'lobby',
    cfg: { plays: 8, crowd: 'family' },
    players: {}, order: [], plays: [], pool: {}, pick: null, idx: 0, deadline: 0,
    answers: {}, wagers: {}, ready: [], groups: [], flags: {}, results: null, rx: [], rxn: 0, seq: 0,
  };
}

function addPlayer(room, pid, name) {
  if (room.order.length >= MAX_PLAYERS) throw fail('This game is full (12 players).');
  const used = new Set(room.order.map((p) => room.players[p].num));
  let num; do { num = 1 + Math.floor(Math.random() * 99); } while (used.has(num));
  room.seq += 1;
  room.players[pid] = {
    pub: 'p' + room.seq, name, num, color: COLORS[(room.seq - 1) % COLORS.length],
    score: 0, deep: 0, streak: 0, hm: 1,
  };
  room.order.push(pid);
}

// Someone walks off the field. Their past answers stay on the board; nobody waits on them any more.
function removePlayer(room, pid, now) {
  if (!room.order.includes(pid)) return false;
  room.order = room.order.filter((p) => p !== pid);
  room.ready = (room.ready || []).filter((p) => p !== pid);
  delete room.answers[pid];
  if (room.host === pid && room.order.length) room.host = room.order[0];
  if (room.phase === 'lobby') { delete room.players[pid]; return true; }
  if (!room.order.length) { toLobby(room); return true; }
  if (room.phase === 'pick' && room.pick && room.pick.pid === pid) tick(room, now, true);
  else tick(room, now, false);
  return true;
}

function toLobby(room) {
  room.phase = 'lobby'; room.plays = []; room.pool = {}; room.pick = null; room.idx = 0;
  room.answers = {}; room.wagers = {}; room.ready = []; room.groups = []; room.flags = {}; room.results = null; room.deadline = 0;
  for (const id of Object.keys(room.players)) {
    if (!room.order.includes(id)) delete room.players[id];
    else Object.assign(room.players[id], { score: 0, deep: 0, streak: 0 });
  }
}

function cleanName(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 14);
}

function fail(msg) { const e = new Error(msg); e.user = true; return e; }

function start(room) {
  const g = buildGame(room.cfg.plays, room.cfg.crowd);
  room.plays = g.plays; room.pool = g.pool;
  room.idx = 0;
  for (const pid of room.order) {
    Object.assign(room.players[pid], { score: 0, deep: 0, streak: 0, hm: room.cfg.plays >= 12 ? 2 : 1 });
  }
  beginPlay(room, Date.now());
}

// A new play. Huddle plays come with their question; otherwise whoever is trailing picks a category.
function beginPlay(room, now) {
  room.answers = {}; room.wagers = {}; room.ready = []; room.groups = []; room.flags = {}; room.results = null; room.pick = null;
  const play = room.plays[room.idx];
  if (play.q) { room.phase = 'answer'; room.deadline = now + T.answer; return; }
  const low = Math.min(...room.order.map((p) => room.players[p].score));
  const trailing = room.order.filter((p) => room.players[p].score === low);
  const options = shuffle(Object.keys(room.pool).filter((c) => room.pool[c].length)).slice(0, 3);
  room.pick = { pid: trailing[room.idx % trailing.length], options };
  room.phase = 'pick';
  room.deadline = now + T.pick;
}

function choose(room, cat, now) {
  const play = room.plays[room.idx];
  if (!room.pick || !room.pick.options.includes(cat)) return false;
  play.cat = cat; play.q = room.pool[cat].pop();
  room.pick = null;
  if (play.final) { room.phase = 'wager'; room.deadline = now + T.wager; } // stakes first, question second
  else { room.phase = 'answer'; room.deadline = now + T.answer; }
  return true;
}

// The most a player may put on the final play. Anyone can risk at least $1,000, so nobody is out of it.
const maxWager = (p) => Math.max(1000, p.score);
function wagerOptions(p) {
  const m = maxWager(p);
  return [...new Set([MIN_WAGER, Math.round(m / 2 / 50) * 50, m])];
}
function setWager(room, pid, amt) {
  const p = room.players[pid];
  if (!wagerOptions(p).includes(amt)) return false;
  room.wagers[pid] = amt;
  return true;
}

// ---------- answer matching ----------
const FILLER = new Set(['the', 'a', 'an', 'of', 'and']);
const SWAP = { st: 'saint', mt: 'mount', ft: 'fort', dr: 'doctor', '1st': 'first', '2nd': 'second', '3rd': 'third' };
function norm(s) {
  const words = String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/['’.]/g, '').replace(/[^a-z0-9 ]+/g, ' ')
    .split(' ').filter(Boolean).map((w) => SWAP[w] || w);
  const kept = words.filter((w) => !FILLER.has(w));
  return (kept.length ? kept : words).map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w));
}
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}
function same(a, b) {
  const ja = a.join(''), jb = b.join('');
  if (ja === jb) return true;
  const [small, big] = a.length <= b.length ? [a, b] : [b, a];
  if (small.length && small.join('').length >= 3 && small.every((w) => big.includes(w))) return true; // "Brady" = "Tom Brady"
  const m = Math.min(ja.length, jb.length);
  return lev(ja, jb) <= (m >= 9 ? 2 : m >= 5 ? 1 : 0); // forgive typos
}
function groupAnswers(room) {
  const groups = [];
  for (const pid of room.order) {
    const a = room.answers[pid];
    if (!a || !a.t) continue;
    const n = norm(a.t);
    if (!n.length) continue;
    let g = groups.find((x) => same(x.n, n));
    if (!g) { g = { txt: a.t, n, pids: [], hm: [] }; groups.push(g); }
    g.pids.push(pid);
    if (a.hm) g.hm.push(pid);
  }
  groups.forEach((g) => delete g.n);
  return groups;
}

// The host rules that two answers on the board are the same thing.
function merge(room, a, b, now) {
  const A = room.groups[a], B = room.groups[b];
  if (!A || !B || a === b || !A.pids.length || !B.pids.length) return false;
  B.pids.push(...A.pids); B.hm.push(...A.hm);
  A.pids = []; A.hm = [];
  delete room.flags[a];
  room.flags[b] = (room.flags[b] || []).filter((p) => !B.pids.includes(p));
  nudge(room, now);
  return true;
}

// Activity on the board buys a little more review time and un-readies everyone.
function nudge(room, now) {
  room.ready = [];
  room.deadline = Math.max(room.deadline, now + T.nudge);
}

// ---------- scoring ----------
function overturned(room, gi) {
  const g = room.groups[gi];
  if (!g.pids.length) return false;
  const eligible = room.order.length - g.pids.length;
  const n = (room.flags[gi] || []).length;
  return eligible > 0 && n * 2 > eligible;
}

// What one answer is worth. size = how many people gave it, P = players in the game, stake = final-play wager.
function pay(play, size, hm, bad, P, stake) {
  if (play.final) {
    if (bad) return [-stake, 'Sacked'];
    if (size === 1) return [stake, 'Deep ball'];
    if (size === 2) return [0, 'No gain'];
    return [-stake, 'Turnover on downs'];
  }
  const v = play.value;
  if (play.type === 'huddle') {
    if (size < 2) return [0, 'Nobody open'];
    return [Math.round((v * (size - 1)) / Math.max(1, P - 1) / 10) * 10, size > 2 ? 'Huddle up' : 'Two on the same page'];
  }
  if (bad) return hm ? [-v, 'Hail Mary overturned'] : [-v / 2, 'Sacked'];
  if (hm) return size === 1 ? [v * 2, 'Hail Mary'] : [-v, 'Intercepted'];
  if (size === 1) return [v, 'Deep ball'];
  if (size === 2) return [v / 2, 'First down'];
  if (size === 3) return [v / 4, 'Short gain'];
  return [v / 10, 'Stuffed at the line'];
}

function score(room, now) {
  const play = room.plays[room.idx];
  const res = {};
  const P = room.order.length;
  room.groups.forEach((g, gi) => {
    g.bad = play.type === 'deep' && overturned(room, gi);
    for (const pid of g.pids) {
      const [gain, label] = pay(play, g.pids.length, g.hm.includes(pid), g.bad, P, room.wagers[pid] || MIN_WAGER);
      res[pid] = { gain, label, txt: g.txt };
    }
  });
  for (const pid of room.order) {
    const p = room.players[pid];
    const r = res[pid] || (res[pid] = { gain: 0, label: 'Delay of game', txt: '' });
    // Streak: back-to-back answers nobody matched earn a bonus. Huddle plays do not break a streak.
    if (r.label === 'Deep ball' || r.label === 'Hail Mary') {
      p.streak = (p.streak || 0) + 1; p.deep += 1;
      if (p.streak >= 2 && !play.final) { r.gain += Math.min(300, 100 * (p.streak - 1)); r.extra = `${p.streak} in a row`; }
    } else if (play.type === 'deep') p.streak = 0;
  }
  // A flag that sticks pays the people who threw it.
  room.groups.forEach((g, gi) => {
    if (!g.bad) return;
    const bonus = play.final ? 100 : play.value / 4;
    for (const pid of room.flags[gi] || []) {
      if (!res[pid] || !room.order.includes(pid)) continue;
      res[pid].gain += bonus;
      res[pid].extra = res[pid].extra ? `${res[pid].extra}, good flag` : 'Good flag';
    }
  });
  for (const pid of room.order) {
    const p = room.players[pid], r = res[pid];
    r.from = p.score; p.score += r.gain; r.to = p.score;
  }
  room.results = res;
  room.phase = 'result';
  room.deadline = now + T.result;
}

function finish(room) {
  room.phase = 'final';
  room.deadline = 0;
}

// Move the game forward when a clock runs out or everyone is in. Returns true if anything changed.
function tick(room, now, force) {
  if (room.phase === 'pick') {
    if (!(force || now >= room.deadline)) return false;
    const o = room.pick.options;
    return choose(room, o[Math.floor(Math.random() * o.length)], now);
  }
  if (room.phase === 'wager') {
    const all = room.order.every((pid) => room.wagers[pid]);
    if (!(all || force || now >= room.deadline)) return false;
    for (const pid of room.order) if (!room.wagers[pid]) room.wagers[pid] = MIN_WAGER;
    room.phase = 'answer'; room.deadline = now + T.answer;
    return true;
  }
  if (room.phase === 'answer') {
    const all = room.order.length > 0 && room.order.every((pid) => room.answers[pid]);
    if (!(all || force || now >= room.deadline)) return false;
    room.groups = groupAnswers(room);
    room.ready = [];
    room.phase = 'review';
    room.deadline = now + (room.plays[room.idx].type === 'huddle' ? T.reviewHuddle : T.review);
    return true;
  }
  if (room.phase === 'review') {
    const all = room.order.length > 0 && room.order.every((pid) => room.ready.includes(pid));
    if (!(all || force || now >= room.deadline)) return false;
    score(room, now);
    return true;
  }
  if (room.phase === 'result') {
    if (!(force || now >= room.deadline)) return false;
    if (room.idx >= room.plays.length - 1) finish(room);
    else { room.idx += 1; beginPlay(room, now); }
    return true;
  }
  return false;
}

// ---------- what one player is allowed to see ----------
function view(room, pid, now) {
  const me = room.order.includes(pid) ? room.players[pid] : null;
  const pub = (id) => room.players[id].pub;
  const play = room.plays[room.idx];
  const waitOn = room.phase === 'wager' ? room.wagers : room.phase === 'review' ? Object.fromEntries((room.ready || []).map((p) => [p, 1])) : room.answers;
  const out = {
    v: room.v, code: room.code, phase: room.phase, cfg: room.cfg,
    you: me ? me.pub : null, host: room.host === pid,
    idx: room.idx, total: room.plays.length || room.cfg.plays,
    left: room.deadline ? Math.max(0, room.deadline - now) : 0,
    players: room.order.map((id) => {
      const p = room.players[id];
      return { pub: p.pub, name: p.name, num: p.num, color: p.color, score: p.score, deep: p.deep, streak: p.streak || 0, host: id === room.host, in: !!waitOn[id] };
    }),
    rx: room.rx,
  };
  const final = !!(play && play.final);
  if (play && play.q && ['answer', 'review', 'result'].includes(room.phase)) {
    out.play = { q: play.q, type: play.type, cat: play.cat, value: play.value, final, stake: final ? (room.wagers[pid] || MIN_WAGER) : 0 };
  }
  if (room.phase === 'pick' && room.pick) out.pick = { pub: pub(room.pick.pid), options: room.pick.options, mine: room.pick.pid === pid, value: play.value, final };
  if (room.phase === 'wager' && me) out.wager = { cat: play.cat, options: wagerOptions(me), mine: room.wagers[pid] || 0 };
  if (me) { out.hm = me.hm; out.mine = room.answers[pid] || null; out.ready = (room.ready || []).includes(pid); }
  if (room.phase === 'review' || room.phase === 'result') {
    out.groups = room.groups.map((g, gi) => {
      const bad = room.phase === 'result' ? !!g.bad : play.type === 'deep' && overturned(room, gi);
      const soloHm = g.pids.length === 1 && g.hm.length === 1;
      return {
        txt: g.txt, pubs: g.pids.map(pub), hm: g.hm.map(pub),
        flags: (room.flags[gi] || []).length,
        need: Math.floor((room.order.length - g.pids.length) / 2) + 1,
        flagged: (room.flags[gi] || []).includes(pid),
        mine: g.pids.includes(pid), bad,
        pay: final ? null : pay(play, g.pids.length, soloHm, bad, room.order.length, 0)[0],
        call: final ? (bad || g.pids.length > 2 ? 'Loses the stake' : g.pids.length === 2 ? 'No gain' : 'Wins the stake') : '',
      };
    });
  }
  if (room.phase === 'result' && room.results) {
    out.results = {};
    for (const id of room.order) if (room.results[id]) out.results[pub(id)] = room.results[id];
  }
  return out;
}

module.exports = { removePlayer, toLobby, newRoom, addPlayer, cleanName, start, tick, choose, setWager, merge, nudge, view, fail, groupAnswers };
