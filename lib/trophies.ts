// Pure types + parsing + helpers for the trophy dataset.
// No filesystem access here so this module is safe to import on the client too;
// the file read happens in app/page.tsx (server) and passes plain data down.

export type Competition = "league" | "ucl";
export type CompetitionFilter = Competition | "any";

export interface TrophyWin {
  competition: Competition;
  date: string; // ISO YYYY-MM-DD (clinch / final date)
  season: string; // e.g. "2012-13"
  sourceUrl: string;
  sourceLabel: string;
}

export interface Club {
  slug: string;
  name: string;
  country: string;
  leagueName: string; // e.g. "Premier League"
  color: string;
  leagueTitle: TrophyWin | null; // null = never won the top flight
  uclTitle: TrophyWin | null; // null = never won the European Cup / UCL
}

// --- Source links (Wikipedia). Derived so every fact is sourced. ---

const CHAMPIONS_LIST: Record<string, { url: string; label: string }> = {
  England: {
    url: "https://en.wikipedia.org/wiki/List_of_English_football_champions",
    label: "English champions · Wikipedia",
  },
  Spain: {
    url: "https://en.wikipedia.org/wiki/List_of_Spanish_football_champions",
    label: "Spanish champions · Wikipedia",
  },
  Italy: {
    url: "https://en.wikipedia.org/wiki/List_of_Italian_football_champions",
    label: "Italian champions · Wikipedia",
  },
  Germany: {
    url: "https://en.wikipedia.org/wiki/List_of_German_football_champions",
    label: "German champions · Wikipedia",
  },
  France: {
    url: "https://en.wikipedia.org/wiki/List_of_French_football_champions",
    label: "French champions · Wikipedia",
  },
};

const UCL_LIST = {
  url: "https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals",
  label: "European Cup / Champions League finals · Wikipedia",
};

const GENERIC_LEAGUE_SOURCE = {
  url: "https://en.wikipedia.org/wiki/List_of_association_football_competitions",
  label: "Football champions · Wikipedia",
};

/** Canonical Wikipedia source for a country's league champions. */
export function leagueChampionsSource(country: string): {
  url: string;
  label: string;
} {
  return CHAMPIONS_LIST[country] ?? GENERIC_LEAGUE_SOURCE;
}

/** Canonical Wikipedia source for the European Cup / Champions League. */
export const uclFinalsSource = UCL_LIST;

function leagueSource(country: string) {
  return leagueChampionsSource(country);
}

// --- Slug ---

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// --- Parsing ---

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function field(value: string | undefined, line: string): string {
  if (value === undefined) {
    throw new Error(`trophies.csv: missing field in line: ${line}`);
  }
  return value.trim();
}

function parseWin(
  dateRaw: string,
  seasonRaw: string,
  competition: Competition,
  source: { url: string; label: string },
  line: string
): TrophyWin | null {
  const date = dateRaw.trim();
  const season = seasonRaw.trim();
  if (date === "never" || season === "never") return null;
  if (!ISO_RE.test(date)) {
    throw new Error(`trophies.csv: bad date "${date}" in line: ${line}`);
  }
  return {
    competition,
    date,
    season,
    sourceUrl: source.url,
    sourceLabel: source.label,
  };
}

export function parseTrophies(csv: string): Club[] {
  const clubs: Club[] = [];
  for (const raw of csv.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const cols = line.split("|");
    const name = field(cols[0], line);
    const country = field(cols[1], line);
    const leagueName = field(cols[2], line);
    const lastLeagueDate = field(cols[3], line);
    const lastLeagueSeason = field(cols[4], line);
    const lastUclDate = field(cols[5], line);
    const lastUclSeason = field(cols[6], line);
    const color = field(cols[7], line);

    if (!HEX_RE.test(color)) {
      throw new Error(`trophies.csv: bad colour "${color}" in line: ${line}`);
    }

    clubs.push({
      slug: slugify(name),
      name,
      country,
      leagueName,
      color,
      leagueTitle: parseWin(
        lastLeagueDate,
        lastLeagueSeason,
        "league",
        leagueSource(country),
        line
      ),
      uclTitle: parseWin(lastUclDate, lastUclSeason, "ucl", UCL_LIST, line),
    });
  }
  return clubs;
}

// --- Helpers (pure, client-safe) ---

/** The more recent of {league title, UCL}; null = never won a real trophy. */
export function lastRealTrophy(club: Club): TrophyWin | null {
  const wins = [club.leagueTitle, club.uclTitle].filter(
    (w): w is TrophyWin => w !== null
  );
  if (wins.length === 0) return null;
  return wins.sort((a, b) => b.date.localeCompare(a.date))[0];
}

/** Resolve the fact for a given competition filter. */
export function resolveFact(
  club: Club,
  filter: CompetitionFilter
): TrophyWin | null {
  if (filter === "league") return club.leagueTitle;
  if (filter === "ucl") return club.uclTitle;
  return lastRealTrophy(club);
}

export function hasRealTrophy(club: Club): boolean {
  return lastRealTrophy(club) !== null;
}

/** Clubs that have never won a real trophy. */
export function hallOfNever(clubs: Club[]): Club[] {
  return clubs
    .filter((c) => !hasRealTrophy(c))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Global "drought rank" by longest time since a real trophy (oldest first = #1).
 * Returns a map of slug -> rank for clubs that have won a real trophy.
 */
export function droughtRanks(clubs: Club[]): Map<string, number> {
  const ranked = clubs
    .filter(hasRealTrophy)
    .sort((a, b) => {
      const da = lastRealTrophy(a)!.date;
      const db = lastRealTrophy(b)!.date;
      return da.localeCompare(db) || a.name.localeCompare(b.name);
    });
  const map = new Map<string, number>();
  ranked.forEach((c, i) => map.set(c.slug, i + 1));
  return map;
}

// --- Count-up maths (matches the original useCountUpTimer approximation) ---

export interface Elapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DAY = 1000 * 60 * 60 * 24;

export function elapsedSince(iso: string, now: number): Elapsed {
  const diff = Math.max(0, now - new Date(iso).getTime());
  return {
    years: Math.floor(diff / (DAY * 365)),
    months: Math.floor((diff % (DAY * 365)) / (DAY * 30)),
    days: Math.floor((diff % (DAY * 30)) / DAY),
    hours: Math.floor((diff % DAY) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function competitionLabel(c: CompetitionFilter): string {
  if (c === "league") return "the league";
  if (c === "ucl") return "the Champions League";
  return "a real trophy";
}
