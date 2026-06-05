"use client";

import { elapsedSince } from "@/lib/trophies";

function plural(n: number, word: string) {
  return n === 1 ? word : `${word}s`;
}

// Live count-up readout. `now` is passed in so the whole app ticks off one clock.
export default function CountUp({
  iso,
  now,
  variant = "card",
}: {
  iso: string;
  now: number;
  variant?: "hero" | "card";
}) {
  const e = elapsedSince(iso, now);
  const cells = [
    { n: e.years, l: plural(e.years, "year") },
    { n: e.months, l: plural(e.months, "month") },
    { n: e.days, l: plural(e.days, "day") },
    { n: String(e.hours).padStart(2, "0"), l: "hrs" },
    { n: String(e.minutes).padStart(2, "0"), l: "min" },
    { n: String(e.seconds).padStart(2, "0"), l: "sec" },
  ];

  if (variant === "hero") {
    const sizes = [
      "text-5xl sm:text-8xl",
      "text-3xl sm:text-6xl",
      "text-3xl sm:text-6xl",
      "text-xl sm:text-4xl",
      "text-xl sm:text-4xl",
      "text-xl sm:text-4xl",
    ];
    const opacity = [1, 0.92, 0.84, 0.7, 0.62, 0.54];
    return (
      <div className="flex flex-wrap items-end justify-center gap-x-4 sm:gap-x-7 gap-y-3">
        {cells.map((c, i) => (
          <div key={i} className="flex flex-col items-center">
            <span
              className={`font-black leading-none tabular-nums ${sizes[i]}`}
              style={{ opacity: opacity[i] }}
            >
              {c.n}
            </span>
            <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider opacity-70">
              {c.l}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-y-3 rounded-xl bg-black/15 py-4">
      {cells.map((c, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-black leading-none tabular-nums">
            {c.n}
          </span>
          <span className="text-[10px] uppercase tracking-wide opacity-70">
            {c.l}
          </span>
        </div>
      ))}
    </div>
  );
}
