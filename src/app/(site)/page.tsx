import { MapPin, Stethoscope } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { IconBadge, iconFor } from "@/components/icons";
import { JourneyTimeline } from "@/components/journey-timeline";
import { CMSImage } from "@/components/media";
import { RecordList } from "@/components/record-list";
import {
  ArrowLink,
  ButtonLink,
  Container,
  Divider,
  Facts,
  SectionHeading,
} from "@/components/ui";
import { HeaderBackdrop, SoftCross } from "@/components/vectors";
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
      <section className="relative isolate overflow-hidden border-b border-line/70">
        <HeaderBackdrop large />
        <Container
          stagger
          className="flex flex-col items-center pt-14 pb-36 text-center sm:pt-20 sm:pb-44"
        >
          {portrait ? (
            <CMSImage
              media={portrait}
              size="card"
              priority
              sizes="160px"
              className="size-32 rounded-full object-cover ring-4 ring-surface shadow-soft sm:size-36"
            />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary shadow-soft ring-8 ring-primary-soft/50">
              <Stethoscope
                aria-hidden="true"
                className="size-8"
                strokeWidth={1.6}
              />
            </span>
          )}
          {settings.tagline && (
            <p className="mt-8 text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              {settings.tagline}
            </p>
          )}
          <h1
            data-split
            className="mt-4 font-display text-5xl font-semibold tracking-tight text-balance sm:text-7xl lg:text-[5.5rem] lg:leading-[1.05]"
          >
            {displayName(settings)}
          </h1>
          <p className="mt-5 text-lg font-medium text-primary sm:text-2xl">
            {settings.role}
            {settings.roleSubtitle && (
              <>
                <span aria-hidden="true" className="mx-3 text-primary/40">
                  |
                </span>
                {settings.roleSubtitle}
              </>
            )}
          </p>
          <Divider center />
          {home.statement && (
            <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">
              {home.statement}
            </p>
          )}
          {settings.institution && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin aria-hidden="true" className="size-4 text-primary" />
              {settings.institution}
              {settings.city ? `, ${settings.city}` : ""}
            </p>
          )}
          {home.buttons && home.buttons.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {home.buttons.map((button, index) => (
                <ButtonLink
                  key={button.id ?? index}
                  href={button.href}
                  variant={index === 0 ? "primary" : "soft"}
                >
                  {button.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </Container>
      </section>

      {home.highlights && home.highlights.length > 0 && (
        <section className="relative z-10 -mt-24 sm:-mt-28">
          <Container>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {home.highlights.map((item, index) => {
                const Icon = iconFor(item.icon, index);
                const inner = (
                  <>
                    <IconBadge icon={Icon} />
                    <p className="mt-5 font-display text-xl font-semibold group-hover:text-primary">
                      {item.title}
                    </p>
                    {item.text && (
                      <p className="mt-2 text-sm text-muted">{item.text}</p>
                    )}
                  </>
                );
                const card =
                  "group block h-full rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-200";
                return (
                  <li key={item.id ?? index} className="reveal">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`${card} hover:-translate-y-1 hover:border-primary/40`}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className={card}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      {home.showTimeline && stages.length > 0 && (
        <section className="py-24 sm:py-28">
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
            <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {impactShown.map((item) => (
                <div
                  key={item.label}
                  className="reveal flex flex-col rounded-2xl border border-line bg-background p-5 sm:p-6"
                >
                  <dt className="order-2 mt-1 text-sm text-muted">
                    {item.label}
                  </dt>
                  <dd className="order-1 font-display text-4xl font-semibold text-primary tabular-nums sm:text-5xl">
                    <CountUp value={item.value} />
                  </dd>
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
            <div className="reveal relative mt-10 overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-10">
              <SoftCross className="pointer-events-none absolute -right-6 -bottom-6 size-40 opacity-50" />
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="flex items-center gap-3 font-display text-2xl font-semibold">
                  <IconBadge icon={Stethoscope} />
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
