import type { Metadata } from "next";
import { FileLinks } from "@/components/media";
import { Container, PageHeader, Section } from "@/components/ui";
import {
  asMedia,
  campTitle,
  displayName,
  getAbout,
  getPageTexts,
  getSettings,
  list,
} from "@/lib/cms";
import { formatDate, formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "CV" };

function Rows({
  rows,
}: {
  rows: {
    key: string | number;
    when: string;
    title: string;
    detail?: string | null;
  }[];
}) {
  return (
    <ul className="border-t border-line">
      {rows.map((r) => (
        <li
          key={r.key}
          className="grid gap-x-6 border-b border-line py-3 sm:grid-cols-[9rem_1fr]"
        >
          <span className="text-sm text-muted tabular-nums">{r.when}</span>
          <span>
            <span className="font-medium">{r.title}</span>
            {r.detail && (
              <span className="block text-sm text-muted">{r.detail}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

// A CV compiled from the records in the admin, plus an uploaded CV to download.
export default async function CVPage() {
  const [
    settings,
    about,
    texts,
    documents,
    research,
    achievements,
    certificates,
    camps,
    community,
  ] = await Promise.all([
    getSettings(),
    getAbout(),
    getPageTexts(),
    list("documents", { sort: "-date", depth: 1 }),
    list("research", { sort: "-date", depth: 0 }),
    list("achievements", { sort: "-date", depth: 0 }),
    list("certificates", { sort: "-date", depth: 0 }),
    list("medical-camps", {
      where: { campStatus: { equals: "held" } },
      sort: "-year",
      depth: 0,
    }),
    list("community", { sort: "-date", depth: 0 }),
  ]);
  const cv = documents.find((d) => d.type === "cv");
  const otherDocuments = documents.filter((d) => d !== cv);

  return (
    <>
      <PageHeader text={texts.cv}>
        {cv && (
          <div className="mt-8">
            <FileLinks
              files={[{ label: "Download CV (PDF)", media: asMedia(cv.file) }]}
            />
          </div>
        )}
      </PageHeader>
      <Container>
        <div className="max-w-3xl space-y-14">
          <div>
            <p className="font-display text-3xl font-semibold">
              {displayName(settings)}
            </p>
            <p className="mt-1 text-muted">
              {[settings.role, settings.institution, settings.city]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {settings.email && (
              <p className="mt-1 text-sm">
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-primary"
                >
                  {settings.email}
                </a>
              </p>
            )}
          </div>
          {about.education && about.education.length > 0 && (
            <Section title="Education">
              <Rows
                rows={about.education.map((e, i) => ({
                  key: e.id ?? i,
                  when: e.period ?? "",
                  title: e.title,
                  detail: e.institution,
                }))}
              />
            </Section>
          )}
          {research.length > 0 && (
            <Section title="Research & publications">
              <Rows
                rows={research.map((r) => ({
                  key: r.id,
                  when: formatDate(r.date, "month"),
                  title: r.title,
                  detail: [r.role, r.venue].filter(Boolean).join(" · "),
                }))}
              />
            </Section>
          )}
          {achievements.length > 0 && (
            <Section title="Achievements">
              <Rows
                rows={achievements.map((a) => ({
                  key: a.id,
                  when: formatDate(a.date, "month"),
                  title: a.title,
                  detail: a.awardedBy,
                }))}
              />
            </Section>
          )}
          {(camps.length > 0 || community.length > 0) && (
            <Section title="Community service">
              <Rows
                rows={[
                  ...camps.map((c) => ({
                    key: `camp-${c.id}`,
                    when: String(c.year),
                    title: campTitle(c, texts),
                    detail:
                      c.numbersVerified && c.patientsServed
                        ? `${formatNumber(c.patientsServed)} patients served`
                        : c.location,
                  })),
                  ...community.map((c) => ({
                    key: c.id,
                    when: formatDate(c.date, "month"),
                    title: c.title,
                    detail: c.role,
                  })),
                ]}
              />
            </Section>
          )}
          {certificates.length > 0 && (
            <Section title="Certificates">
              <Rows
                rows={certificates.map((c) => ({
                  key: c.id,
                  when: formatDate(c.date, "month"),
                  title: c.title,
                  detail: c.issuer,
                }))}
              />
            </Section>
          )}
          {otherDocuments.length > 0 && (
            <Section title="Documents">
              <FileLinks
                files={otherDocuments.map((d) => ({
                  label: d.title,
                  media: asMedia(d.file),
                }))}
              />
            </Section>
          )}
        </div>
      </Container>
    </>
  );
}
