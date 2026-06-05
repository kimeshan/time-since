<div style="display: flex; align-items: center;">
  <img src="https://storage.googleapis.com/flyweight-cdn/time_since_logo_transparent.png" alt="Time Since Logo" width="100" height="100">
  <h1 style="font-size: 30px; margin-left: 10px;">Time Since</h1>
</div>

**Repo:** [github.com/kimeshan/time-since](https://github.com/kimeshan/time-since)

[![GitHub stars](https://img.shields.io/github/stars/kimeshan/time-since?style=for-the-badge&logo=github&label=Star&color=EF0107&labelColor=0b1220)](https://github.com/kimeshan/time-since)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-22c55e?style=for-the-badge&labelColor=0b1220)](https://github.com/kimeshan/time-since/pulls)
[![MIT license](https://img.shields.io/github/license/kimeshan/time-since?style=for-the-badge&color=3b82f6&labelColor=0b1220)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

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
