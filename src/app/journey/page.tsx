import type { Metadata } from "next";
import { JourneyTimeline } from "@/components/journey-timeline";
import { Container, PageHeader } from "@/components/ui";
import { journey } from "@/content/journey";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "The Journey",
  description: `${profile.name}'s journey from medical student to doctor, year by year.`,
};

export default function JourneyPage() {
  const first = journey[0].year;
  const last = journey[journey.length - 1].year;

  return (
    <>
      <PageHeader eyebrow="The journey" title="From medical student to doctor">
        {first} to {last} at {profile.college.name}, and the chapters after it.
        Each year keeps its own record of studies, achievements and the Annual
        Free Medical Camp.
      </PageHeader>
      <Container>
        <div className="max-w-3xl">
          <JourneyTimeline />
        </div>
      </Container>
    </>
  );
}
