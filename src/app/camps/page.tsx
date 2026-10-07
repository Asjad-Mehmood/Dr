import type { Metadata } from "next";
import { CampRecord } from "@/components/camp-record";
import { Container, PageHeader } from "@/components/ui";
import { campTotals, camps } from "@/content/camps";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Annual Free Medical Camp",
  description: `The Annual Free Medical Camp organised by ${profile.name}: one camp every year, recorded year by year.`,
};

export default function CampsPage() {
  const totals = campTotals();
  const summary = [
    { label: "Camps held", value: totals.held },
    { label: "Patients served", value: totals.patientsServed },
    { label: "Volunteers", value: totals.volunteers },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Community healthcare"
        title="Annual Free Medical Camp"
      >
        One free medical camp in every year of the journey. Each camp is
        recorded here: the date and place, the patients served, the services
        offered, the team behind it and photographs from the day.
      </PageHeader>

      <Container>
        {totals.held > 0 && (
          <dl className="mb-8 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface">
            {summary.map((item) => (
              <div key={item.label} className="p-5 sm:p-6">
                <dt className="text-xs text-muted sm:text-sm">{item.label}</dt>
                <dd className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
                  {item.value.toLocaleString("en-US")}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <nav aria-label="Camp years">
          <ul className="flex flex-wrap gap-2">
            {camps.map((camp) => (
              <li key={camp.year}>
                <a
                  href={`#${camp.year}`}
                  className="block rounded-full border border-line px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
                >
                  {camp.year}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 space-y-6">
          {camps.map((camp) => (
            <CampRecord key={camp.year} camp={camp} linkToYear />
          ))}
        </div>
      </Container>
    </>
  );
}
