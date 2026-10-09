import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_highlights_icon" AS ENUM('graduation', 'book', 'community', 'research', 'stethoscope', 'heart', 'award', 'calendar');
  ALTER TABLE "site_settings" ALTER COLUMN "initials" DROP DEFAULT;
  ALTER TABLE "site_settings" ADD COLUMN "role_subtitle" varchar DEFAULT 'Aspiring Physician';
  ALTER TABLE "home_page_highlights" ADD COLUMN "icon" "enum_home_page_highlights_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "initials" SET DEFAULT 'NA';
  ALTER TABLE "site_settings" DROP COLUMN "role_subtitle";
  ALTER TABLE "home_page_highlights" DROP COLUMN "icon";
  DROP TYPE "public"."enum_home_page_highlights_icon";`)
}
