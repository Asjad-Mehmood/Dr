import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailBody, DetailHeader } from "@/components/detail";
import { CMSImage } from "@/components/media";
import { RichText } from "@/components/rich-text";
import { ArrowLink, Facts } from "@/components/ui";
import { asCategory, asMedia, findBySlug } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/achievements/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await findBySlug("achievements", slug, 0);
  return item
    ? { title: item.title, description: item.summary ?? undefined }
    : {};
}

export default async function AchievementPage({
  params,
}: PageProps<"/achievements/[slug]">) {
  const { slug } = await params;
  const item = await findBySlug("achievements", slug);
  if (!item) notFound();
  const image = asMedia(item.image);
  const certificate =
    typeof item.certificate === "object" ? item.certificate : null;
  const event = typeof item.event === "object" ? item.event : null;

  return (
    <>
      <DetailHeader
        back={{ href: "/achievements", label: "Achievements" }}
        eyebrow={asCategory(item.category)?.title}
        title={item.title}
        meta={[formatDate(item.date)]}
      />
      <DetailBody>
        {image && (
          <CMSImage
            media={image}
            size="large"
            sizes="(min-width: 768px) 768px, 100vw"
            className="w-full rounded-3xl object-cover"
          />
        )}
        <Facts items={[{ label: "Awarded by", value: item.awardedBy }]} />
        {item.summary && <p className="text-lg text-pretty">{item.summary}</p>}
        <RichText data={item.details} />
        <div className="flex flex-wrap gap-6">
          {certificate?.slug && (
            <ArrowLink href={`/certificates/${certificate.slug}`}>
              View certificate
            </ArrowLink>
          )}
          {event?.slug && (
            <ArrowLink href={`/events/${event.slug}`}>{event.title}</ArrowLink>
          )}
        </div>
      </DetailBody>
    </>
  );
}
