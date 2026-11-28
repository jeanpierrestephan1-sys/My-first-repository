# Deep Ball

A live family quiz game with a football heart. Everyone answers the same question on their own phone,
and the answer nobody else gives is worth the most. Two things make it its own game:

- **Offense versus defense.** On each play one player is the defender. They secretly name three answers they
  expect the family to give. Anyone who gave one is picked off, and the defender takes their money.
- **The game remembers your family.** Every valid answer a family gives is burned in their league and pays half
  from then on. Questions come back as rematches, the easy answers die first, and season standings carry over.

- **Tournament play.** Rounds of three plays. The bottom half is knocked out each round and joins the defense
  against the survivors. The last two play a championship that ends on a wager. Titles go on the season table.

Also: 500 questions in seventeen categories, values from $200 to $1,000, streak bonuses, flags, Hail Marys, and a wager on the final play.

- `public/index.html` is the whole front end (fonts are bundled in `public/fonts`, SIL Open Font License)
- `api/game.js` is the one serverless endpoint
- `lib/` holds the rules, the question bank, the family league and the storage layer

## Put it on Vercel

1. In Vercel choose Add New, Project, and import this GitHub repository.
2. Set **Root Directory** to `deep-ball`. Leave the framework as "Other". Deploy.
3. Open the project's **Storage** tab, add **Upstash for Redis** (free plan) and connect it to the project.
4. Redeploy once so the new environment variables are picked up.

The game reads `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
Rooms delete themselves six hours after the last action. A family's league (burned answers and standings) is kept for about 400 days after its last game. A phone remembers its family's league, so any family member can start the next game.

## Try it on your own machine

`npm run dev`, then open http://localhost:3000 in two browser windows. Rooms live in memory.

## Add your own questions

Edit `lib/prompts.js`. Add a line to any category in `BANK`, or add a new category. `HUDDLE` questions reward matching the family.
