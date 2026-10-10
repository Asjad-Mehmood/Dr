// Built-in ranking used when xAI is unavailable: scores each published
// record from its own facts and writes tags and reasons from those facts only.

export type Candidate = {
  ref: string;
  collection: string;
  doc: Record<string, unknown> & { id: number };
  title: string;
};

export type RankedPick = { ref: string; label: string; reason: string };

export type Ranking = {
  intro: string;
  strongestSection: { key: string; label: string; reason: string } | null;
  picks: RankedPick[];
};

const baseScore: Record<string, number> = {
  "medical-camps": 45,
  achievements: 40,
  research: 35,
  community: 30,
  "academic-records": 25,
  certificates: 20,
  events: 15,
  journal: 10,
  gallery: 8,
};

const sectionOf: Record<string, string> = {
  "medical-camps": "camps",
  achievements: "achievements",
  research: "research",
  community: "community",
  "academic-records": "academic",
  certificates: "certificates",
  events: "events",
  journal: "journal",
  gallery: "gallery",
};

const sectionWording: Record<
  string,
  { label: string; noun: string; nouns: string }
> = {
  camps: {
    label: "Annual medical camps",
    noun: "medical camp",
    nouns: "medical camps",
  },
  achievements: {
    label: "Achievements & awards",
    noun: "achievement",
    nouns: "achievements",
  },
  research: {
    label: "Research",
    noun: "research item",
    nouns: "research items",
  },
  community: {
    label: "Community impact",
    noun: "community activity",
    nouns: "community activities",
  },
  academic: {
    label: "Academic record",
    noun: "academic record",
    nouns: "academic records",
  },
  certificates: {
    label: "Continuous learning",
    noun: "certificate",
    nouns: "certificates",
  },
  events: { label: "Active learning", noun: "event", nouns: "events" },
  journal: {
    label: "Reflections",
    noun: "journal post",
    nouns: "journal posts",
  },
  gallery: { label: "Moments", noun: "album", nouns: "albums" },
};

const communityLabels: Record<string, string> = {
  "medical-camp": "Medical camp",
  "blood-donation": "Blood donation",
  "health-awareness": "Health awareness",
  outreach: "Outreach",
  "patient-welfare": "Patient welfare",
  volunteer: "Volunteering",
};

const STRONG_WORDS =
  /\b(organi[sz]er|organi[sz]ed|lead|leader|led|president|head|coordinator|founder|captain|chair|speaker|presenter|presented|first|winner|won|award|awarded|position|gold|distinction|published|best)\b/gi;

const str = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "";
const num = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;

function categoryTitle(doc: Candidate["doc"]) {
  return doc.category && typeof doc.category === "object"
    ? str((doc.category as { title?: unknown }).title)
    : "";
}

function served(doc: Candidate["doc"]) {
  if (!doc.numbersVerified) return 0;
  return num(doc.patientsServed) || num(doc.peopleServed);
}

function firstSentence(text: string, maxWords = 25) {
  const sentence = text.split(/(?<=[.!?])\s/)[0] ?? text;
  const words = sentence.split(/\s+/);
  return words.length > maxWords
    ? `${words.slice(0, maxWords).join(" ")}…`
    : sentence;
}

function score(c: Candidate, now: number) {
  const { doc } = c;
  let total = baseScore[c.collection] ?? 10;

  const people = served(doc);
  if (people) total += Math.min(30, Math.log10(people + 1) * 12);
  if (doc.numbersVerified) {
    total += Math.min(8, num(doc.volunteers) / 5 + num(doc.doctors));
  }

  const words = `${str(doc.role)} ${c.title} ${str(doc.awardedBy)}`.match(
    STRONG_WORDS,
  );
  total += Math.min(24, (words?.length ?? 0) * 12);

  if (doc.researchStatus === "published") total += 15;
  else if (doc.researchStatus === "presented") total += 8;
  if (doc.showResult && str(doc.result)) total += 10;

  if (Array.isArray(doc.photos) && doc.photos.length) total += 5;
  if (str(doc.summary) || str(doc.excerpt)) total += 4;

  const date = str(doc.date);
  if (date) {
    const ageDays = (now - new Date(date).getTime()) / 86_400_000;
    // Upcoming events haven't happened yet, so they don't count as strengths.
    if (ageDays < 0 && c.collection === "events") total -= 20;
    else total += Math.max(0, 10 - ageDays / 73); // fades over ~2 years
  }
  return total;
}

function label(c: Candidate) {
  const { doc } = c;
  switch (c.collection) {
    case "medical-camps":
      return "Community impact";
    case "community":
      return communityLabels[str(doc.type)] ?? "Community";
    case "research":
      return "Research";
    case "achievements":
      return categoryTitle(doc) || "Achievement";
    case "certificates":
      return "Certification";
    case "events":
      return categoryTitle(doc) || "Event";
    case "academic-records":
      return "Academics";
    case "journal":
      return "Reflection";
    default:
      return "Gallery";
  }
}

function reason(c: Candidate) {
  const { doc } = c;
  const role = str(doc.role);
  const location = str(doc.location);
  const people = served(doc);
  const volunteers = doc.numbersVerified ? num(doc.volunteers) : 0;

  switch (c.collection) {
    case "medical-camps": {
      const parts = [`Free medical camp${location ? ` in ${location}` : ""}`];
      if (people)
        parts.push(`serving ${people.toLocaleString("en-US")} patients`);
      if (volunteers) parts.push(`with ${volunteers} volunteers`);
      return `${parts.join(" ")}.`;
    }
    case "community":
      if (people && role) {
        return `Served ${people.toLocaleString("en-US")} people as ${role.toLowerCase()}.`;
      }
      if (people) return `Reached ${people.toLocaleString("en-US")} people.`;
      break;
    case "research": {
      const status = str(doc.researchStatus);
      const venue = str(doc.venue);
      if (status || venue) {
        const what = status
          ? `${status[0].toUpperCase()}${status.slice(1)} research`
          : "Research";
        return `${what}${venue ? ` — ${venue}` : ""}${role ? `, as ${role.toLowerCase()}` : ""}.`;
      }
      break;
    }
    case "achievements":
      if (str(doc.awardedBy)) return `Awarded by ${str(doc.awardedBy)}.`;
      break;
    case "certificates":
      if (str(doc.issuer)) return `Certified by ${str(doc.issuer)}.`;
      break;
    case "academic-records":
      if (doc.showResult && str(doc.result)) {
        return `${str(doc.subject) || "Result"}: ${str(doc.result)}.`;
      }
      break;
    case "events":
      if (role) {
        const kind = categoryTitle(doc).toLowerCase() || "event";
        return `${role} at this ${kind}${location ? ` in ${location}` : ""}.`;
      }
      break;
  }
  const text = str(doc.summary) || str(doc.excerpt) || str(doc.description);
  return text
    ? firstSentence(text)
    : `A highlight from ${str(doc.date).slice(0, 4) || "the journey"}.`;
}

export function rankLocally(
  candidates: Candidate[],
  maxItems: number,
): Ranking {
  const now = Date.now();
  const scored = candidates
    .map((c) => ({ c, score: score(c, now) }))
    .sort((a, b) => b.score - a.score);

  // Highest scores first, but at most two from one collection until the
  // list runs out, so the highlights show different kinds of work.
  const chosen: typeof scored = [];
  const perCollection = new Map<string, number>();
  for (const item of scored) {
    if (chosen.length >= maxItems) break;
    const used = perCollection.get(item.c.collection) ?? 0;
    if (used >= 2) continue;
    chosen.push(item);
    perCollection.set(item.c.collection, used + 1);
  }
  for (const item of scored) {
    if (chosen.length >= maxItems) break;
    if (!chosen.includes(item)) chosen.push(item);
  }

  // Strongest section: the best three scores in each section, added up.
  const bySection = new Map<
    string,
    { scores: number[]; count: number; people: number }
  >();
  for (const { c, score: s } of scored) {
    const key = sectionOf[c.collection];
    if (!key) continue;
    const entry = bySection.get(key) ?? { scores: [], count: 0, people: 0 };
    entry.scores.push(s);
    entry.count += 1;
    entry.people += served(c.doc);
    bySection.set(key, entry);
  }
  let strongest: Ranking["strongestSection"] = null;
  let best = -Infinity;
  for (const [key, entry] of bySection) {
    const total = entry.scores.slice(0, 3).reduce((a, b) => a + b, 0);
    if (total <= best) continue;
    best = total;
    const wording = sectionWording[key];
    const count = `${entry.count} ${entry.count === 1 ? wording.noun : wording.nouns} so far`;
    strongest = {
      key,
      label: wording.label,
      reason: entry.people
        ? `${count}, serving ${entry.people.toLocaleString("en-US")} people.`
        : `${count}.`,
    };
  }

  return {
    intro: "A few of the strongest moments from the journey so far.",
    strongestSection: strongest,
    picks: chosen.map(({ c }) => ({
      ref: c.ref,
      label: label(c),
      reason: reason(c),
    })),
  };
}
