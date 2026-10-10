import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { AcademicRecords } from "./cms/collections/AcademicRecords";
import { Achievements } from "./cms/collections/Achievements";
import { Categories } from "./cms/collections/Categories";
import { Certificates } from "./cms/collections/Certificates";
import { CommunityService } from "./cms/collections/CommunityService";
import { Documents } from "./cms/collections/Documents";
import { Events } from "./cms/collections/Events";
import { GalleryAlbums } from "./cms/collections/GalleryAlbums";
import { Journal } from "./cms/collections/Journal";
import { JourneyStages } from "./cms/collections/JourneyStages";
import { Media } from "./cms/collections/Media";
import { MedicalCamps } from "./cms/collections/MedicalCamps";
import { Research } from "./cms/collections/Research";
import { Users } from "./cms/collections/Users";
import { AboutPage } from "./cms/globals/AboutPage";
import { AiHighlights } from "./cms/globals/AiHighlights";
import { HomePage } from "./cms/globals/HomePage";
import { PageTexts } from "./cms/globals/PageTexts";
import { SiteSettings } from "./cms/globals/SiteSettings";
import { seedIfEmpty } from "./cms/seed";
import { analyzeHighlightsEndpoint } from "./lib/ai/endpoint";
import { blobToken } from "./lib/setup";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "";

// Signed-in requests are only accepted from trusted origins. With no site
// address set, Payload accepts same-site requests; once one is set (e.g. a
// custom domain), keep the Vercel addresses working too.
const vercelOrigins = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
]
  .filter(Boolean)
  .map((host) => `https://${host}`);

export default buildConfig({
  serverURL,
  csrf: serverURL ? [serverURL, ...vercelOrigins] : [],
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Naima Asjad admin",
      icons: [{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }],
    },
    dateFormat: "d MMM yyyy",
    components: {
      graphics: {
        Logo: "/components/admin/Brand#Logo",
        Icon: "/components/admin/Brand#Icon",
      },
      beforeLogin: ["/components/admin/Brand#LoginWelcome"],
      beforeDashboard: ["/components/admin/Dashboard#Dashboard"],
      afterNavLinks: ["/components/admin/NavLinks#NavLinks"],
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [
    JourneyStages,
    AcademicRecords,
    Events,
    MedicalCamps,
    CommunityService,
    Achievements,
    Certificates,
    Research,
    GalleryAlbums,
    Journal,
    Documents,
    Media,
    Categories,
    Users,
  ],
  globals: [SiteSettings, HomePage, AboutPage, PageTexts, AiHighlights],
  endpoints: [analyzeHighlightsEndpoint],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
    },
    // Development syncs the schema automatically; production applies the
    // committed migrations on start-up.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken()),
      // Keep the plugin's fields in the schema even without a token, so the
      // database matches whether or not Blob storage is connected.
      alwaysInsertFields: true,
      collections: { media: true },
      token: blobToken()?.token,
      clientUploads: true,
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  onInit: seedIfEmpty,
});
