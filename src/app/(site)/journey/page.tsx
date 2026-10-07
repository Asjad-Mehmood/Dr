import type { Metadata } from "next";
import { JourneyTimeline } from "@/components/journey-timeline";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { getPageTexts, getSettings, list } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.journey?.title ?? "Journey",
    description: texts.journey?.intro ?? undefined,
  };
}

export default async function JourneyPage() {
  const [settings, texts, stages] = await Promise.all([
    getSettings(),
    getPageTexts(),
    list("journey", { sort: "order", depth: 0 }),
  ]);

  return (
    <>
      <PageHeader text={texts.journey} />
      <Container>
        <div className="max-w-3xl">
          {stages.length > 0 ? (
            <JourneyTimeline
              stages={stages}
              currentYear={settings.currentYear}
            />
          ) : (
            <EmptyNote>No journey stages have been published yet.</EmptyNote>
          )}
        </div>
      </Container>
    </>
  );
}
