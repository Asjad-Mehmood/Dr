export type Camp = {
  year: number;
  edition: number;
  // Fill these in after each camp. Anything left undefined or empty shows as
  // "to be recorded".
  date?: string;
  location?: string;
  patientsServed?: number;
  volunteers?: number;
  services: string[];
  partners: string[];
  story?: string;
  // Put images in public/camps/<year>/ and list them here, e.g.
  // { src: "/camps/2026/registration.jpg", alt: "Patients at registration" }
  photos: { src: string; alt: string }[];
};

export const camps: Camp[] = [
  { year: 2026, edition: 1, services: [], partners: [], photos: [] },
  { year: 2027, edition: 2, services: [], partners: [], photos: [] },
  { year: 2028, edition: 3, services: [], partners: [], photos: [] },
  { year: 2029, edition: 4, services: [], partners: [], photos: [] },
  { year: 2030, edition: 5, services: [], partners: [], photos: [] },
];

// A camp counts as held once its date has been recorded.
export function isHeld(camp: Camp) {
  return Boolean(camp.date);
}

export function getCamp(year: number) {
  return camps.find((camp) => camp.year === year);
}

export function campTotals() {
  const held = camps.filter(isHeld);
  return {
    held: held.length,
    patientsServed: held.reduce((sum, c) => sum + (c.patientsServed ?? 0), 0),
    volunteers: held.reduce((sum, c) => sum + (c.volunteers ?? 0), 0),
  };
}

export function ordinal(n: number) {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]);
}
