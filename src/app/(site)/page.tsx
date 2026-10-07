import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { JourneyTimeline } from "@/components/journey-timeline";
import { CMSImage } from "@/components/media";
import { RecordList } from "@/components/record-list";
import {
  ArrowLink,
  Container,
  Eyebrow,
  Facts,
  PulseLine,
  SectionHeading,
} from "@/components/ui";
import {
  asMedia,
  campTitle,
  displayName,
  getHome,
  getPageTexts,
  getSettings,
  impactNumbers,
  list,
} from "@/lib/cms";
import { formatDate, formatNumber, ordinal } from "@/lib/format";

export default async function HomePage() {
  const [settings, home, texts] = await Promise.all([
    getSettings(),
    getHome(),
    getPageTexts(),
  ]);
  const today = new Date().toISOString();

  const [
    stages,
    camps,
    upcoming,
    latestEvents,
    latestAchievements,
    latestCertificates,
    impact,
  ] = await Promise.all([
    home.showTimeline ? list("journey", { sort: "order", depth: 0 }) : [],
    home.showCamp ? list("medical-camps", { sort: "year", depth: 0 }) : [],
    home.showUpcoming
      ? list("events", {
          where: { date: { greater_than_equal: today } },
          sort: "date",
          limit: 3,
          depth: 0,
        })
      : [],
    home.showLatest
      ? list("events", {
          where: { date: { less_than: today } },
          sort: "-date",
          limit: 5,
          depth: 0,
        })
      : [],
    home.showLatest
      ? list("achievements", { sort: "-date", limit: 5, depth: 0 })
      : [],
    home.showLatest
      ? list("certificates", { sort: "-date", limit: 5, depth: 0 })
      : [],
    home.showImpact ? impactNumbers() : [],
  ]);

  const portrait = asMedia(home.portrait);
  const camp =
    camps.find((c) => c.year === settings.currentYear) ??
    camps.find((c) => c.campStatus === "planned") ??
    camps.at(-1);
  const impactShown = impact.filter((item) => item.value > 0);
  const latest = [
    ...latestEvents.map((e) => ({
      key: `e${e.id}`,
      title: e.title,
      date: e.date,
      href: `/events/${e.slug}`,
      meta: "Event",
    })),
    ...latestAchievements.map((a) => ({
      key: `a${a.id}`,
      title: a.title,
      date: a.date,
      href: `/achievements/${a.slug}`,
      meta: "Achievement",
    })),
    ...latestCertificates.map((c) => ({
      key: `c${c.id}`,
      title: c.title,
      date: c.date,
      href: `/certificates/${c.slug}`,
      meta: "Certificate",
    })),
  ]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, 5)
    .map((row) => ({ ...row, date: formatDate(row.date) }));

  return (
    <>
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-12 pt-16 pb-24 sm:pt-24 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {settings.tagline && <Eyebrow>{settings.tagline}</Eyebrow>}
            <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
              {displayName(settings)}
            </h1>
            <p className="mt-4 text-lg">
              <span className="font-medium">{settings.role}</span>
              {settings.institution && (
                <span className="text-muted">
                  {" "}
                  · {settings.institution}
                  {settings.city ? `, ${settings.city}` : ""}
                </span>
              )}
            </p>
            {home.statement && (
              <p className="mt-8 max-w-xl font-display text-2xl text-balance text-muted italic sm:text-3xl">
                {home.statement}
              </p>
            )}
            {home.buttons && home.buttons.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {home.buttons.map((button, index) => (
                  <Link
                    key={button.id ?? index}
                    href={button.href}
                    className={
                      index === 0
                        ? "rounded-full bg-ink px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
                        : "rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium transition-colors hover:border-primary"
                    }
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {portrait && (
            <CMSImage
              media={portrait}
              size="large"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover"
            />
          )}
        </Container>
        <PulseLine className="pointer-events-none absolute inset-x-0 bottom-4 h-14 w-full text-primary/35" />
      </section>

      {home.highlights && home.highlights.length > 0 && (
        <section className="border-y border-line bg-surface">
          <Container>
            <ul className="grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
              {home.highlights.map((item, index) => {
                const inner = (
                  <>
                    <p className="font-display text-xl font-semibold group-hover:text-primary">
                      {item.title}
                    </p>
                    {item.text && (
                      <p className="mt-2 text-sm text-muted">{item.text}</p>
                    )}
                  </>
                );
                return (
                  <li
                    key={item.id ?? index}
                    className="border-b border-line py-8 sm:px-6 sm:first:pl-0 lg:border-b-0"
                  >
                    {item.href ? (
                      <Link href={item.href} className="group block">
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      {home.showTimeline && stages.length > 0 && (
        <section className="py-24">
          <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow={texts.journey?.eyebrow}
                title={home.timelineTitle || "The journey"}
                action={{ href: "/journey", label: "The full journey" }}
              >
                {texts.journey?.intro}
              </SectionHeading>
            </div>
            <JourneyTimeline
              stages={stages}
              currentYear={settings.currentYear}
              compact
            />
          </Container>
        </section>
      )}

      {home.showImpact && impactShown.length > 0 && (
        <section className="border-y border-line bg-surface py-20">
          <Container>
            <SectionHeading
              eyebrow="Impact"
              title={home.impactTitle || "Impact"}
            />
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {impactShown.map((item) => (
                <div key={item.label} className="reveal">
                  <dd className="font-display text-5xl font-semibold text-primary tabular-nums">
                    <CountUp value={item.value} />
                  </dd>
                  <dt className="mt-2 text-sm text-muted">{item.label}</dt>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {home.showCamp && camp && (
        <section className="py-24">
          <Container>
            <SectionHeading
              eyebrow={`${ordinal(camp.edition)} ${texts.camps?.eyebrow ?? "Annual Free Medical Camp"}`}
              title={home.campTitle || campTitle(camp, texts)}
              action={{ href: "/medical-camps", label: "All camps" }}
            >
              {camp.summary || texts.camps?.intro}
            </SectionHeading>
            <div className="reveal mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="font-display text-2xl font-semibold">
                  {campTitle(camp, texts)}
                </p>
                <span className="text-sm text-muted">
                  {camp.campStatus === "held" ? "Held" : "Planned"}
                </span>
              </div>
              <Facts
                className="mt-8"
                items={[
                  {
                    label: "Date",
                    value: formatDate(camp.date) || "To be announced",
                  },
                  { label: "Location", value: camp.location },
                  { label: "Organised by", value: camp.organizedBy },
                  {
                    label: "Patients served",
                    value:
                      camp.numbersVerified && camp.patientsServed
                        ? formatNumber(camp.patientsServed)
                        : undefined,
                  },
                ]}
              />
              <div className="mt-8">
                <ArrowLink href={`/medical-camps/${camp.year}`}>
                  Camp {camp.year} details
                </ArrowLink>
              </div>
            </div>
          </Container>
        </section>
      )}

      {home.showUpcoming && upcoming.length > 0 && (
        <section className="pb-24">
          <Container>
            <SectionHeading
              eyebrow="Events"
              title={home.upcomingTitle || "Coming up"}
              action={{ href: "/events", label: "All events" }}
            />
            <div className="mt-8">
              <RecordList
                rows={upcoming.map((e) => ({
                  key: e.id,
                  title: e.title,
                  href: `/events/${e.slug}`,
                  date: formatDate(e.date),
                  meta: e.location,
                }))}
              />
            </div>
          </Container>
        </section>
      )}

      {home.showLatest && latest.length > 0 && (
        <section className="pb-8">
          <Container>
            <SectionHeading
              eyebrow="Latest"
              title={home.latestTitle || "Recently added"}
            />
            <div className="mt-8">
              <RecordList rows={latest} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
