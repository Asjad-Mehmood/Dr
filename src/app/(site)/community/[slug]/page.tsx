import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailBody, DetailHeader } from "@/components/detail";
import { FileLinks, PhotoGrid, Video } from "@/components/media";
import { RichText } from "@/components/rich-text";
import { Facts, Section, Tag } from "@/components/ui";
import { communityTypes } from "@/cms/collections/CommunityService";
import { asMedia, canShowMedia, findBySlug, mediaList } from "@/lib/cms";
import { formatDate, formatNumber } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/community/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await findBySlug("community", slug, 0);
  return item
    ? { title: item.title, description: item.summary ?? undefined }
    : {};
}

export default async function CommunityItemPage({
  params,
}: PageProps<"/community/[slug]">) {
  const { slug } = await params;
  const item = await findBySlug("community", slug);
  if (!item) notFound();
  const showMedia = canShowMedia(item);
  const verified = (n?: number | null) =>
    item.numbersVerified && n ? formatNumber(n) : undefined;

  return (
    <>
      <DetailHeader
        back={{ href: "/community", label: "Community service" }}
        eyebrow={communityTypes.find((t) => t.value === item.type)?.label}
        title={item.title}
        meta={[formatDate(item.date), item.location]}
      />
      <DetailBody>
        <Facts
          items={[
            { label: "Naima's role", value: item.role },
            { label: "Organised by", value: item.organizer },
            { label: "People served", value: verified(item.peopleServed) },
            { label: "Doctors", value: verified(item.doctors) },
            { label: "Volunteers", value: verified(item.volunteers) },
            { label: "Supported by", value: item.supporters },
          ]}
        />
        {item.summary && <p className="text-lg text-pretty">{item.summary}</p>}
        <RichText data={item.description} />
        {item.services && item.services.length > 0 && (
          <Section title="Services">
            <ul className="flex flex-wrap gap-2">
              {item.services.map((s) => (
                <li key={s.id}>
                  <Tag>{s.name}</Tag>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {showMedia && mediaList(item.photos).length > 0 && (
          <Section title="Photographs">
            <PhotoGrid photos={mediaList(item.photos)} />
          </Section>
        )}
        {showMedia && (item.videoUrl || asMedia(item.videoFile)) && (
          <Section title="Video">
            <Video
              url={item.videoUrl}
              file={asMedia(item.videoFile)}
              title={item.title}
            />
          </Section>
        )}
        <FileLinks
          files={[
            { label: "Certificate", media: asMedia(item.certificate) },
            { label: "Report", media: asMedia(item.report) },
          ]}
        />
      </DetailBody>
    </>
  );
}
