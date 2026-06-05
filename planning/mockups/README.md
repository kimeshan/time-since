# UI Mockups — pick a direction

Three self-contained HTML mockups. **Open each in a browser** (just double-click) —
they use the Tailwind CDN and a tiny inline script, so the count-ups actually tick.
They share the same seed data so you can compare the *layout/vibe*, not the numbers.

| Option | File | Vibe | Leads with |
|---|---|---|---|
| **A — The Drought Table** | [`option-a-drought-table.html`](./option-a-drought-table.html) | Dark, dramatic, ESPN-style | A ranked leaderboard of shame |
| **B — Facts Grid** | [`option-b-facts-grid.html`](./option-b-facts-grid.html) | Light, colourful, playful (closest to today's daisyUI look) | A grid of club-coloured fact cards |
| **C — Hero Explorer** | [`option-c-hero-explorer.html`](./option-c-hero-explorer.html) | Bold, minimal, typographic | One giant count-up + a prominent club/comp picker |

## How they differ

- **A** is for the *argument-starter*: the leaderboard is the hero, sortable by
  drought, with a pinned "Hall of Never". Best for virality/sharing a ranking.
- **B** is for *browsing*: scan many facts at once, each card themed to the club.
  Most faithful to the current app's look; easiest migration.
- **C** is for *"look up my club"*: the selector and one massive ticking number are
  the whole point; grid + table are secondary sections below.

## Not mutually exclusive

The real app can combine them: e.g. **C's hero + explorer** at the top, **B's grid**
of curated facts in the middle, **A's drought table** at the bottom. The mockups
isolate each idea so you can judge the strongest lead. Tell me which lead you want
(or "blend C + A", etc.) and I'll implement it in the Next.js app.

> All three are mobile-responsive — resize the window or open on a phone.
