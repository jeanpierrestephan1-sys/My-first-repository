// A family's league: the memory that makes each family's game its own.
// burned: { question: [normalized answers the family has given] }
// standings: { nameKey: { name, games, wins, money, deep, picks } }
const store = require('./store');

const MAX_PER_QUESTION = 40;
const blank = () => ({ v: 0, games: 0, burned: {}, standings: {} });

const load = async (id) => (id ? (await store.get(id, 'league')) || blank() : null);

// Apply what just happened in a game (answers to burn, or a finished game) to the league. Returns the league.
async function apply(id, fx) {
  for (let i = 0; i < 6; i++) {
    const lg = (await store.get(id, 'league')) || blank();
    const v = lg.v;
    if (fx.burn) {
      const list = lg.burned[fx.burn.q] || (lg.burned[fx.burn.q] = []);
      for (const k of fx.burn.items) if (!list.includes(k) && list.length < MAX_PER_QUESTION) list.push(k);
    }
    if (fx.final && fx.final.length) {
      lg.games += 1;
      const top = Math.max(...fx.final.map((p) => p.score));
      for (const p of fx.final) {
        const key = p.name.toLowerCase();
        const s = lg.standings[key] || (lg.standings[key] = { name: p.name, games: 0, wins: 0, money: 0, deep: 0, picks: 0 });
        s.name = p.name; s.games += 1; s.money += p.score; s.deep += p.deep; s.picks += p.picks;
        if (p.score === top) s.wins += 1;
      }
    }
    lg.v = v + 1;
    if (await store.cas(id, v, lg, 'league')) return lg;
  }
  return null;
}

// The short version shown in the lobby and on the final screen.
function summary(lg) {
  if (!lg) return null;
  const table = Object.values(lg.standings).sort((a, b) => b.wins - a.wins || b.money - a.money).slice(0, 8)
    .map((s) => ({ name: s.name, games: s.games, wins: s.wins, money: s.money, picks: s.picks }));
  return { games: lg.games, burned: Object.values(lg.burned).reduce((n, l) => n + l.length, 0), table };
}

module.exports = { load, apply, summary };
