import type { Payload } from "payload";

// Starter content for an empty database: the journey stages, the five planned
// camps and the default categories. Runs once, the first time the site starts.
// Nothing here claims an achievement — everything else is added in the admin.

const stages = [
  {
    title: "First Year MBBS",
    periodLabel: "2026",
    year: 2026,
    headline: "MBBS Begins",
    summary:
      "The first chapter: admission, orientation and the foundations of medicine — how the human body is built, how it works and the chemistry that keeps it alive.",
    subjects: ["Anatomy", "Physiology", "Biochemistry"],
    milestones: [
      {
        when: "2026",
        title: "Admission to MBBS at Central Park Medical College, Lahore",
      },
    ],
  },
  {
    title: "Second Year MBBS",
    periodLabel: "2027",
    year: 2027,
    headline: "Academic Growth",
    summary:
      "Completing the basic sciences and connecting them to clinical medicine.",
    subjects: ["Anatomy", "Physiology", "Biochemistry"],
  },
  {
    title: "Third Year MBBS",
    periodLabel: "2028",
    year: 2028,
    headline: "Research & Community Service",
    summary:
      "Understanding disease and its treatment, with research and community service alongside.",
    subjects: ["Pathology", "Pharmacology", "Forensic Medicine"],
  },
  {
    title: "Fourth Year MBBS",
    periodLabel: "2029",
    year: 2029,
    headline: "Clinical Development",
    summary:
      "Public health and the clinical specialities, with growing time on the wards.",
    subjects: [
      "Community Medicine",
      "Ophthalmology",
      "ENT",
      "Special Pathology",
    ],
  },
  {
    title: "Final Year & Graduation",
    periodLabel: "2030",
    year: 2030,
    headline: "MBBS Graduation",
    summary: "The major clinical subjects, final examinations and graduation.",
    subjects: [
      "Medicine",
      "Surgery",
      "Obstetrics & Gynaecology",
      "Paediatrics",
    ],
  },
  {
    title: "House Job",
    periodLabel: "2030–31",
    phase: "house-job",
    headline: "House Job",
    summary: "A year of supervised practice across hospital departments.",
  },
  {
    title: "Specialization & Medical Career",
    periodLabel: "Future",
    phase: "career",
    headline: "Dr. Naima Asjad",
    summary:
      "Specialization, clinical practice, research and community healthcare — with the Annual Free Medical Camp continuing every year.",
  },
];

const categories: Record<string, string[]> = {
  events: [
    "Orientation",
    "Welcome Event",
    "Academic Event",
    "Seminar",
    "Workshop",
    "Conference",
    "Competition",
    "Sports",
    "Cultural Event",
    "Annual Function",
    "Annual Dinner",
    "Student Society",
    "Clinical Event",
  ],
  certificates: [
    "Workshop",
    "Seminar",
    "Conference",
    "Course",
    "Participation",
    "Award",
  ],
  achievements: ["Academic", "Award", "Leadership", "Research", "Community"],
  gallery: [
    "MBBS Life",
    "College Events",
    "Academic Activities",
    "Medical Camps",
    "Community Service",
    "Certificates & Awards",
    "Conferences & Workshops",
  ],
};

const academicEventCategories = ["Seminar", "Workshop", "Conference"];

export async function seedIfEmpty(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: "journey" });
  if (totalDocs > 0) return;

  payload.logger.info("Seeding starter content…");

  for (const [index, stage] of stages.entries()) {
    await payload.create({
      collection: "journey",
      data: {
        ...stage,
        phase: (stage.phase ?? "mbbs") as "mbbs",
        order: index + 1,
        subjects: stage.subjects?.map((name) => ({ name })),
        _status: "published",
      },
    });
  }

  for (let edition = 1; edition <= 5; edition++) {
    await payload.create({
      collection: "medical-camps",
      data: {
        year: 2025 + edition,
        edition,
        campStatus: "planned",
        location: "Lahore",
        _status: "published",
      },
    });
  }

  for (const [section, titles] of Object.entries(categories)) {
    for (const [order, title] of titles.entries()) {
      await payload.create({
        collection: "categories",
        data: {
          title,
          section: section as "events",
          order,
          slug: `${section}-${title}`,
          academic:
            section === "events" && academicEventCategories.includes(title),
        },
      });
    }
  }
}
