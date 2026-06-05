"use client";

import {
  Club,
  CompetitionFilter,
  TrophyWin,
  competitionLabel,
  leagueChampionsSource,
  uclFinalsSource,
} from "@/lib/trophies";
import { textOn } from "@/lib/color";
import CountUp from "@/components/CountUp";
import SourceInfo from "@/components/SourceInfo";

// A single club-coloured fact card for the grid.
export default function FactCard({
  club,
  filter,
  fact,
  rank,
  now,
  note,
}: {
  club: Club;
  filter: CompetitionFilter;
  fact: TrophyWin | null;
  rank: number | null;
  now: number;
  note?: string;
}) {
  const fg = textOn(club.color);

  return (
    <article
      className="relative flex flex-col rounded-2xl p-5 shadow-lg"
      style={{ backgroundColor: club.color, color: fg }}
    >
      {rank !== null && (
        <span
          className="absolute right-4 top-4 rounded-full bg-black/20 px-2.5 py-1 text-xs font-bold"
          title="Drought rank — longest wait for a real trophy"
        >
          #{rank}
        </span>
      )}

      <p className="text-sm opacity-80">Time since</p>
      <h3 className="text-lg sm:text-xl font-extrabold leading-tight pr-10">
        {club.name} won {competitionLabel(filter)}
      </h3>

      {fact ? (
        <>
          <div className="mt-4">
            <CountUp iso={fact.date} now={now} variant="card" />
          </div>
          <p className="mt-3 text-xs opacity-90">
            Last won: {fact.season}{" "}
            <SourceInfo label={fact.sourceLabel} url={fact.sourceUrl} />
          </p>
        </>
      ) : (
        <>
          <div className="my-4 flex flex-col items-center rounded-xl bg-black/15 py-5">
            <span className="text-5xl sm:text-6xl font-black leading-none">∞</span>
            <span className="mt-1 text-xs uppercase tracking-widest opacity-80">
              Never
            </span>
          </div>
          <p className="text-xs opacity-90">
            {note ?? "Still chasing the first one."}{" "}
            <SourceInfo {...neverSource(club, filter)} />
          </p>
        </>
      )}
    </article>
  );
}

// Source for a "never" fact: the relevant Wikipedia list page (where you can
// confirm the club is absent from the winners).
function neverSource(club: Club, filter: CompetitionFilter) {
  const src =
    filter === "ucl" ? uclFinalsSource : leagueChampionsSource(club.country);
  return { label: src.label, url: src.url };
}
