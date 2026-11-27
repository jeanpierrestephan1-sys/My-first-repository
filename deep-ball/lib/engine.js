// Game rules. Pure functions over a room object; the API layer handles storage.
const { buildPlays } = require('./prompts');

const T = { answer: 40000, review: 16000, reviewHuddle: 9000, result: 13000 };
const COLORS = ['#E4002B', '#1D4ED8', '#F59E0B', '#7C3AED', '#0891B2', '#DB2777', '#111827', '#EA580C', '#0D9488', '#4D7C0F', '#9F1239', '#475569'];
const MAX_PLAYERS = 12;

function newRoom(code, hostPid) {
  return {
    v: 0, code, host: hostPid, phase: 'lobby',
    cfg: { plays: 8, crowd: 'family' },
    players: {}, order: [], plays: [], idx: 0, deadline: 0,
    answers: {}, groups: [], flags: {}, results: null, rx: [], rxn: 0, seq: 0,
  };
}

function addPlayer(room, pid, name) {
  if (room.order.length >= MAX_PLAYERS) throw fail('This game is full (12 players).');
  const used = new Set(room.order.map((p) => room.players[p].num));
  let num; do { num = 1 + Math.floor(Math.random() * 99); } while (used.has(num));
  room.seq += 1;
  room.players[pid] = {
    pub: 'p' + room.seq, name, num, color: COLORS[(room.seq - 1) % COLORS.length],
    yards: 0, pts: 0, tds: 0, total: 0, hm: 1, fg: false,
  };
  room.order.push(pid);
}

function cleanName(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 14);
}

function fail(msg) { const e = new Error(msg); e.user = true; return e; }

function start(room) {
  room.plays = buildPlays(room.cfg.plays, room.cfg.crowd);
  room.idx = 0;
  for (const pid of room.order) {
    Object.assign(room.players[pid], { yards: 0, pts: 0, tds: 0, total: 0, fg: false, hm: room.cfg.plays >= 12 ? 2 : 1 });
  }
  beginPlay(room, Date.now());
}

function beginPlay(room, now) {
  room.phase = 'answer';
  room.answers = {}; room.groups = []; room.flags = {}; room.results = null;
  room.deadline = now + T.answer;
}

// ---------- answer matching ----------
function norm(s) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9 ]+/g, ' ')
    .split(' ').filter(Boolean)
    .filter((w, i, all) => !(i === 0 && all.length > 1 && (w === 'the' || w === 'a' || w === 'an')))
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w));
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

// ---------- scoring ----------
function overturned(room, gi) {
  const g = room.groups[gi];
  const eligible = room.order.length - g.pids.length;
  const n = (room.flags[gi] || []).length;
  return eligible > 0 && n * 2 > eligible;
}

function yardsFor(play, size, hm, bad) {
  if (play.type === 'huddle') {
    return size > 1 ? [Math.min(40, 12 * (size - 1)), size > 2 ? 'Huddle up' : 'Two on the same page'] : [0, 'Nobody open'];
  }
  if (bad) return hm ? [-15, 'Hail Mary overturned'] : [-10, 'Sacked'];
  if (hm) return size === 1 ? [60, 'Hail Mary'] : [-15, 'Intercepted'];
  if (size === 1) return [30, 'Deep ball'];
  if (size === 2) return [15, 'First down'];
  if (size === 3) return [8, 'Short gain'];
  return [4, 'Stuffed at the line'];
}

function score(room, now) {
  const play = room.plays[room.idx];
  const last = room.idx === room.plays.length - 1;
  const res = {};
  room.groups.forEach((g, gi) => {
    g.bad = play.type === 'deep' && overturned(room, gi);
    for (const pid of g.pids) {
      const [y, label] = yardsFor(play, g.pids.length, g.hm.includes(pid), g.bad);
      res[pid] = { gain: last ? y * 2 : y, label, txt: g.txt };
    }
  });
  for (const pid of room.order) {
    const p = room.players[pid];
    const r = res[pid] || (res[pid] = { gain: 0, label: 'Delay of game', txt: '' });
    r.from = p.yards;
    p.total += r.gain;
    let y = Math.max(0, p.yards + r.gain);
    r.td = 0;
    while (y >= 100) { y -= 100; p.pts += 7; p.tds += 1; r.td += 1; }
    p.yards = r.to = y;
  }
  room.results = res;
  room.phase = 'result';
  room.deadline = now + T.result;
}

function finish(room) {
  for (const pid of room.order) {
    const p = room.players[pid];
    p.fg = p.yards >= 65; // close enough to kick it
    if (p.fg) p.pts += 3;
  }
  room.phase = 'final';
  room.deadline = 0;
}

// Move the game forward when a clock runs out or everyone is in. Returns true if anything changed.
function tick(room, now, force) {
  if (room.phase === 'answer') {
    const all = room.order.length > 0 && room.order.every((pid) => room.answers[pid]);
    if (!(all || force || now >= room.deadline)) return false;
    room.groups = groupAnswers(room);
    room.phase = 'review';
    room.deadline = now + (room.plays[room.idx].type === 'huddle' ? T.reviewHuddle : T.review);
    return true;
  }
  if (room.phase === 'review') {
    if (!(force || now >= room.deadline)) return false;
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
  const me = room.players[pid];
  const pub = (id) => room.players[id].pub;
  const play = room.plays[room.idx];
  const inPlay = room.phase !== 'lobby';
  const out = {
    v: room.v, code: room.code, phase: room.phase, cfg: room.cfg,
    you: me ? me.pub : null, host: room.host === pid,
    idx: room.idx, total: room.plays.length || room.cfg.plays,
    left: room.deadline ? Math.max(0, room.deadline - now) : 0,
    players: room.order.map((id) => {
      const p = room.players[id];
      return { pub: p.pub, name: p.name, num: p.num, color: p.color, yards: p.yards, pts: p.pts, tds: p.tds, total: p.total, fg: p.fg, host: id === room.host, in: !!room.answers[id] };
    }),
    rx: room.rx,
  };
  if (inPlay && play) out.play = { q: play.q, type: play.type, last: room.idx === room.plays.length - 1 };
  if (me) { out.hm = me.hm; out.mine = room.answers[pid] || null; }
  if (room.phase === 'review' || room.phase === 'result') {
    out.groups = room.groups.map((g, gi) => ({
      txt: g.txt, pubs: g.pids.map(pub), hm: g.hm.map(pub),
      flags: (room.flags[gi] || []).length,
      need: Math.floor((room.order.length - g.pids.length) / 2) + 1,
      flagged: (room.flags[gi] || []).includes(pid),
      mine: g.pids.includes(pid), bad: !!g.bad,
    }));
  }
  if (room.phase === 'result' && room.results) {
    out.results = {};
    for (const id of room.order) if (room.results[id]) out.results[pub(id)] = room.results[id];
  }
  return out;
}

module.exports = { newRoom, addPlayer, cleanName, start, tick, view, fail, groupAnswers };
