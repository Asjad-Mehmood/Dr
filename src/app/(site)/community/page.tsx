import type { Metadata } from "next";
import Link from "next/link";
import { RecordList } from "@/components/record-list";
import {
  Container,
  EmptyNote,
  PageHeader,
  SectionHeading,
} from "@/components/ui";
import { communityTypes } from "@/cms/collections/CommunityService";
import { campTitle, getPageTexts, list, publishedCamps } from "@/lib/cms";
import { formatDate, formatNumber, ordinal } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.community?.title ?? "Community",
    description: texts.community?.intro ?? undefined,
  };
}

export default async function CommunityPage() {
  const [texts, camps, activities] = await Promise.all([
    getPageTexts(),
    publishedCamps(),
    list("community", { sort: "-date", depth: 0 }),
  ]);
  const groups = communityTypes
    .map((type) => ({
      ...type,
      items: activities.filter((a) => a.type === type.value),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader text={texts.community} />
      <Container className="space-y-24">
        {camps.length > 0 && (
          <section className="reveal">
            <SectionHeading
              eyebrow="Flagship project"
              title={texts.camps?.seriesTitle || "Annual Free Medical Camp"}
              action={{ href: "/medical-camps", label: "All camps" }}
            />
            <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
              {camps.map((camp) => (
                <li key={camp.id} className="bg-surface">
                  <Link
                    href={`/medical-camps/${camp.year}`}
                    className="group block p-5"
                  >
                    <p className="font-display text-2xl font-semibold text-primary">
                      {camp.year}
                    </p>
                    <p className="mt-1 text-sm group-hover:text-primary">
                      {ordinal(camp.edition)} Camp
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {camp.campStatus === "held"
                        ? camp.numbersVerified && camp.patientsServed
                          ? `${formatNumber(camp.patientsServed)} served`
                          : "Held"
                        : "Planned"}
                    </p>
                    <span className="sr-only">{campTitle(camp, texts)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {groups.length > 0 ? (
          groups.map((group) => (
            <section key={group.value} className="reveal">
              <h2 className="font-display text-2xl font-semibold">
                {group.label}
              </h2>
              <div className="mt-5">
                <RecordList
                  rows={group.items.map((a) => ({
                    key: a.id,
                    title: a.title,
                    href: `/community/${a.slug}`,
                    date: formatDate(a.date),
                    meta: [a.role, a.location].filter(Boolean).join(" · "),
                    summary: a.summary,
                  }))}
                />
              </div>
            </section>
          ))
        ) : (
          <EmptyNote>
            Blood donation, health awareness, outreach, patient welfare and
            volunteer activities will appear here as they are added.
          </EmptyNote>
        )}
      </Container>
    </>
  );
}
