// Room storage. Production: Upstash Redis over REST (no dependencies).
// Local play-testing: an in-memory map when DEEPBALL_DEV=1.

// Vercel's Upstash integration names these KV_REST_API_URL / KV_REST_API_TOKEN, optionally with a
// custom prefix; Upstash's own name is UPSTASH_REDIS_REST_URL / _TOKEN. Accept any of them.
function pick(suffixes) {
  for (const suf of suffixes) {
    if (process.env[suf]) return process.env[suf];
    const k = Object.keys(process.env).find((n) => n.endsWith('_' + suf) && process.env[n]);
    if (k) return process.env[k];
  }
  return '';
}
const URL_ = pick(['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL', 'REDIS_REST_URL']);
const TOKEN = pick(['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN', 'REDIS_REST_TOKEN']);
const DEV = !URL_ && process.env.DEEPBALL_DEV === '1';
const TTL = 60 * 60 * 6; // rooms disappear six hours after the last action
const mem = new Map();

// Write only if the stored version still matches what the caller read.
const CAS = `
local cur = redis.call('GET', KEYS[1])
local ok
if not cur then ok = (ARGV[1] == '0')
else ok = (tonumber(cjson.decode(cur).v) == tonumber(ARGV[1])) end
if ok then redis.call('SET', KEYS[1], ARGV[2], 'EX', tonumber(ARGV[3])) return 1 end
return 0`;

async function cmd(args) {
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

const key = (code) => `deepball:room:${code}`;

module.exports = {
  configured: () => DEV || !!(URL_ && TOKEN),
  // Names only (never values) of storage-looking settings, to make a wrong setup easy to spot.
  seen: () => Object.keys(process.env).filter((n) => /KV|REDIS|UPSTASH/i.test(n)).sort(),
  async get(code) {
    if (DEV) { const s = mem.get(code); return s ? JSON.parse(s) : null; }
    const s = await cmd(['GET', key(code)]);
    return s ? (typeof s === 'string' ? JSON.parse(s) : s) : null;
  },
  // expect = version previously read (0 for a brand-new room). Returns true when written.
  async cas(code, expect, room) {
    const body = JSON.stringify(room);
    if (DEV) {
      const cur = mem.get(code);
      const v = cur ? JSON.parse(cur).v : 0;
      if (v !== expect) return false;
      mem.set(code, body);
      return true;
    }
    return (await cmd(['EVAL', CAS, '1', key(code), String(expect), body, String(TTL)])) === 1;
  },
};
