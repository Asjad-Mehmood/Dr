import Link from "next/link";
import { stageStatus } from "@/lib/cms";
import type { Journey } from "@/payload-types";
import { StatusBadge } from "./ui";

export function JourneyTimeline({
  stages,
  currentYear,
  compact = false,
}: {
  stages: Journey[];
  currentYear: number;
  compact?: boolean;
}) {
  return (
    <ol className="relative border-l border-line">
      {stages.map((stage) => {
        const status = stageStatus(stage, currentYear);
        return (
          <li
            key={stage.id}
            className="reveal relative pb-10 pl-8 last:pb-0 sm:pl-12"
          >
            <span
              aria-hidden="true"
              className={`absolute top-2 -left-[6.5px] size-3 rounded-full ring-4 ring-background ${
                status === "current"
                  ? "bg-accent"
                  : status === "completed"
                    ? "bg-primary"
                    : "border border-muted bg-background"
              }`}
            />
            <Link href={`/journey/${stage.slug}`} className="group block">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="font-display text-3xl font-semibold text-primary tabular-nums">
                  {stage.periodLabel}
                </span>
                <span className="font-medium group-hover:text-primary">
                  {stage.title}
                </span>
                <StatusBadge status={status} />
              </div>
              {stage.headline && (
                <p className="mt-2 font-display text-lg italic">
                  {stage.headline}
                </p>
              )}
              {!compact && stage.summary && (
                <p className="mt-1 max-w-2xl text-sm text-muted text-pretty">
                  {stage.summary}
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
