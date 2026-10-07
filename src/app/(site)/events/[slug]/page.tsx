import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailBody, DetailHeader } from "@/components/detail";
import { CMSImage, PhotoGrid, Video } from "@/components/media";
import { RecordList } from "@/components/record-list";
import { RichText } from "@/components/rich-text";
import { Facts, Section } from "@/components/ui";
import { asCategory, asMedia, findBySlug, mediaList } from "@/lib/cms";
import { formatDate, formatRange, isUpcoming } from "@/lib/format";
import type { Certificate } from "@/payload-types";

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await findBySlug("events", slug, 0);
  return event
    ? { title: event.title, description: event.summary ?? undefined }
    : {};
}

export default async function EventPage({
  params,
}: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await findBySlug("events", slug);
  if (!event) notFound();
  const cover = asMedia(event.cover);
  const photos = mediaList(event.photos);
  const certificates = (event.certificates ?? []).filter(
    (c): c is Certificate => typeof c === "object" && c !== null,
  );

  return (
    <>
      <DetailHeader
        back={{ href: "/events", label: "Events" }}
        eyebrow={[
          asCategory(event.category)?.title,
          isUpcoming(event.date) ? "Upcoming" : null,
        ]
          .filter(Boolean)
          .join(" · ")}
        title={event.title}
        meta={[formatRange(event.date, event.endDate), event.location]}
      />
      <DetailBody>
        {cover && (
          <CMSImage
            media={cover}
            size="large"
            sizes="(min-width: 768px) 768px, 100vw"
            className="w-full rounded-3xl object-cover"
          />
        )}
        <Facts items={[{ label: "Naima's role", value: event.role }]} />
        {event.summary && (
          <p className="text-lg text-pretty">{event.summary}</p>
        )}
        <RichText data={event.description} />
        {photos.length > 0 && (
          <Section title="Photographs">
            <PhotoGrid photos={photos} />
          </Section>
        )}
        {(event.videoUrl || asMedia(event.videoFile)) && (
          <Section title="Video">
            <Video
              url={event.videoUrl}
              file={asMedia(event.videoFile)}
              title={event.title}
            />
          </Section>
        )}
        {certificates.length > 0 && (
          <Section title="Certificates">
            <RecordList
              rows={certificates.map((c) => ({
                key: c.id,
                title: c.title,
                href: `/certificates/${c.slug}`,
                date: formatDate(c.date),
                meta: c.issuer,
              }))}
            />
          </Section>
        )}
      </DetailBody>
    </>
  );
}
