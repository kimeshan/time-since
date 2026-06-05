import Link from "next/link";

// A small "ⓘ" info chip linking to the Wikipedia source for a fact.
// Used on the hero, every fact card, and the Hall of Never — every stat is sourced.
export default function SourceInfo({
  label,
  url,
  className = "",
}: {
  label: string;
  url: string;
  className?: string;
}) {
  return (
    <span className={`tooltip tooltip-bottom ${className}`} data-tip={label}>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Source: ${label}`}
        className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-current/40 text-[10px] font-bold leading-none align-text-top opacity-70 hover:opacity-100"
      >
        i
      </Link>
    </span>
  );
}
