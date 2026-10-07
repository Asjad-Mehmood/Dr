import Link from "next/link";
import { CampRecord } from "@/components/camp-record";
import { EntryList } from "@/components/entry-list";
import { JourneyTimeline } from "@/components/journey-timeline";
import { Container, PulseLine, SectionHeading } from "@/components/ui";
import { campTotals, getCamp } from "@/content/camps";
import { getJourneyYear } from "@/content/journey";
import { entries } from "@/content/portfolio";
import { profile } from "@/content/profile";

const pillars = [
  {
    title: "Medical Education",
    text: "Year-by-year MBBS studies, examinations and the academic events that shape a doctor.",
    href: "/portfolio#academics",
  },
  {
    title: "Community Healthcare",
    text: "Outreach, patient welfare and blood donation work, and the Annual Free Medical Camp.",
    href: "/camps",
  },
  {
    title: "Research",
    text: "Research projects, papers, posters and presentations, from the first question onwards.",
    href: "/portfolio#research",
  },
  {
    title: "Service",
    text: "Student societies, leadership roles and service to fellow students and patients.",
    href: "/portfolio#societies",
  },
];

export default function Home() {
  const current = getJourneyYear(profile.currentYear);
  const camp = getCamp(profile.currentYear);
  const totals = campTotals();
  const latest = [...entries].sort((a, b) => b.year - a.year).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <Container className="pt-16 pb-20 sm:pt-24 sm:pb-28">
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            {profile.disciplines.map((discipline, index) => (
              <span key={discipline} className="flex items-center gap-3">
                {index > 0 && (
                  <span className="text-accent" aria-hidden="true">
                    |
                  </span>
                )}
                {discipline}
              </span>
            ))}
          </p>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl font-display text-2xl text-balance text-muted italic sm:text-3xl">
            “{profile.concept} —{" "}
            {profile.values.map((value, index) => (
              <span key={value}>
                <span className="text-primary not-italic">{value}</span>
                {index < profile.values.length - 2
                  ? ", "
                  : index === profile.values.length - 2
                    ? " & "
                    : ""}
              </span>
            ))}
            .”
          </p>

          {current && (
            <p className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm">
              <span
                className="size-2 rounded-full bg-accent"
                aria-hidden="true"
              />
              Now: {current.stage}, {profile.college.short} —{" "}
              {profile.college.city}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/journey"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink transition-opacity hover:opacity-90"
            >
              Follow the journey
            </Link>
            <Link
              href="/camps"
              className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium transition-colors hover:border-primary"
            >
              Annual Free Medical Camp
            </Link>
          </div>
        </Container>
        <PulseLine className="pointer-events-none absolute inset-x-0 bottom-6 h-16 w-full text-primary/40" />
      </section>

      <section className="border-y border-line bg-surface py-20">
        <Container>
          <SectionHeading
            eyebrow="What this portfolio records"
            title="Four threads, followed through every year"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group rounded-2xl border border-line bg-background p-6 transition-colors hover:border-primary"
              >
                <h3 className="font-display text-xl font-semibold group-hover:text-primary">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-muted text-pretty">
                  {pillar.text}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="The journey"
              title="From the first lecture to the first patient"
            >
              Every year of MBBS gets its own chapter: what was studied, what
              was achieved, and the camp that was held. The chapters after
              graduation will follow.
            </SectionHeading>
            <Link
              href="/journey"
              className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
            >
              See the full journey →
            </Link>
          </div>
          <JourneyTimeline showFuture={false} />
        </Container>
      </section>

      <section className="border-y border-line bg-primary-soft/60 py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Every year, without fail"
              title="Annual Free Medical Camp"
            >
              One free medical camp every year of the journey, each one recorded
              here: where it was held, who it served and who made it happen.
            </SectionHeading>
            {totals.held > 0 && (
              <dl className="flex gap-8">
                <div>
                  <dt className="text-xs text-muted">Camps held</dt>
                  <dd className="font-display text-3xl font-semibold">
                    {totals.held}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Patients served</dt>
                  <dd className="font-display text-3xl font-semibold">
                    {totals.patientsServed.toLocaleString("en-US")}
                  </dd>
                </div>
              </dl>
            )}
          </div>
          {camp && (
            <div className="mt-10">
              <CampRecord camp={camp} />
            </div>
          )}
          <Link
            href="/camps"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            See every camp →
          </Link>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Latest"
            title="Recent additions to the portfolio"
          />
          <div className="mt-10">
            <EntryList entries={latest} show="category" />
          </div>
          <Link
            href="/portfolio"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Open the full portfolio →
          </Link>
        </Container>
      </section>
    </>
  );
}
