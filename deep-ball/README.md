# Deep Ball

A live family quiz game with a football heart. Everyone answers the same question on their own phone.
Twelve categories, from history to music to food. Each play has a dollar value that climbs from $200 to $1,000,
and the last play is double. The answer nobody else gives banks the full value; the obvious one gets stuffed.
The trailing player picks the next category. Most money wins.

- `public/index.html` is the whole front end (fonts are bundled in `public/fonts`, SIL Open Font License)
- `api/game.js` is the one serverless endpoint
- `lib/` holds the rules, the question bank and the room storage

## Put it on Vercel

1. In Vercel choose Add New, Project, and import this GitHub repository.
2. Set **Root Directory** to `deep-ball`. Leave the framework as "Other". Deploy.
3. Open the project's **Storage** tab, add **Upstash for Redis** (free plan) and connect it to the project.
4. Redeploy once so the new environment variables are picked up.

The game reads `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
Rooms delete themselves six hours after the last action.

## Try it on your own machine

`npm run dev`, then open http://localhost:3000 in two browser windows. Rooms live in memory.

## Add your own questions

Edit `lib/prompts.js`. Add a line to any category in `BANK`, or add a new category. `HUDDLE` questions reward matching the family.
