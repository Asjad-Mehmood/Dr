import { profile } from "./profile";

export type JourneyStatus = "completed" | "current" | "upcoming";

export type JourneyYear = {
  year: number;
  stage: string;
  theme: string;
  summary: string;
  subjects: string[];
};

export const journey: JourneyYear[] = [
  {
    year: 2026,
    stage: "1st Year MBBS",
    theme: "Foundations",
    summary:
      "The first chapter: learning how the human body is built, how it works and the chemistry that keeps it alive.",
    subjects: ["Anatomy", "Physiology", "Biochemistry"],
  },
  {
    year: 2027,
    stage: "2nd Year MBBS",
    theme: "Deepening the basics",
    summary:
      "Completing the basic sciences and connecting them to the patient who will one day sit across the table.",
    subjects: ["Anatomy", "Physiology", "Biochemistry", "Behavioural Sciences"],
  },
  {
    year: 2028,
    stage: "3rd Year MBBS",
    theme: "Understanding disease",
    summary:
      "From the healthy body to disease and its treatment, alongside the first steps onto the hospital wards.",
    subjects: ["Pathology", "Pharmacology", "Forensic Medicine"],
  },
  {
    year: 2029,
    stage: "4th Year MBBS",
    theme: "Community & specialities",
    summary:
      "Medicine beyond the hospital walls: public health, prevention and the specialities of the eye, ear, nose and throat.",
    subjects: [
      "Community Medicine",
      "Ophthalmology",
      "ENT",
      "Special Pathology",
    ],
  },
  {
    year: 2030,
    stage: "Final Year / Graduation",
    theme: "Becoming a doctor",
    summary:
      "The major clinical subjects, final examinations and graduation as a doctor.",
    subjects: [
      "Medicine",
      "Surgery",
      "Obstetrics & Gynaecology",
      "Paediatrics",
    ],
  },
];

// The chapters after MBBS. Their timing is an expectation, not a record.
export const futureChapters = [
  {
    title: "House Job",
    when: "After graduation",
    summary:
      "A year of supervised practice across hospital departments — the first year as a working doctor.",
  },
  {
    title: "Specialization",
    when: "Postgraduate training",
    summary:
      "Choosing a field and training in it, with research and teaching alongside.",
  },
  {
    title: "Medical Career",
    when: "The years ahead",
    summary:
      "Clinical practice, medical education and community healthcare, with the Annual Free Medical Camp continuing every year.",
  },
];

export function statusOf(year: number): JourneyStatus {
  if (year < profile.currentYear) return "completed";
  if (year === profile.currentYear) return "current";
  return "upcoming";
}

export function getJourneyYear(year: number) {
  return journey.find((entry) => entry.year === year);
}
