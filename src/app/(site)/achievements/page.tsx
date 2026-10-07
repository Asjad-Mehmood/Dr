import type { Metadata } from "next";
import { RecordList } from "@/components/record-list";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { asCategory, getPageTexts, list } from "@/lib/cms";
import { formatDate, groupBy } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.achievements?.title ?? "Achievements",
    description: texts.achievements?.intro ?? undefined,
  };
}

export default async function AchievementsPage() {
  const [texts, achievements] = await Promise.all([
    getPageTexts(),
    list("achievements", { sort: "-date" }),
  ]);

  return (
    <>
      <PageHeader text={texts.achievements} />
      <Container className="space-y-20">
        {achievements.length > 0 ? (
          groupBy(achievements, (a) => a.year ?? 0).map(([year, items]) => (
            <section key={year} className="reveal">
              <h2 className="font-display text-4xl font-semibold text-primary">
                {year || "Undated"}
              </h2>
              <div className="mt-5">
                <RecordList
                  rows={items.map((a) => ({
                    key: a.id,
                    title: a.title,
                    href: `/achievements/${a.slug}`,
                    date: formatDate(a.date),
                    meta: [asCategory(a.category)?.title, a.awardedBy]
                      .filter(Boolean)
                      .join(" · "),
                    summary: a.summary,
                  }))}
                />
              </div>
            </section>
          ))
        ) : (
          <EmptyNote>
            Achievements will appear here as they are added.
          </EmptyNote>
        )}
      </Container>
    </>
  );
}
