# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. Keep this
file accurate — it is the source of truth for conventions. `CLAUDE.md` points here.

## What this project is

**Time Since** is a playful Next.js web app that counts up, live, the time since a
football club last won a "real" trophy. The running joke: only two competitions
count as a "real trophy" — the **top-tier domestic league** (e.g. English top
flight / Premier League, La Liga) and the **UEFA Champions League / European Cup**.
Cups like the FA Cup, League Cup, Europa League, etc. explicitly do **not** count.

The flagship fact is "Time Since Manchester United last won the league". The app
generalises this to any club and either competition, ranks clubs by how long their
drought is, and lets users explore facts via a grid and a club/competition selector.

## Tech stack

- **Next.js 13.4** (App Router, `app/` directory)
- **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS** + **daisyUI** (currently the `light` theme only)
- **Vercel** for hosting + `@vercel/analytics`
- Package manager: **Yarn** (`yarn.lock` is committed). Use `yarn`, not `npm`.
- **No database.** Data lives in a committed text file (see Data below).

## Commands

```bash
yarn install      # install deps
yarn dev          # start dev server at http://localhost:3000
yarn build        # production build (run before committing big changes)
yarn lint         # next lint (eslint-config-next, core-web-vitals)
yarn start        # serve a production build
```

There is no test runner configured yet. If you add logic worth testing (e.g. the
drought/ranking calculations), prefer a lightweight setup and document it here.

## Project layout

```
app/                  # Next.js App Router
  layout.tsx          # root layout, fonts, metadata, OG image, analytics
  page.tsx            # main page (currently the single Man United countup)
  globals.css         # Tailwind layers + body background
components/
  hooks/              # reusable React hooks (e.g. useCountUpTimer)
data/                 # committed text data (trophy dataset) — see Data
planning/             # product spec, data model docs, HTML mockups
public/               # static assets
```

## Conventions

- **Components**: function components, PascalCase names. Files for hooks are
  camelCase (`useCountUpTimer.tsx`); React components PascalCase.
- **Client vs server**: this is a static-leaning app. Add `"use client";` only to
  components that use hooks/state/effects (timers, selectors). Keep data loading
  and static rendering on the server where possible.
- **Imports**: use the `@/*` path alias (configured in `tsconfig.json`) for repo
  imports, e.g. `import useCountUpTimer from "@/components/hooks/useCountUpTimer";`.
- **Styling**: Tailwind utility classes + daisyUI components (`stat`, `btn`,
  `divider`, `card`, etc.). Mobile-first — always provide responsive variants
  (`md:`, `lg:`). Match the existing big-number, high-contrast aesthetic.
- **TypeScript**: strict. Export shared types/interfaces (see `TimeElapsed`).
  Avoid `any`.
- **Formatting**: 2-space indent, double quotes, semicolons (matches existing code
  and Prettier defaults). Run `yarn lint` before finishing.

## Data

There is **no DB by design**. The trophy dataset is a committed, human-editable
**text file** at `data/trophies.csv` (pipe-delimited — see `planning/DATA_MODEL.md`
for the exact schema). Rules baked into the data:

- Track, per club, the **last top-tier league title** and the **last Champions
  League / European Cup** win (date + season). A club's "last real trophy" is the
  more recent of the two.
- "League" means the country's **top flight across all eras** (so the old English
  First Division counts, not just the Premier League era).
- A club that has won neither is "never won a real trophy" — a first-class state,
  not missing data.

When adding/editing clubs, **verify dates against a reliable source** (Wikipedia
season pages, club sites) and keep ISO `YYYY-MM-DD` dates (the clinch/final date).

## How to approach changes

- Read `planning/SPEC.md` before doing product work — it defines features, ranking
  logic, and the brand/copy voice (cheeky, but never punching down unfairly).
- Keep the tone light and football-banter-y in user-facing copy.
- Preserve the live count-up feel: numbers should tick every second.
- Don't introduce a backend/DB without explicit sign-off — the text-file approach
  is intentional.
- Update this file and the planning docs when conventions or scope change.
