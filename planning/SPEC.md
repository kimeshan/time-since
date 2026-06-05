# Time Since — Product Spec (v2)

> Status: proposal for review. Pick a UI direction from `mockups/` (see
> `mockups/README.md`), then we implement.

## 1. The idea

V1 is a single live count-up: *"Time Since Manchester United last won the league."*
V2 keeps that joke but makes it a **platform for football schadenfreude**:

- Many facts, not one — a **grid of count-ups** for clubs and competitions.
- A **selector** so anyone can look up their own club's drought.
- A **leaderboard** ranking clubs by how long it's been.
- A sharpened brand: only a **league title** or the **Champions League** counts as
  a *real trophy*. Everything else (FA Cup, League Cup, Europa, Conference, the
  Charity Shield, "best fan experience" awards…) is lovingly dismissed.

Tagline candidates:
- **"Time Since your club won a *real* trophy."**
- "The FA Cup doesn't count."
- "Counting up, so you don't have to remember."

## 2. What counts as a "real trophy"

| Competition | Counts? |
|---|---|
| Top-tier domestic league (Premier League / First Division, La Liga, …) | ✅ |
| European Cup / UEFA Champions League | ✅ |
| FA Cup, Copa del Rey, League Cup, Europa League, Conference League, Super Cups, shields | ❌ |

"League" = the country's **top flight in any era** — so the old English First
Division counts (Newcastle 1927, Spurs 1961, Everton 1987 are all fair game).

A club's **"last real trophy"** = the more recent of {last league title, last UCL}.
A club that has won neither is in the **"Never"** club — its own (very funny) tier.

## 3. Core features

### 3.1 Hero count-up
The headline fact, ticking every second (years → months → days → hours → minutes →
seconds), like V1. Default: Manchester United and the league. Configurable as the
"fact of the day."

### 3.2 Facts grid
A responsive grid of cards, each a self-contained count-up:
- Club crest/colour, club name, the competition, the elapsed time.
- Curated launch set leans into the funniest facts, e.g.:
  - Time since **Man United** won the league — *13 years*.
  - Time since **Arsenal** won the Champions League — **never** (and they lost the
    2026 final to PSG on penalties).
  - Time since **Spurs** won the league — *65 years* (1961).
  - Time since **Newcastle** won the league — *~99 years* (1927).
  - Time since **Sevilla** won La Liga — *80 years* (1946).
- Cards mix two fact types: per-competition ("…won the Champions League") and the
  headline "…won a real trophy".

### 3.3 Explorer (club + competition selector)
Two dropdowns: **Club** and **Competition** (League / Champions League / Any real
trophy). Picking them swaps the hero count-up (and updates the URL, e.g.
`/?club=arsenal&comp=ucl`, so facts are shareable). "Never won" renders a special
state instead of a timer.

### 3.4 Leaderboard / ranking
A ranked table — the **"Drought Table"** — sorted by longest time since a real
trophy. "Never" clubs sit at the top (∞) or in a pinned "Hall of Never" section.
Columns: rank, club, last real trophy (competition + season), time since. Filter by
country/league. This is the shareable, argument-starting centrepiece.

### 3.5 Share
Per-fact OG image / "copy link" so a fact can be dunked on social. (Phase 2 can do
dynamic OG images; phase 1 reuses the static OG image.)

## 4. Data

No database (by design). One committed text file: `data/trophies.csv`
(pipe-delimited). Schema and parsing in `DATA_MODEL.md`. A small typed loader reads
+ parses it at build time and exposes helpers:
- `getClubs()`, `getClub(slug)`
- `lastRealTrophy(club)` → `{ competition, date, season }` or `null` (Never)
- `droughtRanking()` → clubs sorted by elapsed time (Never first)

## 5. Ranking logic

1. For each club compute `lastRealTrophyDate = max(lastLeagueTitle, lastUCL)`,
   ignoring `never` values.
2. Clubs with **no** real trophy → `Never` bucket, shown first (∞).
3. Remaining clubs sorted **ascending by date** (oldest first = longest drought =
   top of the table).
4. Ties broken alphabetically.

## 6. Brand & copy voice

- Cheeky, banter-y, knowing — like a clever football Twitter account.
- Punch at trophy droughts and delusions of grandeur, not at people. Keep it warm.
- Celebrate the absurd long ones (a century without a league title is *art*).
- Avoid slurs, real individuals, and anything mean-spirited about tragedies.

## 7. Non-goals (for now)

- No live-updating from an API / no auto-scraping in prod (manual data edits).
- No accounts, comments, or user submissions.
- No backend or DB.
- Non England/Spain leagues are out of scope for launch (easy to add later — the
  data file is league-agnostic).

## 8. Tech notes

- Stay on Next.js App Router + Tailwind + daisyUI.
- Count-up logic: generalise the existing `useCountUpTimer` hook to take any date
  and render a shared `<CountUp />` component used by hero + grid cards.
- Mobile-first; every layout must work at 360px wide.
- Consider a dark theme variant for the leaderboard (looks great with club colours).

## 9. Open questions for the user

1. Which UI direction (see `mockups/README.md`) — A, B, C, or a blend?
2. Should "Never" clubs top the leaderboard, or live in a separate "Hall of Never"?
3. Keep it England + Spain for launch, or seed a few more leagues now?
4. Light theme only (as today) or add a dark mode?
