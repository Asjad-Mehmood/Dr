import {
  Award,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Images,
  Microscope,
  NotebookPen,
  Sparkles,
  Stethoscope,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { IconBadge } from "@/components/icons";
import { CMSImage, isImage } from "@/components/media";
import { ArrowLink, Container, SectionHeading } from "@/components/ui";
import {
  asMedia,
  campTitle,
  canShowMedia,
  getCMS,
  getPageTexts,
  getSettings,
  list,
} from "@/lib/cms";
import { formatDate } from "@/lib/format";
import type {
  AiHighlight,
  Media,
  MedicalCamp,
  PageText,
} from "@/payload-types";

type Pick = NonNullable<AiHighlight["picks"]>[number];
type PickCollection = Pick["collection"];
type SectionKey = NonNullable<
  NonNullable<AiHighlight["strongestSection"]>["key"]
>;

const collections: Record<
  PickCollection,
  {
    label: string;
    cta: string;
    icon: LucideIcon;
    href: (r: LooseRecord) => string;
  }
> = {
  events: {
    label: "Event",
    cta: "View event",
    icon: CalendarDays,
    href: (r) => `/events/${r.slug}`,
  },
  achievements: {
    label: "Achievement",
    cta: "View achievement",
    icon: Trophy,
    href: (r) => `/achievements/${r.slug}`,
  },
  certificates: {
    label: "Certificate",
    cta: "View certificate",
    icon: Award,
    href: (r) => `/certificates/${r.slug}`,
  },
  research: {
    label: "Research",
    cta: "Read more",
    icon: Microscope,
    href: (r) => `/research/${r.slug}`,
  },
  community: {
    label: "Community service",
    cta: "Read more",
    icon: HeartHandshake,
    href: (r) => `/community/${r.slug}`,
  },
  "medical-camps": {
    label: "Medical camp",
    cta: "Camp details",
    icon: Stethoscope,
    href: (r) => `/medical-camps/${r.year}`,
  },
  journal: {
    label: "Journal",
    cta: "Read the post",
    icon: NotebookPen,
    href: (r) => `/journal/${r.slug}`,
  },
  gallery: {
    label: "Gallery",
    cta: "Open album",
    icon: Images,
    href: (r) => `/gallery/${r.slug}`,
  },
  "academic-records": {
    label: "Academic",
    cta: "View academics",
    icon: BookOpen,
    href: () => "/academic",
  },
};

const sections: Record<SectionKey, { label: string; href: string }> = {
  journey: { label: "the journey", href: "/journey" },
  academic: { label: "academics", href: "/academic" },
  research: { label: "research", href: "/research" },
  community: { label: "community service", href: "/community" },
  camps: { label: "medical camps", href: "/medical-camps" },
  events: { label: "events", href: "/events" },
  achievements: { label: "achievements", href: "/achievements" },
  certificates: { label: "certificates", href: "/certificates" },
  gallery: { label: "the gallery", href: "/gallery" },
  journal: { label: "the journal", href: "/journal" },
};

// The fields the section reads, shared by every highlightable collection.
type LooseRecord = {
  id: number;
  title?: string | null;
  slug?: string | null;
  year?: number | null;
  date?: string | null;
  cover?: unknown;
  image?: unknown;
  preview?: unknown;
  photos?: unknown[] | null;
  privacy?: {
    mediaConsent?: boolean | null;
    publicDisplayApproved?: boolean | null;
  } | null;
};

type Resolved = {
  key: string;
  href: string;
  title: string;
  date: string;
  kind: string;
  cta: string;
  icon: LucideIcon;
  tag?: string | null;
  reason?: string | null;
  image: Media | null;
};

function pickImage(record: LooseRecord): Media | null {
  // Records with a privacy group (camps, community service) only show photos
  // when consent and public display are both approved.
  const photos =
    record.privacy && !canShowMedia(record) ? [] : (record.photos ?? []);
  for (const candidate of [
    record.cover,
    record.image,
    record.preview,
    photos[0],
  ]) {
    const media = asMedia(candidate);
    if (media && isImage(media)) return media;
  }
  return null;
}

async function resolvePick(
  pick: Pick,
  index: number,
  texts: PageText,
): Promise<Resolved | null> {
  const meta = collections[pick.collection];
  if (!meta || typeof pick.docId !== "number") return null;
  try {
    const [doc] = await list(pick.collection, {
      where: { id: { equals: pick.docId } },
      limit: 1,
      depth: 1,
    });
    if (!doc) return null;
    const record = doc as unknown as LooseRecord;
    const href = meta.href(record);
    if (href.endsWith("/undefined") || href.endsWith("/null")) return null;
    const title =
      pick.collection === "medical-camps"
        ? campTitle(doc as unknown as MedicalCamp, texts)
        : record.title?.trim() || pick.title?.trim() || "";
    if (!title) return null;
    return {
      key: `${pick.collection}-${pick.docId}-${index}`,
      href,
      title,
      date: formatDate(record.date),
      kind: meta.label,
      cta: meta.cta,
      icon: meta.icon,
      tag: pick.label?.trim(),
      reason: pick.reason?.trim(),
      image: pickImage(record),
    };
  } catch {
    return null;
  }
}

const lgCols: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

export async function AiHighlightsSection() {
  let global: AiHighlight;
  try {
    global = await (
      await getCMS()
    ).findGlobal({ slug: "ai-highlights", depth: 0 });
  } catch {
    return null;
  }
  if (!global?.showOnHome || !global.picks?.length) return null;

  const [texts, settings] = await Promise.all([getPageTexts(), getSettings()]);
  const max = Math.max(1, Math.min(global.maxItems ?? 4, 8));
  const resolved = await Promise.all(
    global.picks
      .slice(0, max)
      .map((pick, index) => resolvePick(pick, index, texts)),
  );
  const items = resolved.filter((item): item is Resolved => item !== null);
  if (items.length === 0) return null;

  const strongest = global.strongestSection;
  const strongestSection = strongest?.key ? sections[strongest.key] : null;
  const firstName = settings.name?.trim().split(/\s+/)[0];

  return (
    <section className="pt-20 sm:pt-24">
      <Container>
        <SectionHeading
          eyebrow="Highlights"
          title={global.title?.trim() || "Highlights"}
        >
          {global.intro}
        </SectionHeading>

        {strongest?.label && (
          <div className="reveal mt-10 flex flex-col gap-5 rounded-2xl border border-line bg-primary-soft/60 p-6 sm:flex-row sm:items-center sm:p-8">
            <IconBadge
              icon={Sparkles}
              size="lg"
              className="bg-surface shadow-soft"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Strongest area
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-balance">
                {strongest.label}
              </p>
              {strongest.reason && (
                <p className="mt-2 max-w-3xl text-sm text-muted text-pretty">
                  {strongest.reason}
                </p>
              )}
            </div>
            {strongestSection && (
              <div className="shrink-0">
                <ArrowLink href={strongestSection.href}>
                  Explore {strongestSection.label}
                </ArrowLink>
              </div>
            )}
          </div>
        )}

        <ul
          className={`mt-8 grid gap-4 sm:grid-cols-2 ${lgCols[items.length] ?? "lg:grid-cols-4"}`}
        >
          {items.map((item) => (
            <li key={item.key} className="reveal">
              <Link
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40"
              >
                {item.image ? (
                  <div className="aspect-[16/10] overflow-hidden bg-primary-soft">
                    <CMSImage
                      media={item.image}
                      size="card"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="px-6 pt-6">
                    <IconBadge icon={item.icon} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                    {item.tag && (
                      <span className="rounded-full bg-primary-soft px-2.5 py-0.5 font-medium text-primary">
                        {item.tag}
                      </span>
                    )}
                    <span>
                      {item.kind}
                      {item.date && ` · ${item.date}`}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-xl font-semibold text-balance group-hover:text-primary">
                    {item.title}
                  </p>
                  {item.reason && (
                    <p className="mt-2 text-sm text-muted text-pretty">
                      {item.reason}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary">
                    <span className="underline-offset-4 group-hover:underline">
                      {item.cta}
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 flex items-center gap-2 text-xs text-muted">
          <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
          <span>
            Selected with AI from published records and reviewed by{" "}
            {firstName || "the site owner"}.
          </span>
        </p>
      </Container>
    </section>
  );
}
