// Game rules. Pure functions over a room object; the API layer handles storage.
// Three ideas drive the game:
//   1. Offense vs defense: defenders name answers they expect the family to give; anyone who gave one
//      is picked off and the defender takes their money.
//   2. Family memory: every valid answer a family gives is "burned" in their league and pays half forever after.
//   3. Tournament play: rounds of three plays, the bottom half is knocked out each round, and the
//      knocked-out players join the defense against the survivors. The last two play for the title.
const { buildGame, shuffle } = require('./prompts');

const T = { pick: 12000, wager: 15000, answer: 35000, review: 14000, reviewHuddle: 7000, result: 9000, cut: 12000, nudge: 6000 };
const COLORS = ['#E4002B', '#1D4ED8', '#F59E0B', '#7C3AED', '#0891B2', '#DB2777', '#111827', '#EA580C', '#0D9488', '#4D7C0F', '#9F1239', '#475569'];
const MAX_PLAYERS = 12;
const MIN_WAGER = 200;
const ROUND_NAMES = ['Championship', 'Playoff', 'Wild card', 'Opening round'];
const PLAYS_PER_ROUND = 3;

function newRoom(code, hostPid, league) {
  return {
    v: 0, code, host: hostPid, phase: 'lobby', league: league || '', season: null,
    cfg: { plays: 8, crowd: 'family', mode: 'game' },
    players: {}, order: [], plays: [], pool: {}, burned: {}, pick: null, defs: [], defN: 0, cov: [], idx: 0, deadline: 0,
    tour: null, alive: null, cutInfo: null, champ: null,
    answers: {}, wagers: {}, ready: [], groups: [], flags: {}, results: null, rx: [], rxn: 0, seq: 0,
  };
}

const fresh = () => ({ score: 0, total: 0, bounty: 0, deep: 0, picks: 0, streak: 0 });

function addPlayer(room, pid, name) {
  if (room.order.length >= MAX_PLAYERS) throw fail('This game is full (12 players).');
  const used = new Set(room.order.map((p) => room.players[p].num));
  let num; do { num = 1 + Math.floor(Math.random() * 99); } while (used.has(num));
  room.seq += 1;
  room.players[pid] = { pub: 'p' + room.seq, name, num, color: COLORS[(room.seq - 1) % COLORS.length], hm: 1, ...fresh() };
  room.order.push(pid);
}

// Who is still playing offense, and who is on the bench (knocked out of a tournament, or joined mid-tournament).
const active = (room) => (room.tour ? room.order.filter((p) => room.alive.includes(p)) : room.order);
const bench = (room) => (room.tour ? room.order.filter((p) => !room.alive.includes(p)) : []);
const defenders = (room) => (room.defs || []).filter((p) => room.order.includes(p));

// Someone walks off the field. Their past answers stay on the board; nobody waits on them any more.
function removePlayer(room, pid, now) {
  if (!room.order.includes(pid)) return false;
  room.order = room.order.filter((p) => p !== pid);
  room.ready = (room.ready || []).filter((p) => p !== pid);
  room.defs = (room.defs || []).filter((p) => p !== pid);
  if (room.alive) room.alive = room.alive.filter((p) => p !== pid);
  delete room.answers[pid];
  if (room.host === pid && room.order.length) room.host = room.order[0];
  if (room.phase === 'lobby') { delete room.players[pid]; return true; }
  if (!room.order.length) { toLobby(room); return true; }
  if (room.phase === 'final') return true;
  if (room.tour && active(room).length < 2) { finish(room); return true; } // the last one standing takes the title
  if (room.phase === 'pick' && room.pick && room.pick.pid === pid) tick(room, now, true);
  else tick(room, now, false);
  return true;
}

function toLobby(room) {
  room.phase = 'lobby'; room.plays = []; room.pool = {}; room.burned = {}; room.pick = null; room.defs = []; room.cov = []; room.idx = 0;
  room.tour = null; room.alive = null; room.cutInfo = null; room.champ = null;
  room.answers = {}; room.wagers = {}; room.ready = []; room.groups = []; room.flags = {}; room.results = null; room.deadline = 0;
  for (const id of Object.keys(room.players)) {
    if (!room.order.includes(id)) delete room.players[id];
    else Object.assign(room.players[id], fresh());
  }
}

function cleanName(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 14);
}

function fail(msg) { const e = new Error(msg); e.user = true; return e; }

// How many players are still in at the start of each tournament round, ending with two.
function bracket(n) {
  const sizes = [n];
  while (sizes[sizes.length - 1] > 2) { const a = sizes[sizes.length - 1]; sizes.push(a <= 3 ? 2 : Math.ceil(a / 2)); }
  return sizes;
}

// lg = the family's league document (or null): which questions they have seen and which answers are burned.
function start(room, lg) {
  const history = (lg && lg.burned) || {};
  const g = buildGame(room.cfg.plays, room.cfg.crowd, new Set(Object.keys(history)));
  room.plays = g.plays; room.pool = g.pool;
  room.tour = null; room.alive = null; room.cutInfo = null; room.champ = null;
  if (room.cfg.mode === 'tourney' && room.order.length >= 3) {
    const sizes = bracket(room.order.length);
    room.tour = { sizes, round: 0 };
    room.alive = room.order.slice();
    room.plays = [];
    sizes.forEach((_, r) => {
      const last = r === sizes.length - 1;
      for (let k = 0; k < PLAYS_PER_ROUND; k++) {
        room.plays.push({ type: 'deep', cat: '', q: '', value: Math.min(1000, 200 * (k + 1 + r)), round: r, k, cut: !last && k === PLAYS_PER_ROUND - 1 });
      }
      if (last) room.plays.push({ type: 'deep', cat: '', q: '', value: 0, final: true, round: r, k: PLAYS_PER_ROUND });
    });
  }
  room.burned = {};
  for (const qs of Object.values(g.pool)) for (const q of qs) if (history[q] && history[q].length) room.burned[q] = history[q];
  room.idx = 0; room.defN = Math.floor(Math.random() * room.order.length);
  for (const pid of room.order) {
    Object.assign(room.players[pid], fresh(), { hm: room.cfg.plays >= 12 && !room.tour ? 2 : 1 });
  }
  beginPlay(room, Date.now());
}

// A new play. Huddle plays come with their question; otherwise whoever is trailing picks a category.
function beginPlay(room, now) {
  room.answers = {}; room.wagers = {}; room.ready = []; room.groups = []; room.flags = {}; room.results = null; room.pick = null; room.cov = []; room.cutInfo = null;
  const play = room.plays[room.idx];
  const on = active(room);
  // Who defends. Single game: the job rotates. Tournament: everyone who has been knocked out.
  // No defense on huddle plays or on the final wager.
  room.defs = [];
  if (play.type === 'deep' && !play.final) {
    if (room.tour) room.defs = bench(room);
    else if (on.length >= 3) { room.defs = [on[room.defN % on.length]]; room.defN += 1; }
  }
  if (play.q) { room.phase = 'answer'; room.deadline = now + T.answer; return; }
  const low = Math.min(...on.map((p) => room.players[p].score));
  const trailing = on.filter((p) => room.players[p].score === low);
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
  if (!active(room).includes(pid) || !wagerOptions(p).includes(amt)) return false;
  room.wagers[pid] = amt;
  return true;
}

// How many answers each defender may cover: three alone, fewer as the defense grows.
const slots = (room) => { const n = defenders(room).length; return n <= 1 ? 3 : n <= 3 ? 2 : 1; };

// Who has to act before the current phase can move on.
function needed(room) {
  if (room.phase === 'wager') return active(room);
  if (room.phase === 'answer') return [...new Set([...active(room), ...defenders(room)])];
  if (room.phase === 'review') return room.order;
  return [];
}
function done(room, pid) {
  if (room.phase === 'wager') return !!room.wagers[pid];
  if (room.phase === 'review') return (room.ready || []).includes(pid);
  return !!room.answers[pid];
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

// Sort the answers into groups, then mark which groups the defense covered and which the family burned before.
function groupAnswers(room) {
  const groups = [];
  const defs = defenders(room);
  for (const pid of active(room)) {
    const a = room.answers[pid];
    if (!a || !a.t || defs.includes(pid)) continue;
    const n = norm(a.t);
    if (!n.length) continue;
    let g = groups.find((x) => x.ns.some((m) => same(m, n)));
    if (!g) { g = { txt: a.t, ns: [], pids: [], hm: [], by: [], burned: false }; groups.push(g); }
    g.ns.push(n); g.pids.push(pid);
    if (a.hm) g.hm.push(pid);
  }
  const play = room.plays[room.idx];
  const old = ((room.burned || {})[play.q] || []).map((k) => k.split(' '));
  for (const g of groups) g.burned = play.type === 'deep' && old.some((k) => g.ns.some((n) => same(n, k)));
  room.cov = [];
  for (const d of defs) {
    const a = room.answers[d];
    for (const t of (a && a.cov) || []) {
      const n = norm(t);
      const gi = n.length ? groups.findIndex((g) => g.ns.some((m) => same(m, n))) : -1;
      if (gi >= 0 && !groups[gi].by.includes(d)) groups[gi].by.push(d);
      room.cov.push({ t, gi, by: d });
    }
  }
  groups.forEach((g) => delete g.ns);
  return groups;
}

// The host rules that two answers on the board are the same thing.
function merge(room, a, b, now) {
  const A = room.groups[a], B = room.groups[b];
  if (!A || !B || a === b || !A.pids.length || !B.pids.length) return false;
  B.pids.push(...A.pids); B.hm.push(...A.hm);
  B.by = [...new Set([...(B.by || []), ...(A.by || [])])]; B.burned = B.burned || A.burned;
  A.pids = []; A.hm = []; A.by = [];
  for (const c of room.cov || []) if (c.gi === a) c.gi = b;
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

const half = (n) => Math.round(n / 2 / 10) * 10;

// What one answer is worth before the defense gets involved.
// size = how many people gave it, P = players on offense, stake = final-play wager, burned = family said it in a past game.
function pay(play, size, hm, bad, P, stake, burned) {
  if (play.final) {
    if (bad) return [-stake, 'Sacked'];
    if (size === 1) return [burned ? half(stake) : stake, 'Deep ball'];
    if (size === 2 && P > 2) return [0, 'No gain'];
    return [-stake, 'Turnover on downs'];
  }
  const v = play.value;
  if (play.type === 'huddle') {
    if (size < 2) return [0, 'Nobody open'];
    return [Math.round((v * (size - 1)) / Math.max(1, P - 1) / 10) * 10, size > 2 ? 'Huddle up' : 'Two on the same page'];
  }
  if (bad) return hm ? [-v, 'Hail Mary overturned'] : [-v / 2, 'Sacked'];
  const cut = (n) => (burned ? half(n) : n);
  if (hm) return size === 1 ? [cut(v * 2), 'Hail Mary'] : [-v, 'Intercepted'];
  if (size === 1) return [cut(v), 'Deep ball'];
  if (size === 2) return [cut(v / 2), 'First down'];
  if (size === 3) return [cut(v / 4), 'Short gain'];
  return [cut(v / 10), 'Stuffed at the line'];
}

function score(room, now) {
  const play = room.plays[room.idx];
  const res = {};
  const on = active(room);
  const P = on.length;
  const defs = defenders(room).filter((d) => room.answers[d]);
  const take = {}, picks = {};
  const rematch = play.type === 'deep' && ((room.burned || {})[play.q] || []).length > 0;
  room.groups.forEach((g, gi) => {
    g.bad = play.type === 'deep' && overturned(room, gi);
    const by = (g.by || []).filter((d) => defs.includes(d));
    for (const pid of g.pids) {
      let [gain, label] = pay(play, g.pids.length, g.hm.includes(pid), g.bad, P, room.wagers[pid] || MIN_WAGER, g.burned);
      if (by.length) {
        // Picked off: each defender who covered it takes what the answer was worth, never less than a quarter of the play.
        for (const d of by) { picks[d] = (picks[d] || 0) + 1; take[d] = (take[d] || 0) + Math.max(g.bad ? 0 : gain, play.value / 4); }
        if (!g.bad) [gain, label] = g.hm.includes(pid) ? [-play.value, 'Hail Mary picked off'] : [0, 'Picked off'];
      }
      res[pid] = { gain, label, txt: g.txt };
      // New ground: on a rematch question, a solo answer the family has never given earns a bonus.
      if (rematch && !play.final && !g.burned && !g.bad && gain > 0 && g.pids.length === 1) { res[pid].gain += 100; res[pid].extra = 'new ground'; }
    }
  });
  for (const d of defs) {
    const n = picks[d] || 0;
    res[d] = { gain: take[d] || 0, label: n ? 'Pick six' : 'Burned deep', txt: '', extra: n ? `${n} picked off` : '', def: true };
    const p = room.players[d];
    p.picks = (p.picks || 0) + n; p.bounty = (p.bounty || 0) + (take[d] || 0);
  }
  for (const pid of room.order) {
    const p = room.players[pid];
    const r = res[pid] || (res[pid] = on.includes(pid) ? { gain: 0, label: 'Delay of game', txt: '' } : { gain: 0, label: 'On the sideline', txt: '', def: true });
    if (r.def) continue; // defending neither builds nor breaks a streak
    // Streak: back-to-back answers nobody matched earn a bonus. Huddle plays do not break a streak.
    if (r.label === 'Deep ball' || r.label === 'Hail Mary') {
      p.streak = (p.streak || 0) + 1; p.deep += 1;
      if (p.streak >= 2 && !play.final) { r.gain += Math.min(300, 100 * (p.streak - 1)); r.extra = (r.extra ? r.extra + ', ' : '') + `${p.streak} in a row`; }
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
    p.total = (p.total || 0) + r.gain;
  }
  room.results = res;
  room.phase = 'result';
  room.deadline = now + T.result;
  // Remember every valid answer for the family's league. (_fx is handed to the API layer, never stored.)
  if (play.type === 'deep') {
    const items = room.groups.filter((g) => g.pids.length && !g.bad).map((g) => norm(g.txt).join(' ')).filter(Boolean);
    if (items.length) room._fx = { burn: { q: play.q, items } };
  }
}

const rank = (room, pids) => pids.slice().sort((a, b) => {
  const A = room.players[a], B = room.players[b];
  return B.score - A.score || B.deep - A.deep || (a < b ? -1 : 1); // tie: more solo answers, then a coin toss (ids are random)
});

// End of a tournament round: the top of the table moves on, the rest join the defense.
function cutRound(room, now) {
  const order = rank(room, active(room));
  const keep = room.tour.sizes[room.tour.round + 1];
  room.cutInfo = {
    round: room.tour.round,
    through: order.slice(0, keep).map((p) => ({ pid: p, score: room.players[p].score })),
    out: order.slice(keep).map((p) => ({ pid: p, score: room.players[p].score })),
  };
  room.phase = 'cut';
  room.deadline = now + T.cut;
}
function nextRound(room, now) {
  room.alive = room.cutInfo.through.map((x) => x.pid).filter((p) => room.order.includes(p));
  room.tour.round += 1;
  for (const pid of room.order) { room.players[pid].score = 0; room.players[pid].streak = 0; } // every round starts level
  if (active(room).length < 2) { finish(room); return; }
  room.idx += 1;
  beginPlay(room, now);
}

function finish(room) {
  const on = rank(room, active(room));
  room.champ = room.tour && on.length ? on[0] : null;
  room.phase = 'final';
  room.deadline = 0;
  const top = Math.max(...room.order.map((pid) => room.players[pid].score));
  room._fx = {
    tourney: !!room.tour,
    final: room.order.map((pid) => {
      const p = room.players[pid];
      return { name: p.name, score: room.tour ? p.total || 0 : p.score, deep: p.deep, picks: p.picks || 0, win: room.tour ? pid === room.champ : p.score === top };
    }),
  };
}

// Move the game forward when a clock runs out or everyone is in. Returns true if anything changed.
function tick(room, now, force) {
  const all = () => { const n = needed(room); return n.length > 0 && n.every((pid) => done(room, pid)); };
  if (room.phase === 'pick') {
    if (!(force || now >= room.deadline)) return false;
    const o = room.pick.options;
    return choose(room, o[Math.floor(Math.random() * o.length)], now);
  }
  if (room.phase === 'wager') {
    if (!(all() || force || now >= room.deadline)) return false;
    for (const pid of active(room)) if (!room.wagers[pid]) room.wagers[pid] = MIN_WAGER;
    room.phase = 'answer'; room.deadline = now + T.answer;
    return true;
  }
  if (room.phase === 'answer') {
    if (!(all() || force || now >= room.deadline)) return false;
    room.groups = groupAnswers(room);
    room.ready = [];
    room.phase = 'review';
    room.deadline = now + (room.plays[room.idx].type === 'huddle' ? T.reviewHuddle : T.review);
    return true;
  }
  if (room.phase === 'review') {
    if (!(all() || force || now >= room.deadline)) return false;
    score(room, now);
    return true;
  }
  if (room.phase === 'result') {
    if (!(force || now >= room.deadline)) return false;
    if (room.idx >= room.plays.length - 1) finish(room);
    else if (room.tour && room.plays[room.idx].cut) cutRound(room, now);
    else { room.idx += 1; beginPlay(room, now); }
    return true;
  }
  if (room.phase === 'cut') {
    if (!(force || now >= room.deadline)) return false;
    nextRound(room, now);
    return true;
  }
  return false;
}

// ---------- what one player is allowed to see ----------
function view(room, pid, now) {
  const me = room.order.includes(pid) ? room.players[pid] : null;
  const pub = (id) => room.players[id].pub;
  const play = room.plays[room.idx];
  const on = active(room), defs = defenders(room), need = needed(room);
  const out = {
    v: room.v, code: room.code, phase: room.phase, cfg: room.cfg, league: room.league || '', season: room.season || null,
    you: me ? me.pub : null, host: room.host === pid,
    idx: room.idx, total: room.plays.length || room.cfg.plays,
    left: room.deadline ? Math.max(0, room.deadline - now) : 0,
    players: room.order.map((id) => {
      const p = room.players[id];
      return {
        pub: p.pub, name: p.name, num: p.num, color: p.color, score: p.score, bounty: p.bounty || 0, deep: p.deep, picks: p.picks || 0,
        streak: p.streak || 0, host: id === room.host, alive: on.includes(id), in: !need.includes(id) || done(room, id),
      };
    }),
    rx: room.rx,
  };
  if (room.tour && play) {
    const R = room.tour.sizes.length;
    const inRound = room.plays.filter((p) => p.round === play.round).length;
    out.tour = { round: play.round, rounds: R, name: ROUND_NAMES[R - 1 - play.round] || 'Round ' + (play.round + 1), k: play.k + 1, of: inRound, left: on.length };
  }
  const final = !!(play && play.final);
  const role = !me ? 'side' : defs.includes(pid) ? 'def' : on.includes(pid) ? 'off' : 'side';
  const defView = { pubs: defs.map(pub), slots: slots(room) };
  if (play && play.q && ['answer', 'review', 'result'].includes(room.phase)) {
    out.play = {
      q: play.q, type: play.type, cat: play.cat, value: play.value, final, role, defs: defView,
      stake: final ? (room.wagers[pid] || MIN_WAGER) : 0,
      burned: play.type === 'deep' ? ((room.burned || {})[play.q] || []).length : 0,
    };
  }
  if (room.phase === 'pick' && room.pick) {
    out.pick = {
      pub: pub(room.pick.pid), options: room.pick.options, mine: room.pick.pid === pid, value: play.value, final, defs: defView, role,
      rematch: room.pick.options.map((c) => { const l = room.pool[c] || []; return ((room.burned || {})[l[l.length - 1]] || []).length > 0; }),
    };
  }
  if (room.phase === 'wager') out.wager = { cat: play.cat, options: me && on.includes(pid) ? wagerOptions(me) : [], mine: room.wagers[pid] || 0, role };
  if (room.phase === 'cut' && room.cutInfo) {
    const R = room.tour.sizes.length, r = room.cutInfo.round;
    const row = (x) => ({ pub: pub(x.pid), score: x.score });
    out.cut = {
      name: ROUND_NAMES[R - 1 - r] || 'Round ' + (r + 1), next: ROUND_NAMES[R - 2 - r] || 'the next round',
      through: room.cutInfo.through.filter((x) => room.players[x.pid]).map(row), out: room.cutInfo.out.filter((x) => room.players[x.pid]).map(row),
    };
  }
  if (room.phase === 'final' && room.tour) {
    const b = bench(room).filter((p) => (room.players[p].bounty || 0) > 0).sort((x, y) => room.players[y].bounty - room.players[x].bounty)[0];
    out.champ = room.champ && room.players[room.champ] ? pub(room.champ) : null;
    out.mvp = b ? pub(b) : null;
  }
  if (me) { out.hm = me.hm; out.mine = room.answers[pid] || null; out.ready = (room.ready || []).includes(pid); }
  if (room.phase === 'review' || room.phase === 'result') {
    const live = defs.filter((d) => room.answers[d]);
    out.cov = live.length ? (room.cov || []).filter((c) => live.includes(c.by)).map((c) => ({ t: c.t, by: pub(c.by), hit: c.gi >= 0 && room.groups[c.gi] ? room.groups[c.gi].pids.length : 0 })) : null;
    out.groups = room.groups.map((g, gi) => {
      const bad = room.phase === 'result' ? !!g.bad : play.type === 'deep' && overturned(room, gi);
      const soloHm = g.pids.length === 1 && g.hm.length === 1;
      const picked = (g.by || []).some((d) => live.includes(d));
      return {
        txt: g.txt, pubs: g.pids.map(pub), hm: g.hm.map(pub),
        flags: (room.flags[gi] || []).length,
        need: Math.floor((room.order.length - g.pids.length) / 2) + 1,
        flagged: (room.flags[gi] || []).includes(pid),
        mine: g.pids.includes(pid), bad, picked, burned: !!g.burned,
        pay: final ? null : picked && !bad ? 0 : pay(play, g.pids.length, soloHm, bad, on.length, 0, g.burned)[0],
        call: final ? (bad || g.pids.length > 2 || (g.pids.length === 2 && on.length <= 2) ? 'Loses the stake' : g.pids.length === 2 ? 'No gain' : g.burned ? 'Wins half the stake' : 'Wins the stake') : '',
      };
    });
  }
  if (room.phase === 'result' && room.results) {
    out.results = {};
    for (const id of room.order) if (room.results[id]) out.results[pub(id)] = room.results[id];
  }
  return out;
}

module.exports = { removePlayer, toLobby, newRoom, addPlayer, cleanName, start, tick, choose, setWager, merge, nudge, view, fail, groupAnswers, active, defenders, slots };
