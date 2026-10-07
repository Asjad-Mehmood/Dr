import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailBody, DetailHeader } from "@/components/detail";
import { FileLinks } from "@/components/media";
import { RichText } from "@/components/rich-text";
import { Facts, Section } from "@/components/ui";
import { researchTypes } from "@/cms/collections/Research";
import { asMedia, findBySlug } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await findBySlug("research", slug, 0);
  return item
    ? { title: item.title, description: item.summary ?? undefined }
    : {};
}

export default async function ResearchItemPage({
  params,
}: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const item = await findBySlug("research", slug);
  if (!item) notFound();
  const doiUrl = item.doi
    ? `https://doi.org/${item.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "")}`
    : null;

  return (
    <>
      <DetailHeader
        back={{ href: "/research", label: "Research" }}
        eyebrow={researchTypes.find((t) => t.value === item.type)?.label}
        title={item.title}
        meta={[item.authors, formatDate(item.date, "month")]}
      />
      <DetailBody>
        <Facts
          items={[
            { label: "Role", value: item.role },
            { label: "Institution", value: item.institution },
            { label: "Research area", value: item.area },
            {
              label: "Status",
              value:
                item.researchStatus &&
                item.researchStatus[0].toUpperCase() +
                  item.researchStatus.slice(1),
            },
            { label: "Conference / journal", value: item.venue },
          ]}
        />
        {item.summary && <p className="text-lg text-pretty">{item.summary}</p>}
        {item.abstract && (
          <Section title="Abstract">
            <RichText data={item.abstract} />
          </Section>
        )}
        <div className="flex flex-wrap items-center gap-6">
          <FileLinks
            files={[{ label: "Read the PDF", media: asMedia(item.pdf) }]}
          />
          {doiUrl && (
            <a
              href={doiUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              DOI: {item.doi}
            </a>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              View publication
            </a>
          )}
        </div>
      </DetailBody>
    </>
  );
}
