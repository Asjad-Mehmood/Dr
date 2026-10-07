import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailBody, DetailHeader } from "@/components/detail";
import { CMSImage, FileLinks } from "@/components/media";
import { ArrowLink, Facts } from "@/components/ui";
import { asCategory, asMedia, fileUrl, findBySlug } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/certificates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await findBySlug("certificates", slug, 0);
  return item
    ? { title: item.title, description: item.description ?? undefined }
    : {};
}

export default async function CertificatePage({
  params,
}: PageProps<"/certificates/[slug]">) {
  const { slug } = await params;
  const item = await findBySlug("certificates", slug);
  if (!item) notFound();
  const preview = asMedia(item.preview);
  const event = typeof item.event === "object" ? item.event : null;

  return (
    <>
      <DetailHeader
        back={{ href: "/certificates", label: "Certificates" }}
        eyebrow={asCategory(item.category)?.title ?? "Certificate"}
        title={item.title}
        meta={[item.issuer, formatDate(item.date)]}
      />
      <DetailBody>
        {preview && (
          <a
            href={fileUrl(preview.url) || "#"}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <CMSImage
              media={preview}
              size="large"
              sizes="(min-width: 768px) 768px, 100vw"
              className="w-full rounded-2xl border border-line bg-surface object-contain"
            />
          </a>
        )}
        <Facts
          items={[
            { label: "Issued by", value: item.issuer },
            { label: "Date", value: formatDate(item.date) },
            { label: "Event / course", value: item.course },
          ]}
        />
        {item.description && (
          <p className="text-lg text-pretty">{item.description}</p>
        )}
        <FileLinks
          files={[
            { label: "View certificate (PDF)", media: asMedia(item.file) },
          ]}
        />
        {event?.slug && (
          <ArrowLink href={`/events/${event.slug}`}>{event.title}</ArrowLink>
        )}
      </DetailBody>
    </>
  );
}
