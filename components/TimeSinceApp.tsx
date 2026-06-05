"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Club,
  CompetitionFilter,
  competitionLabel,
  droughtRanks,
  hallOfNever,
  leagueChampionsSource,
  resolveFact,
} from "@/lib/trophies";
import { textOn, darken } from "@/lib/color";
import CountUp from "@/components/CountUp";
import FactCard from "@/components/FactCard";
import SourceInfo from "@/components/SourceInfo";

// Curated gallery of notable facts (rank badges still reflect the real drought rank).
const FEATURED: { slug: string; filter: CompetitionFilter; note?: string }[] = [
  { slug: "manchester-united", filter: "any" },
  {
    slug: "arsenal",
    filter: "ucl",
    note: "Never — and they lost the 2026 final to PSG on penalties.",
  },
  { slug: "tottenham-hotspur", filter: "league" },
  { slug: "liverpool", filter: "league" },
  { slug: "newcastle-united", filter: "league" },
  { slug: "juventus", filter: "any" },
  { slug: "sevilla", filter: "league" },
  { slug: "borussia-dortmund", filter: "league" },
  { slug: "ac-milan", filter: "any" },
];

const COMPS: { value: CompetitionFilter; label: string }[] = [
  { value: "any", label: "a real trophy" },
  { value: "league", label: "the league" },
  { value: "ucl", label: "the Champions League" },
];

export default function TimeSinceApp({ clubs }: { clubs: Club[] }) {
  const bySlug = useMemo(
    () => new Map(clubs.map((c) => [c.slug, c])),
    [clubs]
  );
  const ranks = useMemo(() => droughtRanks(clubs), [clubs]);
  const nevers = useMemo(() => hallOfNever(clubs), [clubs]);

  // Group clubs by country for the <select>.
  const byCountry = useMemo(() => {
    const m = new Map<string, Club[]>();
    for (const c of clubs.slice().sort((a, b) => a.name.localeCompare(b.name))) {
      const list = m.get(c.country) ?? [];
      list.push(c);
      m.set(c.country, list);
    }
    return Array.from(m.entries());
  }, [clubs]);

  const [now, setNow] = useState(0); // 0 until mounted (avoids hydration mismatch)
  const [slug, setSlug] = useState("manchester-united");
  const [filter, setFilter] = useState<CompetitionFilter>("any");
  const [copied, setCopied] = useState(false);

  // Mount: read URL params, start the one-and-only clock.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("club");
    const f = params.get("comp") as CompetitionFilter | null;
    if (c && bySlug.has(c)) setSlug(c);
    if (f && ["any", "league", "ucl"].includes(f)) setFilter(f);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [bySlug]);

  // Keep the URL shareable.
  useEffect(() => {
    if (!now) return;
    const qs = `?club=${slug}&comp=${filter}`;
    window.history.replaceState(null, "", qs);
  }, [slug, filter, now]);

  const club = bySlug.get(slug) ?? clubs[0];
  const fact = resolveFact(club, filter);
  const fg = textOn(club.color);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <div className="min-h-screen">
      {/* ---------- Hero + Explorer ---------- */}
      <section
        className="px-4 pb-14 pt-6 transition-colors duration-500"
        style={{
          background: `linear-gradient(160deg, ${club.color}, ${darken(
            club.color
          )})`,
          color: fg,
        }}
      >
        <header className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-black tracking-tight">Time Since</span>
          <a href="#grid" className="text-sm opacity-80 hover:opacity-100">
            More facts ↓
          </a>
        </header>

        <div className="mx-auto max-w-5xl pt-10 text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.25em] opacity-70">
            Pick a club &amp; a competition
          </p>
          <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              aria-label="Club"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 rounded-xl border border-white/25 bg-white/15 px-4 py-3 font-semibold outline-none backdrop-blur [&>optgroup]:text-black [&>option]:text-black"
            >
              {byCountry.map(([country, list]) => (
                <optgroup key={country} label={country}>
                  {list.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              aria-label="Competition"
              value={filter}
              onChange={(e) => setFilter(e.target.value as CompetitionFilter)}
              className="flex-1 rounded-xl border border-white/25 bg-white/15 px-4 py-3 font-semibold outline-none backdrop-blur [&>option]:text-black"
            >
              {COMPS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <h1 className="mx-auto mt-12 max-w-3xl text-2xl font-semibold opacity-95 sm:text-3xl">
            Time since {club.name} won {competitionLabel(filter)}
          </h1>

          <div className="mt-8 min-h-[7rem]">
            {!now ? (
              <span className="opacity-60">…</span>
            ) : fact ? (
              <CountUp iso={fact.date} now={now} variant="hero" />
            ) : (
              <div>
                <div className="text-7xl font-black leading-none sm:text-9xl">
                  ∞
                </div>
                <div className="mt-3 text-sm uppercase tracking-[0.3em] opacity-70">
                  Never
                </div>
              </div>
            )}
          </div>

          <p className="mt-5 text-sm opacity-80">
            {fact ? (
              <>
                Last won: {fact.season}{" "}
                <SourceInfo label={fact.sourceLabel} url={fact.sourceUrl} />
              </>
            ) : slug === "arsenal" && filter === "ucl" ? (
              "Never. (And they lost the 2026 final to PSG on penalties.)"
            ) : (
              "Still waiting for the very first one."
            )}
          </p>

          <div className="mt-9 flex justify-center gap-3">
            <button
              onClick={copyLink}
              className="rounded-full bg-white/20 px-5 py-2 text-sm font-medium hover:bg-white/30"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
          <p className="mt-6 text-xs italic opacity-70">
            Only the league title &amp; the Champions League count. The FA Cup
            doesn&apos;t.
          </p>
        </div>
      </section>

      {/* ---------- Featured grid ---------- */}
      <section id="grid" className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight text-gray-700">
            The drought board
          </h2>
          <span className="text-sm text-gray-400">
            #rank = longest wait for a real trophy
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map(({ slug: s, filter: f, note }) => {
            const c = bySlug.get(s);
            if (!c) return null;
            const cf = resolveFact(c, f);
            return (
              <FactCard
                key={`${s}-${f}`}
                club={c}
                filter={f}
                fact={cf}
                rank={cf ? ranks.get(c.slug) ?? null : null}
                now={now}
                note={note}
              />
            );
          })}
        </div>
      </section>

      {/* ---------- Hall of Never ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-black tracking-tight text-gray-700">
          ∞ The Hall of Never
        </h2>
        <p className="mb-6 mt-1 text-sm text-gray-400">
          Clubs still chasing their first ever real trophy.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {nevers.map((c) => (
            <div
              key={c.slug}
              className="flex items-center gap-3 rounded-xl p-3 shadow"
              style={{ backgroundColor: c.color, color: textOn(c.color) }}
            >
              <span className="text-2xl font-black">∞</span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{c.name}</div>
                <div className="text-xs opacity-80">
                  Never{" "}
                  <SourceInfo {...leagueChampionsSource(c.country)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-gray-500">
          <p>
            An open-source project created and maintained freely by{" "}
            <Link
              className="link link-accent"
              target="_blank"
              href="https://kimeshan.com"
            >
              Kimeshan Naidoo
            </Link>{" "}
            and{" "}
            <Link
              className="link link-accent"
              target="_blank"
              href="https://naidoonotes.com"
            >
              Naidoo Notes
            </Link>
            . The FA Cup still doesn&apos;t count.
          </p>
          <div className="mt-4">
            <Link
              className="btn btn-outline btn-primary btn-sm"
              target="_blank"
              href="https://buy.stripe.com/aEU16EgQ80ivaUE288"
            >
              Contribute 💵
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
