import type { Metadata } from "next";
import { RecordList } from "@/components/record-list";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { asCategory, getPageTexts, list } from "@/lib/cms";
import { formatRange, groupBy } from "@/lib/format";
import type { Event } from "@/payload-types";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.events?.title ?? "Events",
    description: texts.events?.intro ?? undefined,
  };
}

const row = (e: Event) => ({
  key: e.id,
  title: e.title,
  href: `/events/${e.slug}`,
  date: formatRange(e.date, e.endDate),
  meta: [asCategory(e.category)?.title, e.role, e.location]
    .filter(Boolean)
    .join(" · "),
  summary: e.summary,
});

export default async function EventsPage() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const [texts, upcoming, past] = await Promise.all([
    getPageTexts(),
    list("events", {
      where: { date: { greater_than_equal: today.toISOString() } },
      sort: "date",
    }),
    list("events", {
      where: { date: { less_than: today.toISOString() } },
      sort: "-date",
    }),
  ]);

  return (
    <>
      <PageHeader text={texts.events} />
      <Container className="space-y-20">
        {upcoming.length > 0 && (
          <section className="reveal">
            <h2 className="font-display text-2xl font-semibold">Upcoming</h2>
            <div className="mt-5">
              <RecordList rows={upcoming.map(row)} />
            </div>
          </section>
        )}
        {past.length > 0
          ? groupBy(past, (e) => e.year ?? 0).map(([year, events]) => (
              <section key={year} className="reveal">
                <h2 className="font-display text-4xl font-semibold text-primary">
                  {year || "Undated"}
                </h2>
                <div className="mt-5">
                  <RecordList rows={events.map(row)} />
                </div>
              </section>
            ))
          : upcoming.length === 0 && (
              <EmptyNote>Events will appear here as they are added.</EmptyNote>
            )}
      </Container>
    </>
  );
}
