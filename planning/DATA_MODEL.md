# Data Model — `data/trophies.csv`

No database. All trophy data lives in one committed, human-editable text file:
**`data/trophies.csv`**. It is pipe-delimited (`|`) rather than comma-delimited so
club names with commas/accents stay simple.

## File format

- Lines starting with `#` are comments. Blank lines are ignored.
- Every data line has **8 pipe-separated fields**:

```
club | country | league | lastLeagueTitle | lastLeagueSeason | lastUCL | lastUCLSeason | color
```

| # | Field | Type | Notes |
|---|---|---|---|
| 1 | `club` | string | Display name, e.g. `Manchester United`. Slug is derived (lowercase, spaces→`-`, accents stripped). |
| 2 | `country` | string | e.g. `England`, `Spain`. |
| 3 | `league` | string | Top-flight name, e.g. `Premier League`, `La Liga`. |
| 4 | `lastLeagueTitle` | ISO date or `never` | Date the most recent top-flight title was clinched. |
| 5 | `lastLeagueSeason` | string or `never` | Season label, e.g. `2012-13`. |
| 6 | `lastUCL` | ISO date or `never` | Date of the most recent European Cup / Champions League final won. |
| 7 | `lastUCLSeason` | string or `never` | Season label, e.g. `2007-08`. |
| 8 | `color` | hex | Club primary colour for UI theming, e.g. `#DA291C`. |

### The `never` sentinel
`never` in a date/season field means the club has never won that competition. A
club with `never` in **both** league and UCL has *never won a real trophy* — render
the dedicated "Never" state, not a timer.

## Derived types (loader)

```ts
export interface Club {
  slug: string;            // "manchester-united"
  name: string;            // "Manchester United"
  country: string;         // "England"
  league: string;          // "Premier League"
  color: string;           // "#DA291C"
  lastLeagueTitle: TrophyWin | null;   // null = never
  lastUCL: TrophyWin | null;           // null = never
}

export interface TrophyWin {
  date: Date;              // clinch / final date
  season: string;          // "2012-13"
}

export type Competition = "league" | "ucl" | "any";

// The headline fact: most recent of {league, ucl}; null = never won a real trophy.
export function lastRealTrophy(club: Club):
  | { competition: "league" | "ucl"; win: TrophyWin }
  | null;
```

## Parsing rules

1. Read the file as UTF-8, split on newlines.
2. Drop blank lines and lines starting with `#`.
3. Split each remaining line on `|`, `.trim()` each field.
4. Map `never` → `null`; otherwise parse the date with `new Date(iso)`.
5. Derive `slug` from `name`.
6. Validate: 8 fields per row, valid dates, valid hex colour — throw on bad rows so
   data errors fail the build, not production.

## Source links (every fact is sourced)

Every displayed fact (hero, each grid card, each Hall of Never card) shows a small
ⓘ info tooltip with a **Wikipedia source link**. To keep the text file lean and the
links guaranteed-correct, source URLs are **derived in the loader**, not stored per
row:

- **League title** → the country's authoritative champions list, e.g.
  `List_of_English_football_champions`, `List_of_Spanish_football_champions`,
  `List_of_Italian_football_champions`, `List_of_German_football_champions`,
  `List_of_French_football_champions`.
- **Champions League / European Cup** →
  `List_of_European_Cup_and_UEFA_Champions_League_finals`.
- **Never** → links to the same list page (where you can confirm the club is absent).

These list pages enumerate every winner by year, so they verify the season shown on
the card. An optional per-row `sourceOverride` column (9th field) can point a fact at
a season-specific Wikipedia page when desired; the loader prefers it when present.

## Date accuracy

- **League** dates are the *clinching matchday* (accurate to the day where known).
- **Champions League** dates are the *final*.
- The years/months/days of a count-up are dominated by the year value, so a date
  that is a few days off does not change the headline — but please keep them honest
  and verify new entries against Wikipedia season pages or club sites.

## Editing / adding a club

1. Add one line in the right country section of `data/trophies.csv`.
2. Use ISO dates (`YYYY-MM-DD`) or `never`.
3. Run `yarn build` — the loader validates rows and will fail loudly on mistakes.

## Seed data (launch)

Five leagues: England (22), Spain (10), Italy (8), Germany (7), France (6).
Includes Premier League era + historic First Division winners and the equivalents
abroad. Highlights baked in for comedy: Newcastle (1927), Spurs (1961), Sevilla
(1946), Real Betis (1935), Fiorentina (1969), and the entire "Never" tier (West Ham,
Brighton, Brentford, Bournemouth, Crystal Palace, Fulham, Villarreal, Atalanta).
