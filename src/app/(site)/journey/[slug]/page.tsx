import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CMSImage, PhotoGrid } from "@/components/media";
import { RecordList } from "@/components/record-list";
import { RichText } from "@/components/rich-text";
import {
  BackLink,
  Container,
  EmptyNote,
  Eyebrow,
  HeaderShell,
  Section,
  StatusBadge,
  Tag,
} from "@/components/ui";
import {
  asMedia,
  campTitle,
  canShowMedia,
  findBySlug,
  getPageTexts,
  getSettings,
  list,
  mediaList,
  stageStatus,
} from "@/lib/cms";
import { formatDate, ordinal } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/journey/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const stage = await findBySlug("journey", slug, 0);
  if (!stage) return {};
  return {
    title: `${stage.periodLabel} — ${stage.title}`,
    description: stage.summary ?? undefined,
  };
}

export default async function JourneyStagePage({
  params,
}: PageProps<"/journey/[slug]">) {
  const { slug } = await params;
  const stage = await findBySlug("journey", slug, 1);
  if (!stage) notFound();

  const [settings, texts, stages] = await Promise.all([
    getSettings(),
    getPageTexts(),
    list("journey", { sort: "order", depth: 0 }),
  ]);
  const status = stageStatus(stage, settings.currentYear);
  const byYear = stage.year ? { year: { equals: stage.year } } : undefined;

  const [
    academic,
    events,
    certificates,
    achievements,
    research,
    community,
    camps,
    albums,
  ] = byYear
    ? await Promise.all([
        list("academic-records", { where: byYear, sort: "date", depth: 0 }),
        list("events", { where: byYear, sort: "date", depth: 0 }),
        list("certificates", { where: byYear, sort: "date", depth: 0 }),
        list("achievements", { where: byYear, sort: "date", depth: 0 }),
        list("research", { where: byYear, sort: "date", depth: 0 }),
        list("community", { where: byYear, sort: "date", depth: 0 }),
        list("medical-camps", { where: byYear, depth: 1 }),
        list("gallery", { where: byYear, sort: "date", depth: 1 }),
      ])
    : [[], [], [], [], [], [], [], []];

  const cover = asMedia(stage.cover);
  const photos = [
    ...albums.flatMap((a) => mediaList(a.photos)),
    ...camps.filter(canShowMedia).flatMap((c) => mediaList(c.photos)),
  ].slice(0, 12);
  const index = stages.findIndex((s) => s.id === stage.id);
  const previous = stages[index - 1];
  const next = stages[index + 1];
  const nothing =
    !academic.length &&
    !events.length &&
    !certificates.length &&
    !achievements.length &&
    !research.length &&
    !community.length &&
    !camps.length &&
    !stage.milestones?.length;

  return (
    <>
      <HeaderShell>
        <BackLink href="/journey">The journey</BackLink>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Eyebrow>{stage.title}</Eyebrow>
          <StatusBadge status={status} />
        </div>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          {stage.periodLabel}
          {stage.headline && (
            <>
              <span className="text-muted"> · </span>
              <span className="italic">{stage.headline}</span>
            </>
          )}
        </h1>
        {stage.summary && (
          <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">
            {stage.summary}
          </p>
        )}
      </HeaderShell>

      {cover && (
        <Container className="mb-14">
          <CMSImage
            media={cover}
            size="large"
            sizes="100vw"
            className="max-h-[32rem] w-full rounded-3xl object-cover"
          />
        </Container>
      )}

      <Container className="grid gap-14 lg:grid-cols-[1fr_2.2fr]">
        <aside className="space-y-8">
          {stage.subjects && stage.subjects.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest text-muted uppercase">
                Subjects
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {stage.subjects.map((s) => (
                  <li key={s.id}>
                    <Tag>{s.name}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm text-muted">
            {settings.institution}
            {settings.city ? `, ${settings.city}` : ""}
          </p>
        </aside>

        <div className="space-y-16">
          <RichText data={stage.content} />

          {stage.milestones && stage.milestones.length > 0 && (
            <Section title="Milestones">
              <RecordList
                rows={stage.milestones.map((m, i) => ({
                  key: m.id ?? i,
                  title: m.title,
                  date: m.when ?? "",
                  summary: m.description,
                }))}
              />
            </Section>
          )}
          {academic.length > 0 && (
            <Section title="Academic record">
              <RecordList
                rows={academic.map((r) => ({
                  key: r.id,
                  title: r.title,
                  date: formatDate(r.date),
                  meta: r.showResult && r.result ? r.result : r.subject,
                  summary: r.description,
                }))}
              />
            </Section>
          )}
          {events.length > 0 && (
            <Section title="Events">
              <RecordList
                rows={events.map((e) => ({
                  key: e.id,
                  title: e.title,
                  href: `/events/${e.slug}`,
                  date: formatDate(e.date),
                  meta: e.role,
                  summary: e.summary,
                }))}
              />
            </Section>
          )}
          {achievements.length > 0 && (
            <Section title="Achievements">
              <RecordList
                rows={achievements.map((a) => ({
                  key: a.id,
                  title: a.title,
                  href: `/achievements/${a.slug}`,
                  date: formatDate(a.date),
                  summary: a.summary,
                }))}
              />
            </Section>
          )}
          {certificates.length > 0 && (
            <Section title="Certificates">
              <RecordList
                rows={certificates.map((c) => ({
                  key: c.id,
                  title: c.title,
                  href: `/certificates/${c.slug}`,
                  date: formatDate(c.date),
                  meta: c.issuer,
                }))}
              />
            </Section>
          )}
          {research.length > 0 && (
            <Section title="Research">
              <RecordList
                rows={research.map((r) => ({
                  key: r.id,
                  title: r.title,
                  href: `/research/${r.slug}`,
                  date: formatDate(r.date),
                  meta: r.role,
                  summary: r.summary,
                }))}
              />
            </Section>
          )}
          {(community.length > 0 || camps.length > 0) && (
            <Section title="Community service">
              <RecordList
                rows={[
                  ...camps.map((c) => ({
                    key: `camp-${c.id}`,
                    title: campTitle(c, texts),
                    href: `/medical-camps/${c.year}`,
                    date: formatDate(c.date) || String(c.year),
                    meta: `${ordinal(c.edition)} annual camp · ${c.campStatus === "held" ? "Held" : "Planned"}`,
                  })),
                  ...community.map((c) => ({
                    key: c.id,
                    title: c.title,
                    href: `/community/${c.slug}`,
                    date: formatDate(c.date),
                    meta: c.role,
                    summary: c.summary,
                  })),
                ]}
              />
            </Section>
          )}
          {photos.length > 0 && (
            <Section title="Photographs">
              <PhotoGrid photos={photos} />
            </Section>
          )}
          {nothing && (
            <EmptyNote>
              {status === "upcoming"
                ? `This chapter is still ahead.`
                : `Records for ${stage.periodLabel} will appear here as they are added.`}
            </EmptyNote>
          )}
        </div>
      </Container>

      <Container className="mt-20">
        <nav
          aria-label="Journey"
          className="flex justify-between gap-4 border-t border-line pt-6 text-sm"
        >
          {previous ? (
            <Link
              href={`/journey/${previous.slug}`}
              className="hover:text-primary"
            >
              ← {previous.periodLabel} · {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/journey/${next.slug}`}
              className="text-right hover:text-primary"
            >
              {next.periodLabel} · {next.title} →
            </Link>
          )}
        </nav>
      </Container>
    </>
  );
}
