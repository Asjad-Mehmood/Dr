export type CategoryId =
  | "academics"
  | "research"
  | "societies"
  | "patient-welfare"
  | "community"
  | "events"
  | "awards";

export const categories: {
  id: CategoryId;
  title: string;
  description: string;
}[] = [
  {
    id: "academics",
    title: "Academics",
    description: "Examinations, results, distinctions and academic milestones.",
  },
  {
    id: "research",
    title: "Research",
    description: "Research projects, papers, posters and presentations.",
  },
  {
    id: "societies",
    title: "Student Societies",
    description: "Memberships, leadership roles and society work.",
  },
  {
    id: "patient-welfare",
    title: "Patient Welfare & Blood Donation",
    description:
      "Patient welfare activities, blood donation drives and donor work.",
  },
  {
    id: "community",
    title: "Community Outreach",
    description: "Health awareness sessions, screening drives and outreach.",
  },
  {
    id: "events",
    title: "Academic Events",
    description: "Conferences, workshops, seminars and competitions.",
  },
  {
    id: "awards",
    title: "Awards & Certificates",
    description: "Awards, certificates and courses completed.",
  },
];

export type Entry = {
  title: string;
  category: CategoryId;
  year: number;
  // Free text, e.g. "March 2027".
  date?: string;
  role?: string;
  description?: string;
  link?: string;
};

// Add new achievements to this list. Each one appears on the Portfolio page
// under its category and on the Journey page for its year.
export const entries: Entry[] = [
  {
    title: "Began MBBS at Central Park Medical College",
    category: "academics",
    year: 2026,
    description:
      "The first step of the journey from medical student to doctor.",
  },
];

export function entriesFor(filter: { year?: number; category?: CategoryId }) {
  return entries.filter(
    (entry) =>
      (filter.year === undefined || entry.year === filter.year) &&
      (filter.category === undefined || entry.category === filter.category),
  );
}

export function categoryTitle(id: CategoryId) {
  return categories.find((category) => category.id === id)?.title ?? id;
}
