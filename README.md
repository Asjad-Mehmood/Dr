# Dr. Naima Asjad — Portfolio

**A Journey from Medical Student to Doctor — Learning, Serving & Caring.**

A living portfolio that records Naima's medical journey year by year: MBBS
at Central Park Medical College (2026–2030), then the house job,
specialization and the rest of a medical career. It also records the Annual
Free Medical Camp held every year.

Built with Next.js (App Router), TypeScript and Tailwind CSS.

## Pages

| Page | What it shows |
| --- | --- |
| `/` | Introduction, the four threads, the journey timeline, this year's camp, latest additions |
| `/journey` | The full timeline, 2026–2030 and the chapters after graduation |
| `/journey/2026` … `/journey/2030` | One page per year: subjects, achievements and that year's camp |
| `/camps` | Every Annual Free Medical Camp with its details and photos |
| `/portfolio` | All achievements grouped by category |
| `/about` | The idea behind the portfolio |

## Updating the site

All content lives in `src/content/`. You never need to touch the page code
to add something.

### Add an achievement — `src/content/portfolio.ts`

Add an object to the `entries` list:

```ts
{
  title: "Best Poster Award, Annual Research Day",
  category: "research",       // academics, research, societies, patient-welfare,
                              // community, events or awards
  year: 2027,                 // decides which journey year it appears in
  date: "March 2027",         // optional
  role: "Presenter",          // optional
  description: "Poster on …", // optional
  link: "https://…",          // optional
},
```

It appears on the Portfolio page under its category, on that year's
journey page, and on the home page if it is among the latest.

### Record a medical camp — `src/content/camps.ts`

Fill in that year's camp. A camp counts as held once its `date` is set.

```ts
{
  year: 2026,
  edition: 1,
  date: "14 December 2026",
  location: "…",
  patientsServed: 250,
  volunteers: 30,
  services: ["General check-up", "Blood pressure & sugar screening", "Free medicines"],
  partners: ["…"],
  story: "A few lines about the day.",
  photos: [{ src: "/camps/2026/registration.jpg", alt: "Patients at registration" }],
},
```

Put the photos in `public/camps/2026/`.

### Move to the next year — `src/content/profile.ts`

Change `currentYear` (e.g. to `2027`). The site then marks earlier years as
completed and the new year as in progress. Contact details (email,
LinkedIn, Instagram) are also set here; empty ones are hidden.

### After graduation — `src/content/journey.ts`

Year themes, summaries and subjects are edited here. When the house job
starts, add it as a new year in `journey` (e.g. `{ year: 2031, stage: "House
Job", … }`) and a camp for 2031 in `camps.ts`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```
