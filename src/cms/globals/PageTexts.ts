import type { Field, GlobalConfig } from "payload";
import { loggedIn } from "../access";

type Defaults = { eyebrow: string; title: string; intro: string };

export const pageTextDefaults = {
  journey: {
    eyebrow: "My MBBS Journey",
    title: "From medical student to doctor",
    intro:
      "Each year of the journey keeps its own record: what was studied, the events and workshops attended, certificates earned, research begun and the community served.",
  },
  academic: {
    eyebrow: "Academic Portfolio",
    title: "Education, skills and achievements",
    intro:
      "Subjects, examinations, academic milestones, courses, presentations, workshops, seminars and conferences — from MBBS onwards.",
  },
  research: {
    eyebrow: "Research & Publications",
    title: "Research and academic development",
    intro:
      "Research projects, case reports, posters, presentations, publications and conferences.",
  },
  community: {
    eyebrow: "Community Service",
    title: "Serving Humanity",
    intro:
      "Free medical camps, blood donation, health awareness, community outreach, patient welfare and volunteer work — each recorded with its date, role and evidence.",
  },
  camps: {
    eyebrow: "Annual Free Medical Camp",
    title: "Naima Asjad Annual Free Medical Camp",
    intro:
      "One free medical camp every year of the journey, from the 1st camp in 2026. Only verified numbers are published.",
  },
  events: {
    eyebrow: "Events & Memories",
    title: "Events archive",
    intro:
      "Orientation, academic events, seminars, workshops, competitions, sports, cultural events and conferences — upcoming events first, then the archive year by year.",
  },
  achievements: {
    eyebrow: "Achievements",
    title: "Achievements",
    intro: "Awards, positions, distinctions and milestones, year by year.",
  },
  certificates: {
    eyebrow: "Certificates",
    title: "Certificates",
    intro:
      "A digital record of certificates from workshops, seminars, courses and events.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Gallery",
    intro:
      "MBBS life, college events, medical camps and community service — every album dated and recorded.",
  },
  journal: {
    eyebrow: "Medical Journal",
    title: "Journal",
    intro:
      "Reflections on learning medicine, research, conferences and community service.",
  },
  cv: {
    eyebrow: "Curriculum Vitae",
    title: "CV",
    intro:
      "Education, research, certificates, achievements and community service in one place.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact Naima Asjad",
    intro: "For academic and professional enquiries.",
  },
} satisfies Record<string, Defaults>;

export type PageTextKey = keyof typeof pageTextDefaults;

const labels: Record<PageTextKey, string> = {
  journey: "Journey",
  academic: "Academic",
  research: "Research",
  community: "Community",
  camps: "Medical camps",
  events: "Events",
  achievements: "Achievements",
  certificates: "Certificates",
  gallery: "Gallery",
  journal: "Journal",
  cv: "CV",
  contact: "Contact",
};

function textFields(key: PageTextKey): Field[] {
  const d: Defaults = pageTextDefaults[key];
  return [
    {
      name: "eyebrow",
      label: "Small heading",
      type: "text",
      defaultValue: d.eyebrow,
    },
    { name: "title", type: "text", defaultValue: d.title },
    {
      name: "intro",
      label: "Introduction",
      type: "textarea",
      defaultValue: d.intro,
    },
  ];
}

const extras: Partial<Record<PageTextKey, Field[]>> = {
  camps: [
    {
      name: "seriesTitle",
      label: "Camp series title",
      type: "text",
      defaultValue: "Naima Asjad Annual Free Medical Camp",
      admin: {
        description: "Used for each camp that has no title of its own.",
      },
    },
  ],
  journal: [
    {
      name: "disclaimer",
      type: "textarea",
      defaultValue:
        "Posts reflect personal learning and experience. They are not medical advice, diagnosis or treatment — please consult a qualified doctor about your health.",
    },
  ],
  contact: [
    {
      name: "note",
      type: "textarea",
      defaultValue:
        "Please use email for enquiries. Personal phone numbers and addresses are not shared on this website.",
    },
  ],
};

export const PageTexts: GlobalConfig = {
  slug: "page-texts",
  label: "Page texts",
  admin: {
    group: "Pages",
    preview: () => `${process.env.NEXT_PUBLIC_SERVER_URL ?? ""}/`,
    description: "Headings and introductions for each section page.",
  },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      type: "tabs",
      tabs: (Object.keys(labels) as PageTextKey[]).map((key) => ({
        name: key,
        label: labels[key],
        fields: [...textFields(key), ...(extras[key] ?? [])],
      })),
    },
  ],
};
