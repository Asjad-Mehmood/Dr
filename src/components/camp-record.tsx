import Image from "next/image";
import Link from "next/link";
import { isHeld, ordinal, type Camp } from "@/content/camps";
import { profile } from "@/content/profile";

const TBR = "To be recorded";

export function CampRecord({
  camp,
  linkToYear = false,
}: {
  camp: Camp;
  linkToYear?: boolean;
}) {
  const held = isHeld(camp);
  const stats = [
    { label: "Date", value: camp.date },
    { label: "Location", value: camp.location },
    {
      label: "Patients served",
      value: camp.patientsServed?.toLocaleString("en-US"),
    },
    { label: "Volunteers", value: camp.volunteers?.toLocaleString("en-US") },
  ];

  return (
    <article
      id={String(camp.year)}
      className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {ordinal(camp.edition)} Annual Camp
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold">
            Free Medical Camp {camp.year}
          </h3>
        </div>
        <span
          className={`rounded-full border border-line px-3 py-1 text-xs font-medium ${
            held ? "bg-primary-soft text-primary" : "text-muted"
          }`}
        >
          {held
            ? "Held"
            : camp.year < profile.currentYear
              ? "Not recorded"
              : "Planned"}
        </span>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-xs text-muted">{stat.label}</dt>
            <dd
              className={`mt-1 ${stat.value ? "font-medium" : "text-sm text-muted italic"}`}
            >
              {stat.value ?? TBR}
            </dd>
          </div>
        ))}
      </dl>

      {camp.services.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-muted">Services offered</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {camp.services.map((service) => (
              <li
                key={service}
                className="rounded-full bg-primary-soft px-3 py-1 text-sm text-primary"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>
      )}

      {camp.partners.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          In partnership with {camp.partners.join(", ")}.
        </p>
      )}

      {camp.story && <p className="mt-6 text-pretty">{camp.story}</p>}

      {camp.photos.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {camp.photos.map((photo) => (
            <li
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-xl bg-background"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      )}

      {!held && (
        <p className="mt-6 text-sm text-muted">
          {camp.year >= profile.currentYear
            ? `Details, numbers and photographs will be added here after the ${camp.year} camp.`
            : "No record has been added for this year yet."}
        </p>
      )}

      {linkToYear && (
        <Link
          href={`/journey/${camp.year}`}
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          See the rest of {camp.year} →
        </Link>
      )}
    </article>
  );
}
