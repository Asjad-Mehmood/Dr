// Personal details shown across the site. Leave a contact field empty ("")
// to hide it.
export const profile = {
  name: "Dr. Naima Asjad",
  firstName: "Naima",
  initials: "NA",
  disciplines: [
    "MBBS",
    "Medical Education",
    "Community Healthcare",
    "Research & Service",
  ],
  concept: "A Journey from Medical Student to Doctor",
  values: ["Learning", "Serving", "Caring"],
  college: {
    short: "CPMC",
    name: "Central Park Medical College",
    city: "Lahore, Pakistan",
  },
  // Bump this once a year: it decides which year of the journey is "current".
  currentYear: 2026,
  contact: {
    email: "",
    linkedin: "",
    instagram: "",
  },
};

export const siteDescription = `${profile.name} — ${profile.concept}: Learning, Serving & Caring. A year-by-year record of MBBS studies, research, community healthcare and the Annual Free Medical Camp.`;
