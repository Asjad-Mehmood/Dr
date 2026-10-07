import type { Metadata } from "next";
import { RecordList } from "@/components/record-list";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { getPageTexts, list } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.journal?.title ?? "Journal",
    description: texts.journal?.intro ?? undefined,
  };
}

export default async function JournalPage() {
  const [texts, posts] = await Promise.all([
    getPageTexts(),
    list("journal", { sort: "-date", depth: 0 }),
  ]);

  return (
    <>
      <PageHeader text={texts.journal} />
      <Container>
        <div className="max-w-4xl">
          {posts.length > 0 ? (
            <RecordList
              rows={posts.map((p) => ({
                key: p.id,
                title: p.title,
                href: `/journal/${p.slug}`,
                date: formatDate(p.date),
                summary: p.excerpt,
              }))}
            />
          ) : (
            <EmptyNote>
              Journal posts will appear here as they are written.
            </EmptyNote>
          )}
        </div>
      </Container>
    </>
  );
}
