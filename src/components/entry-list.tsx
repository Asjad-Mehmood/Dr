import Link from "next/link";
import { categoryTitle, type Entry } from "@/content/portfolio";

export function EntryList({
  entries,
  show,
}: {
  entries: Entry[];
  // Which label to show beside each entry: its category or its year.
  show: "category" | "year";
}) {
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {entries.map((entry, index) => (
        <li key={index} className="p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-medium">
              {entry.link ? (
                <a
                  href={entry.link}
                  className="hover:text-primary hover:underline"
                >
                  {entry.title}
                </a>
              ) : (
                entry.title
              )}
            </h3>
            <span className="text-xs tracking-wide text-muted">
              {show === "year" ? (
                <Link
                  href={`/journey/${entry.year}`}
                  className="hover:text-primary"
                >
                  {entry.date ?? entry.year}
                </Link>
              ) : (
                <Link
                  href={`/portfolio#${entry.category}`}
                  className="hover:text-primary"
                >
                  {categoryTitle(entry.category)}
                </Link>
              )}
            </span>
          </div>
          {entry.role && (
            <p className="mt-1 text-sm font-medium text-accent">{entry.role}</p>
          )}
          {entry.description && (
            <p className="mt-1 text-sm text-muted text-pretty">
              {entry.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
