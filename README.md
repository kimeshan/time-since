<div style="display: flex; align-items: center;">
  <img src="https://storage.googleapis.com/flyweight-cdn/time_since_logo_transparent.png" alt="Time Since Logo" width="100" height="100">
  <h1 style="font-size: 30px; margin-left: 10px;">Time Since</h1>
</div>

## About this app

A fun project that counts up — live — the time since a football club last won a
**real trophy**. The running joke: only the **top-tier league** (Premier League /
First Division, La Liga, Serie A, Bundesliga, Ligue 1) and the **Champions League /
European Cup** count. The FA Cup does not.

**V2** (current) generalises the original "Time Since Man United won the league"
into a small platform:

- A **hero count-up** with **club + competition** dropdowns (shareable via URL).
- A curated, rank-badged **grid of facts** ("the drought board").
- A **Hall of Never** for clubs still chasing their first real trophy.
- Every stat has an **ⓘ source link** to Wikipedia.

There is **no database** — data lives in the committed text file
[`data/trophies.csv`](./data/trophies.csv).

### Docs

- [`AGENTS.md`](./AGENTS.md) — conventions, stack, commands, data rules
- [`planning/SPEC.md`](./planning/SPEC.md) — product spec
- [`planning/DATA_MODEL.md`](./planning/DATA_MODEL.md) — data file schema
- [`planning/mockups/`](./planning/mockups/) — the UI mockups we chose from

## Getting Started

First, run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
