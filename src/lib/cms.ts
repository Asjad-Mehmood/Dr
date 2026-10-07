import config from "@payload-config";
import { cache } from "react";
import { getPayload, type CollectionSlug, type Where } from "payload";
import type {
  Category,
  Media,
  MedicalCamp,
  PageText,
  SiteSetting,
  Journey,
} from "@/payload-types";

export const getCMS = cache(() => getPayload({ config }));

export const getSettings = cache(async () =>
  (await getCMS()).findGlobal({ slug: "site-settings", depth: 1 }),
);
export const getHome = cache(async () =>
  (await getCMS()).findGlobal({ slug: "home-page", depth: 1 }),
);
export const getAbout = cache(async () =>
  (await getCMS()).findGlobal({ slug: "about-page", depth: 1 }),
);
export const getPageTexts = cache(async () =>
  (await getCMS()).findGlobal({ slug: "page-texts", depth: 0 }),
);

// Public queries run with access control on, as an anonymous visitor: only
// published, public records come back.
export async function list<T extends CollectionSlug>(
  collection: T,
  options: {
    where?: Where;
    sort?: string;
    limit?: number;
    depth?: number;
  } = {},
) {
  const payload = await getCMS();
  const result = await payload.find({
    collection,
    overrideAccess: false,
    depth: options.depth ?? 1,
    where: options.where,
    sort: options.sort,
    pagination: Boolean(options.limit),
    limit: options.limit,
  });
  return result.docs;
}

export async function count(collection: CollectionSlug, where?: Where) {
  const payload = await getCMS();
  const result = await payload.count({
    collection,
    where,
    overrideAccess: false,
  });
  return result.totalDocs;
}

export async function findBySlug<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth = 2,
) {
  const [doc] = await list(collection, {
    where: { slug: { equals: slug } },
    limit: 1,
    depth,
  });
  return doc;
}

export function displayName(settings: SiteSetting) {
  const prefix = settings.prefix?.trim();
  const post = settings.postNominals?.trim();
  return `${prefix ? `${prefix} ` : ""}${settings.name}${post ? `, ${post}` : ""}`;
}

// A populated upload, or null when it is missing or not visible to the public.
export function asMedia(value: unknown): Media | null {
  return value && typeof value === "object" && "url" in value
    ? (value as Media)
    : null;
}

// Payload prefixes local files with the server URL; keep them relative so they
// work on any domain and go through the image optimiser as local files.
export function fileUrl(url?: string | null) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/api/media/")) {
      return parsed.pathname + parsed.search;
    }
  } catch {
    // Already relative.
  }
  return url;
}

export function mediaList(values: unknown): Media[] {
  return Array.isArray(values)
    ? values.map(asMedia).filter((m): m is Media => m !== null)
    : [];
}

export function asCategory(value: unknown): Category | null {
  return value && typeof value === "object" && "title" in value
    ? (value as Category)
    : null;
}

export type StageStatus = "completed" | "current" | "upcoming";

export function stageStatus(stage: Journey, currentYear: number): StageStatus {
  if (stage.progress && stage.progress !== "auto") return stage.progress;
  if (!stage.year) return "upcoming";
  if (stage.year < currentYear) return "completed";
  if (stage.year === currentYear) return "current";
  return "upcoming";
}

export function campTitle(camp: MedicalCamp, texts: PageText) {
  return (
    camp.title?.trim() ||
    `${texts.camps?.seriesTitle || "Annual Free Medical Camp"} ${camp.year}`
  );
}

export function canShowMedia(record: {
  privacy?: {
    mediaConsent?: boolean | null;
    publicDisplayApproved?: boolean | null;
  } | null;
}) {
  return Boolean(
    record.privacy?.mediaConsent && record.privacy?.publicDisplayApproved,
  );
}

export const publishedCamps = () => list("medical-camps", { sort: "year" });

export async function impactNumbers() {
  const academicCategories = await list("categories", {
    where: {
      and: [{ section: { equals: "events" } }, { academic: { equals: true } }],
    },
    depth: 0,
  });
  const [camps, community] = await Promise.all([
    publishedCamps(),
    list("community", { depth: 0 }),
  ]);
  const [certificates, workshops, research, publications, achievements] =
    await Promise.all([
      count("certificates"),
      academicCategories.length
        ? count("events", {
            category: { in: academicCategories.map((c) => c.id) },
          })
        : Promise.resolve(0),
      count("research", { type: { not_equals: "publication" } }),
      count("research", { type: { equals: "publication" } }),
      count("achievements"),
    ]);

  const held = camps.filter((c) => c.campStatus === "held");
  const verifiedCamps = held.filter((c) => c.numbersVerified);
  const verifiedCommunity = community.filter((c) => c.numbersVerified);
  const peopleServed =
    verifiedCamps.reduce((s, c) => s + (c.patientsServed ?? 0), 0) +
    verifiedCommunity.reduce((s, c) => s + (c.peopleServed ?? 0), 0);

  return [
    { label: "Medical camps", value: held.length },
    { label: "People served", value: peopleServed },
    { label: "Community activities", value: community.length },
    { label: "Certificates", value: certificates },
    { label: "Workshops & seminars", value: workshops },
    { label: "Research projects", value: research },
    { label: "Publications", value: publications },
    { label: "Achievements", value: achievements },
  ];
}
