// Prompt bank. tag: 'easy' = anyone at the table can answer, 'fan' = needs some football knowledge.
// DEEP plays reward answers nobody else gives. HUDDLE plays reward matching the family.

const DEEP = [
  ['Name a food you would find at a tailgate', 'easy'],
  ['Name a snack for watching the game', 'easy'],
  ['Name a city with an NFL team', 'easy'],
  ['Name an NFL team', 'easy'],
  ['Name a football team named after an animal', 'easy'],
  ['Name a position on a football team', 'easy'],
  ['Name something a football player wears', 'easy'],
  ['Name a football movie', 'easy'],
  ['Name something fans bring to a stadium', 'easy'],
  ['Name a college with a famous football team', 'easy'],
  ['Name a team mascot, pro or college', 'easy'],
  ['Name a famous quarterback, past or present', 'easy'],
  ['Name a singer or band that played a Super Bowl halftime show', 'easy'],
  ['Name something you hear a referee say or signal', 'easy'],
  ['Name a Thanksgiving side dish', 'easy'],
  ['Name a way to score points in football', 'easy'],
  ['Name a team color combination and the team that wears it', 'easy'],
  ['Name something people yell at the TV during a game', 'easy'],
  ['Name a sport other than football played with a ball', 'easy'],
  ['Name a state with no NFL team', 'easy'],
  ['Name a topping for a game-day hot dog', 'easy'],
  ['Name a backyard football rule every family argues about', 'easy'],
  ['Name a football penalty', 'fan'],
  ['Name an NFL team that has won a Super Bowl', 'fan'],
  ['Name an NFL team that has never won a Super Bowl', 'fan'],
  ['Name a Heisman Trophy winner', 'fan'],
  ['Name an NFL head coach, past or present', 'fan'],
  ['Name a college bowl game', 'fan'],
  ['Name a wide receiver in the Pro Football Hall of Fame', 'fan'],
  ['Name a running back who rushed for 10,000 career yards', 'fan'],
  ['Name an NFL stadium', 'fan'],
  ['Name a college football rivalry', 'fan'],
  ['Name a quarterback with more than one Super Bowl win', 'fan'],
  ['Name an NFL kicker or punter, past or present', 'fan'],
  ['Name a famous football announcer', 'fan'],
  ['Name a trick play', 'fan'],
  ['Name a Big Ten school', 'fan'],
  ['Name an SEC school', 'fan'],
  ['Name a Pittsburgh Steelers player, past or present', 'fan'],
  ['Name a Dallas Cowboys player, past or present', 'fan'],
  ['Name a Green Bay Packers player, past or present', 'fan'],
  ['Name a pair of brothers who both played in the NFL', 'fan'],
  ['Name a defensive player who won Super Bowl MVP or Defensive Player of the Year', 'fan'],
  ['Name a number 1 overall NFL draft pick', 'fan'],
  ['Name a team that moved to a different city', 'fan'],
  ['Name a famous play or game that has its own nickname', 'fan'],
  ['Name an offensive formation or defensive coverage', 'fan'],
  ['Name a left-handed quarterback', 'fan'],
];

const HUDDLE = [
  ['Who is the greatest quarterback of all time?', 'easy'],
  ['What is the best tailgate food?', 'easy'],
  ['Who in this family yells loudest at the TV?', 'easy'],
  ['Who in this family would last longest in a real NFL game?', 'easy'],
  ['Which team does this family love to hate?', 'easy'],
  ['What is the best football movie?', 'easy'],
  ['Who in this family falls asleep before halftime?', 'easy'],
  ['What is the best pie on the Thanksgiving table?', 'easy'],
  ['Who in this family would make the best head coach?', 'easy'],
  ['What is the best seat in the house for the big game?', 'easy'],
  ['Who in this family throws the best spiral?', 'easy'],
  ['Which team wins the next Super Bowl?', 'easy'],
  ['Who in this family takes backyard football too seriously?', 'easy'],
  ['What is the best game-day drink?', 'easy'],
];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a game script: mostly DEEP plays, a few HUDDLE plays in the middle, never first or last.
function buildPlays(count, crowd) {
  const pool = DEEP.filter(([, tag]) => crowd === 'fans' ? true : tag === 'easy');
  const deep = shuffle(pool.slice());
  const huddle = shuffle(HUDDLE.slice());
  const nHuddle = Math.max(1, Math.round(count / 4));
  const slots = shuffle(Array.from({ length: count - 2 }, (_, i) => i + 1)).slice(0, nHuddle);
  const plays = [];
  for (let i = 0; i < count; i++) {
    if (slots.includes(i)) plays.push({ q: huddle.pop()[0], type: 'huddle' });
    else plays.push({ q: deep.pop()[0], type: 'deep' });
  }
  return plays;
}

module.exports = { buildPlays };
