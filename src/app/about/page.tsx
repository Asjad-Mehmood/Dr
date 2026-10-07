import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/ui";
import { getJourneyYear, journey } from "@/content/journey";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: `About ${profile.name} and the idea behind this portfolio.`,
};

const values = [
  {
    title: "Learning",
    text: "Medicine is learned one year, one subject and one patient at a time. This site keeps the record of that learning, from the basic sciences to the wards.",
  },
  {
    title: "Serving",
    text: "Being a doctor means serving people. The Annual Free Medical Camp, outreach work and student societies are where that begins.",
  },
  {
    title: "Caring",
    text: "Behind every case is a person. Patient welfare, blood donation and community healthcare keep that at the centre of the journey.",
  },
];

export default function AboutPage() {
  const current = getJourneyYear(profile.currentYear);

  return (
    <>
      <PageHeader eyebrow="About" title={profile.name}>
        {current
          ? `${current.stage} at ${profile.college.name} (${profile.college.short}), ${profile.college.city}.`
          : `${profile.college.name} (${profile.college.short}), ${profile.college.city}.`}
      </PageHeader>

      <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5 text-lg text-pretty">
          <p>
            This website is a living portfolio. It began in {journey[0].year},
            at the start of MBBS, and is meant to grow through graduation, the
            house job, specialization and the rest of a medical career.
          </p>
          <p className="text-muted">
            Each year adds a new chapter: the subjects studied, the results
            earned, the research begun, the societies joined, and the Annual
            Free Medical Camp held that year. Kept together, these chapters
            become the record of how a medical student becomes a doctor.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/journey"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:opacity-90"
            >
              Read the journey
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium hover:border-primary"
            >
              Open the portfolio
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <h2 className="font-display text-xl font-semibold text-primary">
                {value.title}
              </h2>
              <p className="mt-2 text-sm text-muted text-pretty">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
