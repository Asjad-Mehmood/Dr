import type { Metadata } from "next";
import { RecordList } from "@/components/record-list";
import { Container, EmptyNote, PageHeader, Tag } from "@/components/ui";
import { researchTypes } from "@/cms/collections/Research";
import { getAbout, getPageTexts, list } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.research?.title ?? "Research",
    description: texts.research?.intro ?? undefined,
  };
}

export default async function ResearchPage() {
  const [texts, about, items] = await Promise.all([
    getPageTexts(),
    getAbout(),
    list("research", { sort: "-date", depth: 0 }),
  ]);
  const groups = researchTypes
    .map((type) => ({
      ...type,
      items: items.filter((i) => i.type === type.value),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader text={texts.research} />
      <Container className="space-y-20">
        {about.researchInterests && about.researchInterests.length > 0 && (
          <section className="reveal">
            <h2 className="text-xs font-semibold tracking-widest text-muted uppercase">
              Research interests
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {about.researchInterests.map((i) => (
                <li key={i.id}>
                  <Tag>{i.title}</Tag>
                </li>
              ))}
            </ul>
          </section>
        )}
        {groups.length > 0 ? (
          groups.map((group) => (
            <section key={group.value} className="reveal">
              <h2 className="font-display text-2xl font-semibold">
                {group.label}s
              </h2>
              <div className="mt-5">
                <RecordList
                  rows={group.items.map((r) => ({
                    key: r.id,
                    title: r.title,
                    href: `/research/${r.slug}`,
                    date: formatDate(r.date, "month"),
                    meta: [
                      r.role,
                      r.venue,
                      r.researchStatus &&
                        r.researchStatus[0].toUpperCase() +
                          r.researchStatus.slice(1),
                    ]
                      .filter(Boolean)
                      .join(" · "),
                    summary: r.summary,
                  }))}
                />
              </div>
            </section>
          ))
        ) : (
          <EmptyNote>
            Research projects, case reports, posters, presentations and
            publications will appear here as they are added.
          </EmptyNote>
        )}
      </Container>
    </>
  );
}
