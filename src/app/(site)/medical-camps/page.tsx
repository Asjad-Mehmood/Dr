import type { Metadata } from "next";
import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { campLabel } from "@/components/camp-parts";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { campTitle, getPageTexts, publishedCamps } from "@/lib/cms";
import { formatDate, formatNumber } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.camps?.title ?? "Medical camps",
    description: texts.camps?.intro ?? undefined,
  };
}

export default async function CampsPage() {
  const [texts, camps] = await Promise.all([getPageTexts(), publishedCamps()]);
  const held = camps.filter((c) => c.campStatus === "held");
  const verified = held.filter((c) => c.numbersVerified);
  const sum = (key: "patientsServed" | "doctors" | "volunteers") =>
    verified.reduce((total, c) => total + (c[key] ?? 0), 0);
  const totals = [
    {
      label: held.length === 1 ? "Year of service" : "Years of service",
      value: held.length,
    },
    { label: "People served", value: sum("patientsServed") },
    { label: "Doctors", value: sum("doctors") },
    { label: "Volunteers", value: sum("volunteers") },
  ].filter((t) => t.value > 0);

  return (
    <>
      <PageHeader text={texts.camps} />
      <Container>
        {totals.length > 0 && (
          <dl className="mb-16 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-10 sm:grid-cols-4">
            {totals.map((t) => (
              <div key={t.label}>
                <dd className="font-display text-5xl font-semibold text-primary tabular-nums">
                  <CountUp value={t.value} />
                </dd>
                <dt className="mt-2 text-sm text-muted">{t.label}</dt>
              </div>
            ))}
          </dl>
        )}

        {camps.length === 0 ? (
          <EmptyNote>No camps have been published yet.</EmptyNote>
        ) : (
          <ol className="border-t border-line">
            {camps.map((camp) => (
              <li key={camp.id} className="reveal border-b border-line">
                <Link
                  href={`/medical-camps/${camp.year}`}
                  className="group grid gap-x-8 gap-y-2 py-8 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline"
                >
                  <span className="font-display text-4xl font-semibold text-primary tabular-nums">
                    {camp.year}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-widest text-muted uppercase">
                      {campLabel(camp)}
                    </span>
                    <span className="mt-1 block font-display text-2xl font-semibold group-hover:text-primary">
                      {campTitle(camp, texts)}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {[
                        formatDate(camp.date),
                        camp.location,
                        camp.numbersVerified && camp.patientsServed
                          ? `${formatNumber(camp.patientsServed)} patients served`
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span
                    className={`justify-self-start rounded-full border border-line px-3 py-1 text-xs font-medium ${
                      camp.campStatus === "held"
                        ? "bg-primary-soft text-primary"
                        : "text-muted"
                    }`}
                  >
                    {camp.campStatus === "held" ? "Held" : "Planned"}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}
