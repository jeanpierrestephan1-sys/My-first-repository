# Deep Ball

A live family football game. Everyone answers the same question on their own phone.
The answer nobody else gives goes long; the obvious one gets stuffed at the line.
100 yards is a touchdown. Most points after the last play wins.

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

Edit `lib/prompts.js`. `DEEP` questions reward rare answers, `HUDDLE` questions reward matching the family.
