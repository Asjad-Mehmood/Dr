import type { CollectionSlug, Payload } from "payload";
import {
  highlightCollections,
  highlightSections,
} from "@/cms/globals/AiHighlights";
import { aiConfig, aiJson, AiError } from "./client";
import { rankLocally, score } from "./local-ranking";

export const BUILT_IN_RANKING = "Built-in ranking";

type HighlightCollection = (typeof highlightCollections)[number]["value"];
type SectionKey = (typeof highlightSections)[number]["value"];

type Record_ = Record<string, unknown> & { id: number };

const MAX_TEXT = 400;
const MAX_RECORDS_PER_COLLECTION = 60;

// Plain text from a Lexical rich-text value.
function lexicalText(value: unknown): string {
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as { text?: unknown; children?: unknown[]; root?: unknown };
    if (typeof n.text === "string") parts.push(n.text);
    if (n.root) walk(n.root);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  walk(value);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

const clip = (text: string, max = MAX_TEXT) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

const day = (value: unknown) =>
  typeof value === "string" ? value.slice(0, 10) : undefined;

function titleOf(doc: Record_, collection: HighlightCollection) {
  if (collection === "medical-camps") {
    return String(doc.title || `Annual Free Medical Camp ${doc.year ?? ""}`);
  }
  return String(doc.title ?? `#${doc.id}`);
}

// A compact, public-only description of a record for the model. Numbers are
// only included when they have been verified; no files or personal data.
function describe(doc: Record_, collection: HighlightCollection) {
  const category =
    doc.category && typeof doc.category === "object"
      ? (doc.category as { title?: string }).title
      : undefined;
  const verified = Boolean(doc.numbersVerified);
  const text = clip(
    [
      doc.summary,
      doc.excerpt,
      doc.description && typeof doc.description === "string"
        ? doc.description
        : lexicalText(doc.description),
      lexicalText(doc.details),
      lexicalText(doc.abstract),
      lexicalText(doc.story),
      lexicalText(doc.content),
    ]
      .filter((part) => typeof part === "string" && part.trim())
      .join(" — "),
  );
  const entry: Record<string, unknown> = {
    ref: `${collection}:${doc.id}`,
    collection,
    title: titleOf(doc, collection),
    date: day(doc.date) ?? (doc.year ? String(doc.year) : undefined),
    category,
    type: doc.type,
    role: doc.role,
    location: doc.location,
    issuer: doc.issuer ?? doc.awardedBy,
    venue: doc.venue,
    status: doc.researchStatus ?? doc.campStatus,
    edition: doc.edition,
    subject: doc.subject,
    result: doc.showResult ? doc.result : undefined,
    patientsServed: verified ? doc.patientsServed : undefined,
    peopleServed: verified ? doc.peopleServed : undefined,
    doctors: verified ? doc.doctors : undefined,
    volunteers: verified ? doc.volunteers : undefined,
    services: Array.isArray(doc.services)
      ? doc.services.length || undefined
      : undefined,
    photos: Array.isArray(doc.photos)
      ? doc.photos.length || undefined
      : undefined,
    text: text || undefined,
  };
  return Object.fromEntries(
    Object.entries(entry).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
}

async function collectRecords(payload: Payload) {
  const byRef = new Map<
    string,
    {
      collection: HighlightCollection;
      doc: Record_;
      entry: Record<string, unknown>;
    }
  >();
  const counts: Record<string, number> = {};

  await Promise.all(
    highlightCollections.map(async ({ value: collection }) => {
      const { docs } = await payload.find({
        collection: collection as CollectionSlug,
        // Anonymous visitor's view: published and public records only.
        overrideAccess: false,
        depth: 1,
        sort: collection === "medical-camps" ? "-year" : "-date",
        limit: MAX_RECORDS_PER_COLLECTION,
      });
      // Planned (not yet held) camps are not achievements.
      const usable = (docs as unknown as Record_[]).filter(
        (doc) => collection !== "medical-camps" || doc.campStatus === "held",
      );
      counts[collection] = usable.length;
      for (const doc of usable) {
        const entry = describe(doc, collection);
        byRef.set(entry.ref as string, { collection, doc, entry });
      }
    }),
  );
  return { byRef, counts };
}

type AiAnswer = {
  intro: string;
  strongestSection: { key: SectionKey; label: string; reason: string };
  picks: { ref: string; label: string; reason: string }[];
};

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["intro", "strongestSection", "picks"],
  properties: {
    intro: { type: "string" },
    strongestSection: {
      type: "object",
      additionalProperties: false,
      required: ["key", "label", "reason"],
      properties: {
        key: { type: "string", enum: highlightSections.map((s) => s.value) },
        label: { type: "string" },
        reason: { type: "string" },
      },
    },
    picks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["ref", "label", "reason"],
        properties: {
          ref: { type: "string" },
          label: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
  },
};

export async function analyzeHighlights(payload: Payload) {
  const [settings, current] = await Promise.all([
    payload.findGlobal({ slug: "site-settings", depth: 0 }),
    payload.findGlobal({ slug: "ai-highlights", depth: 0 }),
  ]);
  const maxItems = Math.min(Math.max(current.maxItems ?? 4, 1), 8);
  const name = settings.name || "the student";

  const { byRef, counts } = await collectRecords(payload);
  if (byRef.size === 0) {
    throw new AiError(
      "There are no published records to analyse yet. Publish a few events, certificates or achievements first.",
      422,
    );
  }

  // Strongest-looking records first, then as many as fit one request (the
  // free Groq plan only takes a few thousand tokens a minute).
  const now = Date.now();
  const ranked = [...byRef.entries()]
    .map(([ref, { collection, doc, entry }]) => ({
      entry,
      score: score(
        { ref, collection, doc, title: titleOf(doc, collection) },
        now,
      ),
    }))
    .sort((a, b) => b.score - a.score);
  const budget = aiConfig().maxInputChars;
  const records: Record<string, unknown>[] = [];
  let used = 0;
  for (const { entry } of ranked) {
    const size = JSON.stringify(entry).length + 1;
    if (records.length > 0 && used + size > budget) break;
    records.push(entry);
    used += size;
  }
  const sectionCounts = {
    events: counts.events ?? 0,
    achievements: counts.achievements ?? 0,
    certificates: counts.certificates ?? 0,
    research: counts.research ?? 0,
    community: counts.community ?? 0,
    camps: counts["medical-camps"] ?? 0,
    journal: counts.journal ?? 0,
    gallery: counts.gallery ?? 0,
    academic: counts["academic-records"] ?? 0,
  };

  const toPick = (ref: string, labelText: unknown, reasonText: unknown) => {
    const { collection, doc } = byRef.get(ref)!;
    return {
      collection,
      docId: doc.id,
      title: titleOf(doc, collection),
      label: clip(String(labelText ?? ""), 30),
      reason: clip(String(reasonText ?? ""), 220),
    };
  };

  let result: {
    intro: string;
    section: { key: string; label: string; reason: string } | null;
    picks: ReturnType<typeof toPick>[];
    model: string;
    notice: string | null;
  };
  try {
    const { data, model } = await aiJson<AiAnswer>({
      schemaName: "portfolio_highlights",
      schema,
      messages: [
        {
          role: "system",
          content: [
            `You are the editor of ${name}'s professional medical portfolio website (${settings.role ?? "MBBS student"}, ${settings.institution ?? ""}).`,
            `Choose the ${maxItems} records that best show ${name}'s strengths to visitors such as faculty, hospitals and training programmes: verified impact (people served), awards and distinctions, research outputs, leadership roles, community service, and consistent growth. Prefer substance over routine attendance, verified numbers over claims, and recent items when strength is similar. Cover different kinds of work when possible.`,
            "Also name the single strongest section of the portfolio and say why, based on the records and section counts.",
            "Rules: use only facts present in the data — never invent numbers, roles, awards or outcomes. Refer to records only by their exact `ref`. Write in clear, warm, professional English in the third person. Each reason is one sentence of at most 25 words. Each label is 1–3 words (e.g. Research, Leadership, Community impact). The intro is one or two sentences (at most 40 words) for a home-page section introducing the highlights. Make no medical or health claims beyond what the records state.",
          ].join("\n"),
        },
        {
          role: "user",
          content: JSON.stringify({ sectionCounts, records }),
        },
      ],
    });

    // Keep only picks that point at real, published records, without repeats.
    const seen = new Set<string>();
    const picks = (Array.isArray(data.picks) ? data.picks : [])
      .filter(
        (pick) =>
          byRef.has(pick.ref) && !seen.has(pick.ref) && seen.add(pick.ref),
      )
      .slice(0, maxItems)
      .map((pick) => toPick(pick.ref, pick.label, pick.reason));
    if (picks.length === 0) {
      throw new AiError("The AI did not return any usable picks.", 502);
    }
    result = {
      intro: String(data.intro ?? ""),
      section: data.strongestSection ?? null,
      picks,
      model,
      notice: null,
    };
  } catch (error) {
    // AI missing, failing or unhelpful: fall back to the built-in ranking.
    const why =
      error instanceof AiError
        ? error.message
        : "The AI service could not be used.";
    if (!(error instanceof AiError)) {
      payload.logger.error(
        { err: error },
        "AI highlights fell back to local ranking",
      );
    }
    const ranking = rankLocally(
      [...byRef.entries()].map(([ref, { collection, doc }]) => ({
        ref,
        collection,
        doc,
        title: titleOf(doc, collection),
      })),
      maxItems,
    );
    result = {
      intro: ranking.intro,
      section: ranking.strongestSection,
      picks: ranking.picks.map((pick) =>
        toPick(pick.ref, pick.label, pick.reason),
      ),
      model: BUILT_IN_RANKING,
      notice: `${why} The built-in ranking was used instead.`,
    };
  }

  const section = result.section;
  const sectionKey = highlightSections.find(
    (s) => s.value === section?.key,
  )?.value;

  // A new set of picks always needs a fresh review before it goes live.
  await payload.updateGlobal({
    slug: "ai-highlights",
    overrideAccess: true,
    data: {
      showOnHome: false,
      intro: clip(result.intro, 300),
      strongestSection: {
        key: sectionKey ?? null,
        label:
          sectionKey && section ? clip(String(section.label ?? ""), 80) : null,
        reason:
          sectionKey && section
            ? clip(String(section.reason ?? ""), 300)
            : null,
      },
      picks: result.picks,
      lastAnalyzedAt: new Date().toISOString(),
      model: result.model,
      recordsAnalyzed: byRef.size,
      lastError: result.notice,
    },
  });

  return {
    picks: result.picks.length,
    model: result.model,
    source:
      result.model === BUILT_IN_RANKING ? ("local" as const) : ("ai" as const),
    notice: result.notice,
    recordsAnalyzed: byRef.size,
  };
}
