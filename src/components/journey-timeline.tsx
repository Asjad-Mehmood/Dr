import Link from "next/link";
import { futureChapters, journey, statusOf } from "@/content/journey";
import { StatusBadge } from "./ui";

export function JourneyTimeline({
  showFuture = true,
}: {
  showFuture?: boolean;
}) {
  return (
    <ol className="relative border-l-2 border-line pl-8 sm:pl-10">
      {journey.map((item) => {
        const status = statusOf(item.year);
        return (
          <li key={item.year} className="relative pb-10 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 -left-[calc(2rem+7px)] size-3 rounded-full ring-4 ring-background sm:-left-[calc(2.5rem+7px)] ${
                status === "upcoming"
                  ? "border-2 border-line bg-background"
                  : status === "current"
                    ? "bg-accent"
                    : "bg-primary"
              }`}
            />
            <Link
              href={`/journey/${item.year}`}
              className="group block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-primary sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-2xl font-semibold text-primary">
                  {item.year}
                </span>
                <span className="text-muted" aria-hidden="true">
                  →
                </span>
                <span className="font-medium">{item.stage}</span>
                <StatusBadge status={status} />
              </div>
              <p className="mt-3 font-display text-lg italic">{item.theme}</p>
              <p className="mt-1 text-sm text-muted text-pretty">
                {item.summary}
              </p>
              <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
                Open {item.year} →
              </p>
            </Link>
          </li>
        );
      })}

      {showFuture &&
        futureChapters.map((chapter) => (
          <li key={chapter.title} className="relative pb-10 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[calc(2rem+7px)] size-3 rounded-full border-2 border-dashed border-muted bg-background ring-4 ring-background sm:-left-[calc(2.5rem+7px)]"
            />
            <div className="rounded-2xl border border-dashed border-line p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-xl font-semibold">
                  {chapter.title}
                </span>
                <span className="text-xs tracking-widest text-muted uppercase">
                  {chapter.when}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted text-pretty">
                {chapter.summary}
              </p>
            </div>
          </li>
        ))}
    </ol>
  );
}
