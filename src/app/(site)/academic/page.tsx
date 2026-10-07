import type { Metadata } from "next";
import Link from "next/link";
import { RecordList } from "@/components/record-list";
import {
  Container,
  EmptyNote,
  PageHeader,
  SectionHeading,
  StatusBadge,
  Tag,
} from "@/components/ui";
import {
  asCategory,
  getPageTexts,
  getSettings,
  list,
  stageStatus,
} from "@/lib/cms";
import { formatDate, groupBy } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.academic?.title ?? "Academic",
    description: texts.academic?.intro ?? undefined,
  };
}

const typeLabels: Record<string, string> = {
  exam: "Exam",
  result: "Result",
  milestone: "Milestone",
  course: "Course",
  presentation: "Presentation",
  skill: "Skill",
  other: "",
};

export default async function AcademicPage() {
  const [settings, texts, stages, records, academicCategories, certificates] =
    await Promise.all([
      getSettings(),
      getPageTexts(),
      list("journey", { sort: "order", depth: 0 }),
      list("academic-records", { sort: "-date", depth: 0 }),
      list("categories", {
        where: {
          and: [
            { section: { equals: "events" } },
            { academic: { equals: true } },
          ],
        },
        depth: 0,
      }),
      list("certificates", { sort: "-date", limit: 6, depth: 0 }),
    ]);
  const development = academicCategories.length
    ? await list("events", {
        where: { category: { in: academicCategories.map((c) => c.id) } },
        sort: "-date",
      })
    : [];

  return (
    <>
      <PageHeader text={texts.academic} />
      <Container className="space-y-24">
        <section className="reveal">
          <SectionHeading eyebrow="Education path" title="MBBS and beyond" />
          <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => (
              <li key={stage.id} className="bg-surface">
                <Link
                  href={`/journey/${stage.slug}`}
                  className="group flex h-full flex-col gap-3 p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xl font-semibold text-primary">
                      {stage.periodLabel}
                    </span>
                    <StatusBadge
                      status={stageStatus(stage, settings.currentYear)}
                    />
                  </div>
                  <span className="font-medium group-hover:text-primary">
                    {stage.title}
                  </span>
                  {stage.subjects && stage.subjects.length > 0 && (
                    <span className="flex flex-wrap gap-1.5">
                      {stage.subjects.map((s) => (
                        <span
                          key={s.id}
                          className="text-xs text-muted after:ml-1.5 after:content-['·'] last:after:content-none"
                        >
                          {s.name}
                        </span>
                      ))}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="reveal">
          <SectionHeading
            eyebrow="Records"
            title="Exams, results & milestones"
          />
          <div className="mt-8 space-y-12">
            {records.length > 0 ? (
              groupBy(records, (r) => r.year ?? 0).map(([year, items]) => (
                <div key={year}>
                  <h3 className="font-display text-3xl font-semibold text-primary">
                    {year || "Undated"}
                  </h3>
                  <div className="mt-4">
                    <RecordList
                      rows={items.map((r) => ({
                        key: r.id,
                        title: r.title,
                        date: formatDate(r.date),
                        meta: [
                          typeLabels[r.type],
                          r.subject,
                          r.showResult ? r.result : null,
                        ]
                          .filter(Boolean)
                          .join(" · "),
                        summary: r.description,
                      }))}
                    />
                  </div>
                </div>
              ))
            ) : (
              <EmptyNote>
                Academic records will appear here as they are added.
              </EmptyNote>
            )}
          </div>
        </section>

        {development.length > 0 && (
          <section className="reveal">
            <SectionHeading
              eyebrow="Academic development"
              title="Workshops, seminars & conferences"
              action={{ href: "/events", label: "All events" }}
            />
            <div className="mt-8">
              <RecordList
                rows={development.map((e) => ({
                  key: e.id,
                  title: e.title,
                  href: `/events/${e.slug}`,
                  date: formatDate(e.date),
                  meta: [asCategory(e.category)?.title, e.role]
                    .filter(Boolean)
                    .join(" · "),
                }))}
              />
            </div>
          </section>
        )}

        {certificates.length > 0 && (
          <section className="reveal">
            <SectionHeading
              eyebrow="Certifications"
              title="Recent certificates"
              action={{ href: "/certificates", label: "All certificates" }}
            />
            <ul className="mt-8 flex flex-wrap gap-2">
              {certificates.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/certificates/${c.slug}`}
                    className="hover:text-primary"
                  >
                    <Tag>{c.title}</Tag>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
