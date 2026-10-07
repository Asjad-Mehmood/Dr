import { campTitle, canShowMedia, mediaList, asMedia } from "@/lib/cms";
import { formatDate, formatNumber, ordinal } from "@/lib/format";
import type { MedicalCamp, PageText } from "@/payload-types";
import { FileLinks, PhotoGrid, Video } from "./media";
import { RichText } from "./rich-text";
import { Facts, Section, Tag } from "./ui";

export function campFacts(camp: MedicalCamp) {
  const verified = (n?: number | null) =>
    camp.numbersVerified && n ? formatNumber(n) : undefined;
  return [
    { label: "Date", value: formatDate(camp.date) || "To be announced" },
    { label: "Location", value: camp.location },
    { label: "Organised by", value: camp.organizedBy },
    { label: "Patients served", value: verified(camp.patientsServed) },
    { label: "Doctors", value: verified(camp.doctors) },
    { label: "Volunteers", value: verified(camp.volunteers) },
    { label: "Services provided", value: camp.services?.length || undefined },
  ];
}

export function CampDetail({
  camp,
  texts,
}: {
  camp: MedicalCamp;
  texts: PageText;
}) {
  const showMedia = canShowMedia(camp);
  const photos = showMedia ? mediaList(camp.photos) : [];
  const videoFile = showMedia ? asMedia(camp.videoFile) : null;
  const videoUrl = showMedia ? camp.videoUrl : null;

  return (
    <div className="space-y-16">
      <Facts items={campFacts(camp)} />
      {camp.summary && (
        <p className="max-w-2xl text-lg text-pretty">{camp.summary}</p>
      )}
      <RichText data={camp.story} />

      {camp.services && camp.services.length > 0 && (
        <Section title="Services">
          <ul className="flex flex-wrap gap-2">
            {camp.services.map((s) => (
              <li key={s.id}>
                <Tag>{s.name}</Tag>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {camp.awareness && camp.awareness.length > 0 && (
        <Section title="Health awareness">
          <ul className="flex flex-wrap gap-2">
            {camp.awareness.map((a) => (
              <li key={a.id}>
                <Tag>{a.topic}</Tag>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {camp.medicinesSupport && (
        <Section title="Medicines & support">
          <p className="max-w-2xl text-muted text-pretty">
            {camp.medicinesSupport}
          </p>
        </Section>
      )}
      {camp.team && camp.team.length > 0 && (
        <Section title="Medical team">
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {camp.team.map((m) => (
              <li key={m.id}>
                <p className="font-medium">{m.name}</p>
                {m.role && <p className="text-sm text-muted">{m.role}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {camp.sponsors && camp.sponsors.length > 0 && (
        <Section title="Sponsors & supporters">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {camp.sponsors.map((s) => (
              <li key={s.id}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary"
                  >
                    {s.name}
                  </a>
                ) : (
                  s.name
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {photos.length > 0 && (
        <Section title="Camp gallery">
          <PhotoGrid photos={photos} />
        </Section>
      )}
      {(videoFile || videoUrl) && (
        <Section title="Camp video">
          <Video
            url={videoUrl}
            file={videoFile}
            title={campTitle(camp, texts)}
          />
        </Section>
      )}
      <FileLinks
        files={[
          { label: "Annual camp report", media: asMedia(camp.report) },
          {
            label: "Certificate / recognition",
            media: asMedia(camp.certificate),
          },
        ]}
      />
    </div>
  );
}

export function campLabel(camp: MedicalCamp) {
  return `${ordinal(camp.edition)} Camp`;
}
