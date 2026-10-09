import {
  Activity,
  Award,
  BookOpen,
  CalendarDays,
  CircleCheck,
  Circle,
  ExternalLink,
  FileText,
  FolderOpen,
  GraduationCap,
  HeartHandshake,
  Images,
  Lightbulb,
  Microscope,
  NotebookPen,
  Plus,
  Settings,
  Stethoscope,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { CollectionSlug, ServerProps } from "payload";
import { uploadsNeedBlobStore } from "@/lib/setup";
import Link from "next/link";

type Section = {
  slug: CollectionSlug;
  label: string;
  hint: string;
  icon: LucideIcon;
  drafts?: boolean;
};

const sections: Section[] = [
  {
    slug: "journey",
    label: "Medical journey",
    hint: "Years and stages of the journey",
    icon: GraduationCap,
    drafts: true,
  },
  {
    slug: "academic-records",
    label: "Academic records",
    hint: "Exams, results, milestones",
    icon: BookOpen,
    drafts: true,
  },
  {
    slug: "events",
    label: "Events",
    hint: "Seminars, workshops, college events",
    icon: CalendarDays,
    drafts: true,
  },
  {
    slug: "medical-camps",
    label: "Medical camps",
    hint: "One record per year",
    icon: Stethoscope,
    drafts: true,
  },
  {
    slug: "community",
    label: "Community service",
    hint: "Blood donation, outreach, welfare",
    icon: HeartHandshake,
    drafts: true,
  },
  {
    slug: "achievements",
    label: "Achievements",
    hint: "Awards and distinctions",
    icon: Trophy,
    drafts: true,
  },
  {
    slug: "certificates",
    label: "Certificates",
    hint: "With image and original PDF",
    icon: Award,
    drafts: true,
  },
  {
    slug: "research",
    label: "Research",
    hint: "Projects, posters, publications",
    icon: Microscope,
    drafts: true,
  },
  {
    slug: "gallery",
    label: "Gallery",
    hint: "Photo albums",
    icon: Images,
    drafts: true,
  },
  {
    slug: "journal",
    label: "Journal",
    hint: "Posts and reflections",
    icon: NotebookPen,
    drafts: true,
  },
  {
    slug: "documents",
    label: "Documents",
    hint: "CV, reports, papers",
    icon: FileText,
  },
  {
    slug: "media",
    label: "Media library",
    hint: "Every uploaded file",
    icon: FolderOpen,
  },
];

const quickActions: { label: string; href: string; icon: LucideIcon }[] = [
  {
    label: "Add an event",
    href: "/admin/collections/events/create",
    icon: CalendarDays,
  },
  {
    label: "Add a certificate",
    href: "/admin/collections/certificates/create",
    icon: Award,
  },
  {
    label: "Add an achievement",
    href: "/admin/collections/achievements/create",
    icon: Trophy,
  },
  {
    label: "Record community work",
    href: "/admin/collections/community/create",
    icon: HeartHandshake,
  },
  {
    label: "Create a photo album",
    href: "/admin/collections/gallery/create",
    icon: Images,
  },
  {
    label: "Add research",
    href: "/admin/collections/research/create",
    icon: Microscope,
  },
  {
    label: "Write a journal post",
    href: "/admin/collections/journal/create",
    icon: NotebookPen,
  },
  {
    label: "Upload files",
    href: "/admin/collections/media/create",
    icon: FolderOpen,
  },
];

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Karachi",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function titleOf(doc: Record<string, unknown>, slug: string) {
  if (slug === "medical-camps") return `Medical camp ${doc.year ?? ""}`;
  return String(doc.title ?? doc.alt ?? doc.filename ?? `#${doc.id}`);
}

export async function Dashboard({ payload, user }: ServerProps) {
  const base = { overrideAccess: true } as const;

  const [counts, recent, settings, home, about] = await Promise.all([
    Promise.all(
      sections.map(async (s) => {
        const total = (await payload.count({ collection: s.slug, ...base }))
          .totalDocs;
        const drafts = s.drafts
          ? (
              await payload.count({
                collection: s.slug,
                where: { _status: { equals: "draft" } },
                ...base,
              })
            ).totalDocs
          : 0;
        return { ...s, total, drafts };
      }),
    ),
    Promise.all(
      sections
        .filter((s) => s.slug !== "media")
        .map(async (s) => {
          const { docs } = await payload.find({
            collection: s.slug,
            sort: "-updatedAt",
            limit: 4,
            depth: 0,
            ...base,
          });
          return docs.map((doc) => ({
            doc: doc as unknown as Record<string, unknown>,
            section: s,
          }));
        }),
    ).then((groups) =>
      groups
        .flat()
        .sort((a, b) =>
          String(b.doc.updatedAt).localeCompare(String(a.doc.updatedAt)),
        )
        .slice(0, 8),
    ),
    payload.findGlobal({ slug: "site-settings", depth: 0 }),
    payload.findGlobal({ slug: "home-page", depth: 0 }),
    payload.findGlobal({ slug: "about-page", depth: 0 }),
  ]);

  const [currentCamp] = (
    await payload.find({
      collection: "medical-camps",
      where: { year: { equals: settings.currentYear } },
      limit: 1,
      depth: 0,
      ...base,
    })
  ).docs;
  const count = (slug: CollectionSlug) =>
    counts.find((c) => c.slug === slug)?.total ?? 0;

  const checklist = [
    {
      done: Boolean(settings.email),
      label: "Add a contact email",
      hint: "Shown in the footer and on the Contact page.",
      href: "/admin/globals/site-settings",
    },
    {
      done: Boolean(home.portrait || about.portrait),
      label: "Upload a portrait photo",
      hint: "Appears on the home and About pages.",
      href: "/admin/globals/home-page",
    },
    {
      done: Boolean(
        about.interests?.length || about.skills?.length || about.careerGoals,
      ),
      label: "Complete the About profile",
      hint: "Interests, skills, languages and goals.",
      href: "/admin/globals/about-page",
    },
    {
      done: count("events") > 0,
      label: "Add the first event",
      hint: "Orientation, a seminar or a workshop.",
      href: "/admin/collections/events/create",
    },
    {
      done: Boolean(currentCamp?.date),
      label: `Record the ${settings.currentYear} medical camp`,
      hint: "Date, location, team and verified numbers.",
      href: currentCamp
        ? `/admin/collections/medical-camps/${currentCamp.id}`
        : "/admin/collections/medical-camps/create",
    },
    ...(process.env.VERCEL
      ? [
          {
            done: !uploadsNeedBlobStore(),
            label: "Connect photo storage",
            hint: "Vercel → Storage → Blob, then redeploy.",
            href: "/health",
          },
        ]
      : []),
  ];
  const done = checklist.filter((c) => c.done).length;
  const name =
    (user as { name?: string } | undefined)?.name ||
    String(user?.email ?? "").split("@")[0];

  return (
    <div className="dr-dash">
      <header className="dr-hero">
        <div>
          <p className="dr-eyebrow">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "Asia/Karachi",
            }).format(new Date())}
          </p>
          <h1 className="dr-hero__title">
            {greeting()}
            {name ? `, ${name}` : ""}
          </h1>
          <p className="dr-hero__text">
            Everything on the website is managed here. Journey year:{" "}
            <strong>{settings.currentYear}</strong>
            {settings.role ? (
              <>
                {" "}
                · Shown as <strong>{settings.role}</strong>
              </>
            ) : null}
            .
          </p>
        </div>
        <div className="dr-hero__actions">
          <a
            className="dr-btn dr-btn--primary"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden="true" /> View website
          </a>
          <a className="dr-btn" href="/health" target="_blank" rel="noreferrer">
            <Activity aria-hidden="true" /> System status
          </a>
          <Link className="dr-btn" href="/admin/globals/site-settings">
            <Settings aria-hidden="true" /> Site settings
          </Link>
        </div>
      </header>

      <section className="dr-panel">
        <h2 className="dr-h2">Quick actions</h2>
        <div className="dr-actions">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="dr-action">
              <span className="dr-badge">
                <action.icon aria-hidden="true" />
              </span>
              <span>{action.label}</span>
              <Plus aria-hidden="true" className="dr-action__plus" />
            </Link>
          ))}
          {currentCamp && (
            <Link
              href={`/admin/collections/medical-camps/${currentCamp.id}`}
              className="dr-action"
            >
              <span className="dr-badge">
                <Stethoscope aria-hidden="true" />
              </span>
              <span>Update the {settings.currentYear} camp</span>
            </Link>
          )}
        </div>
      </section>

      <div className="dr-grid">
        <section className="dr-panel">
          <div className="dr-panel__head">
            <h2 className="dr-h2">Get the site ready</h2>
            <span className="dr-muted">
              {done} of {checklist.length} done
            </span>
          </div>
          <div className="dr-progress" aria-hidden="true">
            <span style={{ width: `${(done / checklist.length) * 100}%` }} />
          </div>
          <ul className="dr-checklist">
            {checklist.map((item) => (
              <li key={item.label} className={item.done ? "is-done" : ""}>
                {item.done ? (
                  <CircleCheck
                    aria-hidden="true"
                    className="dr-check dr-check--done"
                  />
                ) : (
                  <Circle aria-hidden="true" className="dr-check" />
                )}
                <div>
                  <p className="dr-checklist__label">{item.label}</p>
                  <p className="dr-muted">{item.hint}</p>
                </div>
                {!item.done && (
                  <Link href={item.href} className="dr-link">
                    Fix
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="dr-panel">
          <h2 className="dr-h2">Recently edited</h2>
          {recent.length > 0 ? (
            <ul className="dr-recent">
              {recent.map(({ doc, section }) => (
                <li key={`${section.slug}-${doc.id}`}>
                  <Link href={`/admin/collections/${section.slug}/${doc.id}`}>
                    <span className="dr-badge dr-badge--sm">
                      <section.icon aria-hidden="true" />
                    </span>
                    <span className="dr-recent__title">
                      {titleOf(doc, section.slug)}
                      <span className="dr-muted">{section.label}</span>
                    </span>
                    {doc._status === "draft" && (
                      <span className="dr-pill dr-pill--draft">Draft</span>
                    )}
                    <span className="dr-muted dr-recent__time">
                      {timeAgo(String(doc.updatedAt))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dr-muted">Nothing edited yet.</p>
          )}
        </section>
      </div>

      <section className="dr-panel">
        <h2 className="dr-h2">Sections</h2>
        <div className="dr-sections">
          {counts.map((s) => (
            <div key={s.slug} className="dr-section">
              <Link
                href={`/admin/collections/${s.slug}`}
                className="dr-section__main"
              >
                <span className="dr-badge">
                  <s.icon aria-hidden="true" />
                </span>
                <span>
                  <span className="dr-section__label">{s.label}</span>
                  <span className="dr-muted">{s.hint}</span>
                </span>
              </Link>
              <div className="dr-section__foot">
                <span>
                  <strong>{s.total}</strong>{" "}
                  {s.total === 1 ? "record" : "records"}
                  {s.drafts > 0 && (
                    <span className="dr-pill dr-pill--draft">
                      {s.drafts} draft
                    </span>
                  )}
                </span>
                <Link
                  href={`/admin/collections/${s.slug}/create`}
                  className="dr-link"
                >
                  <Plus aria-hidden="true" /> New
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dr-panel dr-tips">
        <h2 className="dr-h2">
          <Lightbulb aria-hidden="true" /> Good to know
        </h2>
        <ul>
          <li>
            <strong>Drafts stay hidden.</strong> Use <em>Save draft</em> while
            working and <em>Publish</em> when a record is ready for the website.
          </li>
          <li>
            <strong>Every new academic year,</strong> change{" "}
            <Link href="/admin/globals/site-settings">
              Current year of the journey
            </Link>{" "}
            so the timeline moves on.
          </li>
          <li>
            <strong>Privacy:</strong> camp and community photos only appear when
            both consent boxes are ticked, and numbers only when{" "}
            <em>Numbers verified</em> is ticked. Never enter patient details.
          </li>
          <li>
            <strong>After graduation,</strong> set the prefix to “Dr.” and the
            post-nominals to “MBBS” in Site settings.
          </li>
        </ul>
      </section>

      <h2 className="dr-h2 dr-all">All collections & settings</h2>
    </div>
  );
}
