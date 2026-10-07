import Link from "next/link";
import type { ReactNode } from "react";

export type RecordRow = {
  key: string | number;
  title: string;
  href?: string;
  date?: string;
  meta?: ReactNode;
  summary?: string | null;
};

// A quiet, divider-separated list — used instead of rows of cards.
export function RecordList({ rows }: { rows: RecordRow[] }) {
  return (
    <ul className="border-t border-line">
      {rows.map((row) => (
        <li key={row.key} className="border-b border-line">
          <Row row={row} />
        </li>
      ))}
    </ul>
  );
}

function Row({ row }: { row: RecordRow }) {
  const body = (
    <div className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[10rem_1fr]">
      <p className="text-sm text-muted tabular-nums">{row.date}</p>
      <div>
        <p className="font-medium group-hover:text-primary">
          {row.title}
          {row.href && (
            <span
              aria-hidden="true"
              className="ml-2 inline-block text-primary opacity-0 transition-opacity group-hover:opacity-100"
            >
              →
            </span>
          )}
        </p>
        {row.meta && <p className="mt-1 text-sm text-accent">{row.meta}</p>}
        {row.summary && (
          <p className="mt-1 text-sm text-muted text-pretty">{row.summary}</p>
        )}
      </div>
    </div>
  );
  return row.href ? (
    <Link href={row.href} className="group block">
      {body}
    </Link>
  ) : (
    body
  );
}
