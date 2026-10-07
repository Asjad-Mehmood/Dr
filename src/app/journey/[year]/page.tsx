import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CampRecord } from "@/components/camp-record";
import { EntryList } from "@/components/entry-list";
import { Container, EmptyNote, Eyebrow, StatusBadge } from "@/components/ui";
import { getCamp } from "@/content/camps";
import { getJourneyYear, journey, statusOf } from "@/content/journey";
import { entriesFor } from "@/content/portfolio";
import { profile } from "@/content/profile";

export function generateStaticParams() {
  return journey.map((item) => ({ year: String(item.year) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journey/[year]">): Promise<Metadata> {
  const { year } = await params;
  const item = getJourneyYear(Number(year));
  if (!item) return {};
  return {
    title: `${item.year} — ${item.stage}`,
    description: `${profile.name} in ${item.year}: ${item.stage}. ${item.summary}`,
  };
}

export default async function JourneyYearPage({
  params,
}: PageProps<"/journey/[year]">) {
  const { year } = await params;
  const item = getJourneyYear(Number(year));
  if (!item) notFound();

  const status = statusOf(item.year);
  const yearEntries = entriesFor({ year: item.year });
  const camp = getCamp(item.year);
  const index = journey.indexOf(item);
  const previous = journey[index - 1];
  const next = journey[index + 1];

  return (
    <>
      <Container className="pt-14 pb-10 sm:pt-20">
        <Link href="/journey" className="text-sm text-muted hover:text-primary">
          ← The journey
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Eyebrow>{item.stage}</Eyebrow>
          <StatusBadge status={status} />
        </div>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          {item.year}
          <span className="text-muted"> · </span>
          <span className="italic">{item.theme}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted text-pretty">
          {item.summary}
        </p>
      </Container>

      <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <aside>
          <h2 className="text-xs font-semibold tracking-widest text-muted uppercase">
            Core subjects
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.subjects.map((subject) => (
              <li
                key={subject}
                className="rounded-full border border-line bg-surface px-3 py-1 text-sm"
              >
                {subject}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            {profile.college.name} ({profile.college.short}),{" "}
            {profile.college.city}
          </p>
        </aside>

        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold">
              Achievements & activities
            </h2>
            <div className="mt-5">
              {yearEntries.length > 0 ? (
                <EntryList entries={yearEntries} show="category" />
              ) : (
                <EmptyNote>
                  {status === "upcoming"
                    ? `This chapter begins in ${item.year}.`
                    : `Nothing has been added for ${item.year} yet.`}
                </EmptyNote>
              )}
            </div>
          </section>

          {camp && (
            <section>
              <h2 className="font-display text-2xl font-semibold">
                This year&apos;s camp
              </h2>
              <div className="mt-5">
                <CampRecord camp={camp} />
              </div>
            </section>
          )}
        </div>
      </Container>

      <Container className="mt-16">
        <nav
          aria-label="Year"
          className="flex justify-between gap-4 border-t border-line pt-6 text-sm"
        >
          {previous ? (
            <Link
              href={`/journey/${previous.year}`}
              className="hover:text-primary"
            >
              ← {previous.year} · {previous.stage}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/journey/${next.year}`}
              className="text-right hover:text-primary"
            >
              {next.year} · {next.stage} →
            </Link>
          )}
        </nav>
      </Container>
    </>
  );
}
