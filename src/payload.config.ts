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
import { HomePage } from "./cms/globals/HomePage";
import { PageTexts } from "./cms/globals/PageTexts";
import { SiteSettings } from "./cms/globals/SiteSettings";
import { seedIfEmpty } from "./cms/seed";
import { blobToken } from "./lib/setup";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
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
  globals: [SiteSettings, HomePage, AboutPage, PageTexts],
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
      collections: { media: true },
      token: blobToken()?.token,
      clientUploads: true,
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  onInit: seedIfEmpty,
});
