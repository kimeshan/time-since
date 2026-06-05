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

const REPO = "https://github.com/kimeshan/time-since";

const BADGES: { src: string; alt: string; href: string }[] = [
  {
    src: "https://img.shields.io/github/stars/kimeshan/time-since?style=for-the-badge&logo=github&label=Star&color=EF0107&labelColor=0b1220",
    alt: "GitHub stars",
    href: REPO,
  },
  {
    src: "https://img.shields.io/badge/PRs-welcome-22c55e?style=for-the-badge&labelColor=0b1220",
    alt: "PRs welcome",
    href: `${REPO}/pulls`,
  },
  {
    src: "https://img.shields.io/badge/Open%20Source-%E2%9D%A4-EF0107?style=for-the-badge&labelColor=0b1220",
    alt: "Open source",
    href: REPO,
  },
  {
    src: "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white",
    alt: "Built with Next.js",
    href: "https://nextjs.org",
  },
  {
    src: "https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white",
    alt: "Styled with Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

function GitHubMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function Badge({ src, alt, href }: { src: string; alt: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block transition-transform hover:-translate-y-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-7" />
    </a>
  );
}

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
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#grid"
              className="hidden text-sm opacity-80 hover:opacity-100 sm:inline"
            >
              More facts ↓
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              aria-label="Star Time Since on GitHub"
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold hover:bg-white/30"
            >
              <GitHubMark />
              <span>Star on GitHub</span>
            </a>
          </div>
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
      <footer className="mt-6 bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-black tracking-tight text-white">
            Free &amp; open source ❤️
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Spotted a wrong date or a missing club? The whole dataset is one text
            file — PRs welcome.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {BADGES.map((b) => (
              <Badge key={b.alt} {...b} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
            >
              <GitHubMark />
              View on GitHub
            </a>
            <Link
              href="https://buy.stripe.com/aEU16EgQ80ivaUE288"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contribute 💵
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Created and maintained freely by{" "}
            <Link
              className="font-medium text-gray-300 underline-offset-2 hover:text-white hover:underline"
              target="_blank"
              href="https://kimeshan.com"
            >
              Kimeshan Naidoo
            </Link>
            . The FA Cup still doesn&apos;t count.
          </p>
        </div>
      </footer>
    </div>
  );
}
