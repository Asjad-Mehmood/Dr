import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ai_highlights_picks_collection" AS ENUM('events', 'achievements', 'certificates', 'research', 'community', 'medical-camps', 'journal', 'gallery', 'academic-records');
  CREATE TYPE "public"."enum_ai_highlights_strongest_section_key" AS ENUM('journey', 'academic', 'research', 'community', 'camps', 'events', 'achievements', 'certificates', 'gallery', 'journal');
  CREATE TABLE "ai_highlights_picks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"collection" "enum_ai_highlights_picks_collection" NOT NULL,
  	"doc_id" numeric NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"reason" varchar
  );
  
  CREATE TABLE "ai_highlights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_on_home" boolean DEFAULT false,
  	"max_items" numeric DEFAULT 4,
  	"title" varchar DEFAULT 'Highlights',
  	"intro" varchar,
  	"strongest_section_key" "enum_ai_highlights_strongest_section_key",
  	"strongest_section_label" varchar,
  	"strongest_section_reason" varchar,
  	"last_analyzed_at" timestamp(3) with time zone,
  	"model" varchar,
  	"records_analyzed" numeric,
  	"last_error" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "ai_highlights_picks" ADD CONSTRAINT "ai_highlights_picks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ai_highlights"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "ai_highlights_picks_order_idx" ON "ai_highlights_picks" USING btree ("_order");
  CREATE INDEX "ai_highlights_picks_parent_id_idx" ON "ai_highlights_picks" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ai_highlights_picks" CASCADE;
  DROP TABLE "ai_highlights" CASCADE;
  DROP TYPE "public"."enum_ai_highlights_picks_collection";
  DROP TYPE "public"."enum_ai_highlights_strongest_section_key";`)
}
