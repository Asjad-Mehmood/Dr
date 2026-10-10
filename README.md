# Naima Asjad — Medical Career Portfolio

**Learning Medicine • Serving Humanity • Inspiring Health**

A long-term portfolio that starts with MBBS at Central Park Medical College,
Lahore (2026–2030) and grows through graduation, house job, specialization and
a medical career. Everything on the site is managed from an admin dashboard —
no code changes are needed to add records, change texts or update the
navigation.

Built with Next.js, [Payload CMS](https://payloadcms.com) and PostgreSQL.

## Managing the site

Open **`/admin`** (e.g. `https://naimaasjad.com/admin`). The first visit asks
you to create the admin account.

| Admin section | What it controls | Public page |
| --- | --- | --- |
| **Journey → Medical journey** | Each year of MBBS, then house job, specialization, career: headline, summary, story, subjects, milestones, cover photo | `/journey`, `/journey/2026` … |
| **Journey → Academic records** | Exams, results (shown only if you tick "Show the result publicly"), milestones, courses, presentations | `/academic` |
| **Activities → Events** | Orientation, seminars, workshops, conferences, sports… with date, location, role, photos, video, certificates. Future dates show as *Upcoming*; past events move to the archive automatically | `/events` |
| **Activities → Annual medical camps** | One record per year: date, location, team, services, awareness topics, sponsors, verified numbers, photos, video, report | `/medical-camps`, `/medical-camps/2026` |
| **Activities → Community service** | Blood donation, health awareness, outreach, patient welfare, volunteer work | `/community` |
| **Achievements → Achievements / Certificates / Research & publications** | Awards; certificates with image and original PDF; research projects, case reports, posters, presentations, publications (DOI, link, PDF) | `/achievements`, `/certificates`, `/research` |
| **Media & Writing → Gallery albums / Medical journal / Documents / Media library** | Photo albums, journal posts, CV and other documents, all uploaded files | `/gallery`, `/journal`, `/cv` |
| **Settings → Site settings** | Name, prefix ("Dr.") and post-nominals ("MBBS"), role, college, tagline, current year, contact details, main menu, footer links, default theme, search/SEO text | every page |
| **Settings → Categories** | The categories for events, certificates, achievements and the gallery. Tick *Academic development* on an event category to list its events on the Academic page | — |
| **Pages → Home page / About page / Page texts** | Hero text and buttons, highlights, which home sections show; the About profile (education, interests, skills, languages, values, goals); the heading and introduction of every section page | `/`, `/about`, all pages |

**Every year:** in *Site settings*, change **Current year of the journey**
(2026 → 2027 …). Earlier stages then show as *Completed* and the new one as *In
progress*.

**After graduation:** in *Site settings*, set the prefix to `Dr.`, the
post-nominals to `MBBS`, and update the role. The whole site updates.

### Drafts, privacy and consent

- Every record has **Save draft** and **Publish**. Only published records are
  shown on the website.
- Certificates and documents have a **visibility** setting. Private ones are
  kept in the admin and never shown publicly.
- Medical camps and community activities show photos and videos **only when
  both "Photo / media consent obtained" and "Approved for public display" are
  ticked**.
- In the media library, a file marked **"Shows identifiable patients"** stays
  private until **"Consent obtained"** is ticked.
- Patient counts and other numbers are shown, and counted in the impact
  totals, **only when "Numbers verified" is ticked**.
- Never enter patient names, CNIC numbers, phone numbers or medical records.

The impact numbers on the home page (camps, people served, certificates,
workshops, research, publications…) are calculated from these records.

## AI highlights (xAI Grok)

Grok can read every published, public record and suggest the strongest ones
for a **Highlights** section on the home page.

1. Create an API key at [console.x.ai](https://console.x.ai) (add credits).
2. In Vercel → Settings → Environment Variables add `XAI_API_KEY`, then
   redeploy (`/health` then shows **Highlights key: Set**). Optional: `XAI_MODEL` (default `grok-4.3`) and
   `XAI_REASONING_EFFORT` (`low` by default).
3. In the admin open **Pages → AI highlights** and press **Analyze records
   with AI**.
4. Check and edit the picks, tick **Show on home page**, and save.

Only public information is sent: drafts, private certificates and
documents, private photos and unverified numbers never are. Picks that don't
match a real record are discarded, and every new analysis switches **Show on
home page** off again until it has been reviewed. The public website never
mentions AI: the section simply appears as **Highlights**.

## Running locally

Requires Node.js 20.9+ and PostgreSQL.

```bash
cp .env.example .env      # then fill in DATABASE_URL and PAYLOAD_SECRET
npm install
npm run dev               # http://localhost:3000 and http://localhost:3000/admin
```

On first start with an empty database the site creates the journey stages
(2026 → Future), the five planned camps (2026–2030) and the default
categories. In development the database schema is synced automatically.

## Deploying (Vercel)

1. Import the repository into [Vercel](https://vercel.com).
2. Add a Postgres database (e.g. **Neon** from the Vercel Marketplace) — this
   sets `DATABASE_URL` / `POSTGRES_URL`.
3. Add a **Vercel Blob** store — this sets `BLOB_READ_WRITE_TOKEN`, so uploaded
   photos and PDFs are stored in Blob storage (Vercel's servers can't keep
   uploaded files).
4. Set `PAYLOAD_SECRET` (a long random string, e.g. `openssl rand -hex 32`) and
   `NEXT_PUBLIC_SERVER_URL` (e.g. `https://naimaasjad.com`).
5. Deploy, then open `/admin` to create the admin account.
6. Connect the `naimaasjad.com` domain in the Vercel project settings.

Database migrations in `src/migrations/` run automatically when the production
server starts.

## Changing the content model (developers)

After changing anything in `src/cms/`:

```bash
npm run generate:types          # update src/payload-types.ts
npm run generate:importmap      # update the admin's component map
npm run migrate:create -- <name> # add a migration for production
```

| Path | Contents |
| --- | --- |
| `src/payload.config.ts` | Payload configuration |
| `src/cms/collections/` | Collections (journey, events, camps, …) |
| `src/cms/globals/` | Site settings, home, about and page texts |
| `src/cms/seed.ts` | Starter content for an empty database |
| `src/app/(site)/` | Public website |
| `src/app/(payload)/` | Admin panel and API (generated by Payload) |
| `src/lib/cms.ts` | Data access used by the public pages |
