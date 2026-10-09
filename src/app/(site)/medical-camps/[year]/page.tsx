import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CampDetail, campLabel } from "@/components/camp-parts";
import {
  BackLink,
  Container,
  Divider,
  Eyebrow,
  HeaderShell,
} from "@/components/ui";
import { campTitle, getPageTexts, list, publishedCamps } from "@/lib/cms";

async function getCamp(year: string) {
  if (!/^\d{4}$/.test(year)) return undefined;
  const [camp] = await list("medical-camps", {
    where: { year: { equals: Number(year) } },
    limit: 1,
    depth: 1,
  });
  return camp;
}

export async function generateMetadata({
  params,
}: PageProps<"/medical-camps/[year]">): Promise<Metadata> {
  const { year } = await params;
  const [camp, texts] = await Promise.all([getCamp(year), getPageTexts()]);
  if (!camp) return {};
  return {
    title: campTitle(camp, texts),
    description: camp.summary ?? undefined,
  };
}

export default async function CampPage({
  params,
}: PageProps<"/medical-camps/[year]">) {
  const { year } = await params;
  const [camp, texts, camps] = await Promise.all([
    getCamp(year),
    getPageTexts(),
    publishedCamps(),
  ]);
  if (!camp) notFound();
  const index = camps.findIndex((c) => c.id === camp.id);
  const previous = camps[index - 1];
  const next = camps[index + 1];

  return (
    <>
      <HeaderShell>
        <BackLink href="/medical-camps">All camps</BackLink>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Eyebrow>{campLabel(camp)}</Eyebrow>
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-muted">
            {camp.campStatus === "held" ? "Held" : "Planned"}
          </span>
        </div>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {campTitle(camp, texts)}
        </h1>
        <Divider />
      </HeaderShell>
      <Container>
        <CampDetail camp={camp} texts={texts} />
        {camp.campStatus !== "held" && (
          <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
            Details, verified numbers and photographs will be added after the
            camp.
          </p>
        )}
      </Container>
      <Container className="mt-20">
        <nav
          aria-label="Camps"
          className="flex justify-between gap-4 border-t border-line pt-6 text-sm"
        >
          {previous ? (
            <Link
              href={`/medical-camps/${previous.year}`}
              className="hover:text-primary"
            >
              ← {previous.year} · {campLabel(previous)}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/medical-camps/${next.year}`}
              className="text-right hover:text-primary"
            >
              {next.year} · {campLabel(next)} →
            </Link>
          )}
        </nav>
      </Container>
    </>
  );
}
