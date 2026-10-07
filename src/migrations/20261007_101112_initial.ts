import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_journey_phase" AS ENUM('mbbs', 'house-job', 'clinical', 'specialization', 'residency', 'career');
  CREATE TYPE "public"."enum_journey_progress" AS ENUM('auto', 'completed', 'current', 'upcoming');
  CREATE TYPE "public"."enum_journey_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journey_v_version_phase" AS ENUM('mbbs', 'house-job', 'clinical', 'specialization', 'residency', 'career');
  CREATE TYPE "public"."enum__journey_v_version_progress" AS ENUM('auto', 'completed', 'current', 'upcoming');
  CREATE TYPE "public"."enum__journey_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_academic_records_type" AS ENUM('exam', 'result', 'milestone', 'course', 'presentation', 'skill', 'other');
  CREATE TYPE "public"."enum_academic_records_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__academic_records_v_version_type" AS ENUM('exam', 'result', 'milestone', 'course', 'presentation', 'skill', 'other');
  CREATE TYPE "public"."enum__academic_records_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_medical_camps_camp_status" AS ENUM('planned', 'held');
  CREATE TYPE "public"."enum_medical_camps_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__medical_camps_v_version_camp_status" AS ENUM('planned', 'held');
  CREATE TYPE "public"."enum__medical_camps_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_community_type" AS ENUM('medical-camp', 'blood-donation', 'health-awareness', 'outreach', 'patient-welfare', 'volunteer');
  CREATE TYPE "public"."enum_community_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__community_v_version_type" AS ENUM('medical-camp', 'blood-donation', 'health-awareness', 'outreach', 'patient-welfare', 'volunteer');
  CREATE TYPE "public"."enum__community_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_achievements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__achievements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_certificates_visibility" AS ENUM('public', 'private');
  CREATE TYPE "public"."enum_certificates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__certificates_v_version_visibility" AS ENUM('public', 'private');
  CREATE TYPE "public"."enum__certificates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_research_type" AS ENUM('project', 'case-report', 'poster', 'presentation', 'publication', 'conference');
  CREATE TYPE "public"."enum_research_research_status" AS ENUM('ongoing', 'completed', 'presented', 'published');
  CREATE TYPE "public"."enum_research_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__research_v_version_type" AS ENUM('project', 'case-report', 'poster', 'presentation', 'publication', 'conference');
  CREATE TYPE "public"."enum__research_v_version_research_status" AS ENUM('ongoing', 'completed', 'presented', 'published');
  CREATE TYPE "public"."enum__research_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_gallery_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__gallery_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_journal_topic" AS ENUM('learning', 'research', 'conference', 'community', 'awareness', 'academic', 'professional');
  CREATE TYPE "public"."enum_journal_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_v_version_topic" AS ENUM('learning', 'research', 'conference', 'community', 'awareness', 'academic', 'professional');
  CREATE TYPE "public"."enum__journal_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_documents_type" AS ENUM('cv', 'certificate', 'research-paper', 'report', 'presentation', 'conference', 'award', 'other');
  CREATE TYPE "public"."enum_documents_visibility" AS ENUM('public', 'private');
  CREATE TYPE "public"."enum_media_visibility" AS ENUM('public', 'private');
  CREATE TYPE "public"."enum_categories_section" AS ENUM('events', 'certificates', 'achievements', 'gallery');
  CREATE TYPE "public"."enum_site_settings_default_theme" AS ENUM('light', 'dark');
  CREATE TABLE "journey_subjects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "journey_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "journey" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"period_label" varchar,
  	"year" numeric,
  	"phase" "enum_journey_phase" DEFAULT 'mbbs',
  	"headline" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"cover_id" integer,
  	"progress" "enum_journey_progress" DEFAULT 'auto',
  	"order" numeric DEFAULT 0,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journey_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_journey_v_version_subjects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journey_v_version_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journey_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_period_label" varchar,
  	"version_year" numeric,
  	"version_phase" "enum__journey_v_version_phase" DEFAULT 'mbbs',
  	"version_headline" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_cover_id" integer,
  	"version_progress" "enum__journey_v_version_progress" DEFAULT 'auto',
  	"version_order" numeric DEFAULT 0,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journey_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "academic_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"type" "enum_academic_records_type" DEFAULT 'milestone',
  	"date" timestamp(3) with time zone,
  	"subject" varchar,
  	"result" varchar,
  	"show_result" boolean DEFAULT false,
  	"description" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_academic_records_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "academic_records_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_academic_records_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_type" "enum__academic_records_v_version_type" DEFAULT 'milestone',
  	"version_date" timestamp(3) with time zone,
  	"version_subject" varchar,
  	"version_result" varchar,
  	"version_show_result" boolean DEFAULT false,
  	"version_description" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__academic_records_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_academic_records_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"location" varchar,
  	"role" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"cover_id" integer,
  	"video_url" varchar,
  	"video_file_id" integer,
  	"category_id" integer,
  	"featured" boolean DEFAULT false,
  	"slug" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"certificates_id" integer
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_role" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_cover_id" integer,
  	"version_video_url" varchar,
  	"version_video_file_id" integer,
  	"version_category_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"certificates_id" integer
  );
  
  CREATE TABLE "medical_camps_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "medical_camps_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "medical_camps_awareness" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar
  );
  
  CREATE TABLE "medical_camps_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "medical_camps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"edition" numeric,
  	"camp_status" "enum_medical_camps_camp_status" DEFAULT 'planned',
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"location" varchar,
  	"organized_by" varchar,
  	"medicines_support" varchar,
  	"summary" varchar,
  	"story" jsonb,
  	"patients_served" numeric,
  	"doctors" numeric,
  	"volunteers" numeric,
  	"numbers_verified" boolean DEFAULT false,
  	"video_url" varchar,
  	"video_file_id" integer,
  	"certificate_id" integer,
  	"report_id" integer,
  	"privacy_media_consent" boolean DEFAULT false,
  	"privacy_public_display_approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_medical_camps_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medical_camps_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_medical_camps_v_version_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_medical_camps_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_medical_camps_v_version_awareness" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"topic" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_medical_camps_v_version_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_medical_camps_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_year" numeric,
  	"version_edition" numeric,
  	"version_camp_status" "enum__medical_camps_v_version_camp_status" DEFAULT 'planned',
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_organized_by" varchar,
  	"version_medicines_support" varchar,
  	"version_summary" varchar,
  	"version_story" jsonb,
  	"version_patients_served" numeric,
  	"version_doctors" numeric,
  	"version_volunteers" numeric,
  	"version_numbers_verified" boolean DEFAULT false,
  	"version_video_url" varchar,
  	"version_video_file_id" integer,
  	"version_certificate_id" integer,
  	"version_report_id" integer,
  	"version_privacy_media_consent" boolean DEFAULT false,
  	"version_privacy_public_display_approved" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__medical_camps_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_medical_camps_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "community_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "community" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"type" "enum_community_type",
  	"date" timestamp(3) with time zone,
  	"location" varchar,
  	"role" varchar,
  	"organizer" varchar,
  	"people_served" numeric,
  	"doctors" numeric,
  	"volunteers" numeric,
  	"numbers_verified" boolean DEFAULT false,
  	"supporters" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"video_url" varchar,
  	"video_file_id" integer,
  	"certificate_id" integer,
  	"report_id" integer,
  	"privacy_media_consent" boolean DEFAULT false,
  	"privacy_public_display_approved" boolean DEFAULT false,
  	"slug" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_community_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "community_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_community_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_community_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_type" "enum__community_v_version_type",
  	"version_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_role" varchar,
  	"version_organizer" varchar,
  	"version_people_served" numeric,
  	"version_doctors" numeric,
  	"version_volunteers" numeric,
  	"version_numbers_verified" boolean DEFAULT false,
  	"version_supporters" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_video_url" varchar,
  	"version_video_file_id" integer,
  	"version_certificate_id" integer,
  	"version_report_id" integer,
  	"version_privacy_media_consent" boolean DEFAULT false,
  	"version_privacy_public_display_approved" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__community_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_community_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "achievements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"awarded_by" varchar,
  	"summary" varchar,
  	"details" jsonb,
  	"image_id" integer,
  	"certificate_id" integer,
  	"event_id" integer,
  	"category_id" integer,
  	"slug" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_achievements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_achievements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_awarded_by" varchar,
  	"version_summary" varchar,
  	"version_details" jsonb,
  	"version_image_id" integer,
  	"version_certificate_id" integer,
  	"version_event_id" integer,
  	"version_category_id" integer,
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__achievements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "certificates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"issuer" varchar,
  	"date" timestamp(3) with time zone,
  	"course" varchar,
  	"description" varchar,
  	"preview_id" integer,
  	"file_id" integer,
  	"event_id" integer,
  	"category_id" integer,
  	"visibility" "enum_certificates_visibility" DEFAULT 'public',
  	"slug" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_certificates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_certificates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_issuer" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_course" varchar,
  	"version_description" varchar,
  	"version_preview_id" integer,
  	"version_file_id" integer,
  	"version_event_id" integer,
  	"version_category_id" integer,
  	"version_visibility" "enum__certificates_v_version_visibility" DEFAULT 'public',
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__certificates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "research" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"type" "enum_research_type" DEFAULT 'project',
  	"research_status" "enum_research_research_status" DEFAULT 'ongoing',
  	"date" timestamp(3) with time zone,
  	"role" varchar,
  	"institution" varchar,
  	"area" varchar,
  	"authors" varchar,
  	"venue" varchar,
  	"doi" varchar,
  	"link" varchar,
  	"summary" varchar,
  	"abstract" jsonb,
  	"pdf_id" integer,
  	"slug" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_research_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_research_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_type" "enum__research_v_version_type" DEFAULT 'project',
  	"version_research_status" "enum__research_v_version_research_status" DEFAULT 'ongoing',
  	"version_date" timestamp(3) with time zone,
  	"version_role" varchar,
  	"version_institution" varchar,
  	"version_area" varchar,
  	"version_authors" varchar,
  	"version_venue" varchar,
  	"version_doi" varchar,
  	"version_link" varchar,
  	"version_summary" varchar,
  	"version_abstract" jsonb,
  	"version_pdf_id" integer,
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__research_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"description" varchar,
  	"category_id" integer,
  	"slug" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_gallery_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "gallery_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_gallery_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_description" varchar,
  	"version_category_id" integer,
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__gallery_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_gallery_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "journal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"topic" "enum_journal_topic",
  	"excerpt" varchar,
  	"cover_id" integer,
  	"content" jsonb,
  	"slug" varchar,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journal_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_journal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_topic" "enum__journal_v_version_topic",
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journal_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_documents_type" NOT NULL,
  	"date" timestamp(3) with time zone,
  	"description" varchar,
  	"file_id" integer NOT NULL,
  	"visibility" "enum_documents_visibility" DEFAULT 'private' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"taken_on" timestamp(3) with time zone,
  	"visibility" "enum_media_visibility" DEFAULT 'public' NOT NULL,
  	"shows_patients" boolean DEFAULT false,
  	"consent_obtained" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"section" "enum_categories_section" NOT NULL,
  	"description" varchar,
  	"academic" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"journey_id" integer,
  	"academic_records_id" integer,
  	"events_id" integer,
  	"medical_camps_id" integer,
  	"community_id" integer,
  	"achievements_id" integer,
  	"certificates_id" integer,
  	"research_id" integer,
  	"gallery_id" integer,
  	"journal_id" integer,
  	"documents_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT '',
  	"name" varchar DEFAULT 'Naima Asjad' NOT NULL,
  	"post_nominals" varchar DEFAULT '',
  	"role" varchar DEFAULT 'MBBS Student',
  	"initials" varchar DEFAULT 'NA',
  	"institution" varchar DEFAULT 'Central Park Medical College',
  	"institution_short" varchar DEFAULT 'CPMC',
  	"city" varchar DEFAULT 'Lahore',
  	"tagline" varchar DEFAULT 'Learning Medicine • Serving Humanity • Inspiring Health',
  	"current_year" numeric DEFAULT 2026 NOT NULL,
  	"email" varchar,
  	"website" varchar DEFAULT 'https://naimaasjad.com',
  	"linkedin" varchar,
  	"footer_note" varchar,
  	"default_theme" "enum_site_settings_default_theme" DEFAULT 'light',
  	"meta_title" varchar DEFAULT 'Naima Asjad | MBBS Student',
  	"meta_description" varchar DEFAULT 'Naima Asjad, MBBS student at Central Park Medical College, Lahore — a record of her medical journey, research, community service and the Annual Free Medical Camp.',
  	"share_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"href" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"statement" varchar DEFAULT 'Learning Medicine with Purpose, Serving Humanity with Compassion.',
  	"portrait_id" integer,
  	"show_timeline" boolean DEFAULT true,
  	"show_impact" boolean DEFAULT true,
  	"show_camp" boolean DEFAULT true,
  	"show_upcoming" boolean DEFAULT true,
  	"show_latest" boolean DEFAULT true,
  	"timeline_title" varchar DEFAULT 'From the first lecture to the first patient',
  	"impact_title" varchar DEFAULT 'The record so far',
  	"camp_title" varchar DEFAULT 'Serving Humanity Through Healthcare',
  	"upcoming_title" varchar DEFAULT 'Coming up',
  	"latest_title" varchar DEFAULT 'Recently added',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"institution" varchar,
  	"period" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "about_page_interests" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_page_research_interests" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"level" varchar
  );
  
  CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"introduction" varchar DEFAULT 'Naima Asjad is an MBBS student at Central Park Medical College, Lahore, pursuing her medical education with a strong commitment to learning, professional development and service to humanity.',
  	"positioning" varchar DEFAULT 'An aspiring physician committed to learning medicine, contributing to healthcare, serving communities, and continuously developing through education, research, and clinical experience.',
  	"portrait_id" integer,
  	"community_vision" varchar,
  	"career_goals" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"journey_eyebrow" varchar DEFAULT 'My MBBS Journey',
  	"journey_title" varchar DEFAULT 'From medical student to doctor',
  	"journey_intro" varchar DEFAULT 'Each year of the journey keeps its own record: what was studied, the events and workshops attended, certificates earned, research begun and the community served.',
  	"academic_eyebrow" varchar DEFAULT 'Academic Portfolio',
  	"academic_title" varchar DEFAULT 'Education, skills and achievements',
  	"academic_intro" varchar DEFAULT 'Subjects, examinations, academic milestones, courses, presentations, workshops, seminars and conferences — from MBBS onwards.',
  	"research_eyebrow" varchar DEFAULT 'Research & Publications',
  	"research_title" varchar DEFAULT 'Research and academic development',
  	"research_intro" varchar DEFAULT 'Research projects, case reports, posters, presentations, publications and conferences.',
  	"community_eyebrow" varchar DEFAULT 'Community Service',
  	"community_title" varchar DEFAULT 'Serving Humanity',
  	"community_intro" varchar DEFAULT 'Free medical camps, blood donation, health awareness, community outreach, patient welfare and volunteer work — each recorded with its date, role and evidence.',
  	"camps_eyebrow" varchar DEFAULT 'Annual Free Medical Camp',
  	"camps_title" varchar DEFAULT 'Naima Asjad Annual Free Medical Camp',
  	"camps_intro" varchar DEFAULT 'One free medical camp every year of the journey, from the 1st camp in 2026. Only verified numbers are published.',
  	"camps_series_title" varchar DEFAULT 'Naima Asjad Annual Free Medical Camp',
  	"events_eyebrow" varchar DEFAULT 'Events & Memories',
  	"events_title" varchar DEFAULT 'Events archive',
  	"events_intro" varchar DEFAULT 'Orientation, academic events, seminars, workshops, competitions, sports, cultural events and conferences — upcoming events first, then the archive year by year.',
  	"achievements_eyebrow" varchar DEFAULT 'Achievements',
  	"achievements_title" varchar DEFAULT 'Achievements',
  	"achievements_intro" varchar DEFAULT 'Awards, positions, distinctions and milestones, year by year.',
  	"certificates_eyebrow" varchar DEFAULT 'Certificates',
  	"certificates_title" varchar DEFAULT 'Certificates',
  	"certificates_intro" varchar DEFAULT 'A digital record of certificates from workshops, seminars, courses and events.',
  	"gallery_eyebrow" varchar DEFAULT 'Gallery',
  	"gallery_title" varchar DEFAULT 'Gallery',
  	"gallery_intro" varchar DEFAULT 'MBBS life, college events, medical camps and community service — every album dated and recorded.',
  	"journal_eyebrow" varchar DEFAULT 'Medical Journal',
  	"journal_title" varchar DEFAULT 'Journal',
  	"journal_intro" varchar DEFAULT 'Reflections on learning medicine, research, conferences and community service.',
  	"journal_disclaimer" varchar DEFAULT 'Posts reflect personal learning and experience. They are not medical advice, diagnosis or treatment — please consult a qualified doctor about your health.',
  	"cv_eyebrow" varchar DEFAULT 'Curriculum Vitae',
  	"cv_title" varchar DEFAULT 'CV',
  	"cv_intro" varchar DEFAULT 'Education, research, certificates, achievements and community service in one place.',
  	"contact_eyebrow" varchar DEFAULT 'Contact',
  	"contact_title" varchar DEFAULT 'Contact Naima Asjad',
  	"contact_intro" varchar DEFAULT 'For academic and professional enquiries.',
  	"contact_note" varchar DEFAULT 'Please use email for enquiries. Personal phone numbers and addresses are not shared on this website.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "journey_subjects" ADD CONSTRAINT "journey_subjects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journey_milestones" ADD CONSTRAINT "journey_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journey" ADD CONSTRAINT "journey_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journey_v_version_subjects" ADD CONSTRAINT "_journey_v_version_subjects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journey_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journey_v_version_milestones" ADD CONSTRAINT "_journey_v_version_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journey_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journey_v" ADD CONSTRAINT "_journey_v_parent_id_journey_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journey"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journey_v" ADD CONSTRAINT "_journey_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "academic_records_rels" ADD CONSTRAINT "academic_records_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."academic_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_records_rels" ADD CONSTRAINT "academic_records_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_academic_records_v" ADD CONSTRAINT "_academic_records_v_parent_id_academic_records_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."academic_records"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_academic_records_v_rels" ADD CONSTRAINT "_academic_records_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_academic_records_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_academic_records_v_rels" ADD CONSTRAINT "_academic_records_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_video_file_id_media_id_fk" FOREIGN KEY ("version_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medical_camps_team" ADD CONSTRAINT "medical_camps_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."medical_camps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medical_camps_services" ADD CONSTRAINT "medical_camps_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."medical_camps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medical_camps_awareness" ADD CONSTRAINT "medical_camps_awareness_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."medical_camps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medical_camps_sponsors" ADD CONSTRAINT "medical_camps_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."medical_camps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medical_camps" ADD CONSTRAINT "medical_camps_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medical_camps" ADD CONSTRAINT "medical_camps_certificate_id_media_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medical_camps" ADD CONSTRAINT "medical_camps_report_id_media_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medical_camps_rels" ADD CONSTRAINT "medical_camps_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."medical_camps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medical_camps_rels" ADD CONSTRAINT "medical_camps_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_medical_camps_v_version_team" ADD CONSTRAINT "_medical_camps_v_version_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_medical_camps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_medical_camps_v_version_services" ADD CONSTRAINT "_medical_camps_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_medical_camps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_medical_camps_v_version_awareness" ADD CONSTRAINT "_medical_camps_v_version_awareness_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_medical_camps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_medical_camps_v_version_sponsors" ADD CONSTRAINT "_medical_camps_v_version_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_medical_camps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_medical_camps_v" ADD CONSTRAINT "_medical_camps_v_parent_id_medical_camps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."medical_camps"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_medical_camps_v" ADD CONSTRAINT "_medical_camps_v_version_video_file_id_media_id_fk" FOREIGN KEY ("version_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_medical_camps_v" ADD CONSTRAINT "_medical_camps_v_version_certificate_id_media_id_fk" FOREIGN KEY ("version_certificate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_medical_camps_v" ADD CONSTRAINT "_medical_camps_v_version_report_id_media_id_fk" FOREIGN KEY ("version_report_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_medical_camps_v_rels" ADD CONSTRAINT "_medical_camps_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_medical_camps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_medical_camps_v_rels" ADD CONSTRAINT "_medical_camps_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_services" ADD CONSTRAINT "community_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community" ADD CONSTRAINT "community_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "community" ADD CONSTRAINT "community_certificate_id_media_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "community" ADD CONSTRAINT "community_report_id_media_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "community_rels" ADD CONSTRAINT "community_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_rels" ADD CONSTRAINT "community_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_v_version_services" ADD CONSTRAINT "_community_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_community_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_v" ADD CONSTRAINT "_community_v_parent_id_community_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."community"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_community_v" ADD CONSTRAINT "_community_v_version_video_file_id_media_id_fk" FOREIGN KEY ("version_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_community_v" ADD CONSTRAINT "_community_v_version_certificate_id_media_id_fk" FOREIGN KEY ("version_certificate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_community_v" ADD CONSTRAINT "_community_v_version_report_id_media_id_fk" FOREIGN KEY ("version_report_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_community_v_rels" ADD CONSTRAINT "_community_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_community_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_v_rels" ADD CONSTRAINT "_community_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "achievements" ADD CONSTRAINT "achievements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "achievements" ADD CONSTRAINT "achievements_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "achievements" ADD CONSTRAINT "achievements_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "achievements" ADD CONSTRAINT "achievements_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_achievements_v" ADD CONSTRAINT "_achievements_v_parent_id_achievements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."achievements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_achievements_v" ADD CONSTRAINT "_achievements_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_achievements_v" ADD CONSTRAINT "_achievements_v_version_certificate_id_certificates_id_fk" FOREIGN KEY ("version_certificate_id") REFERENCES "public"."certificates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_achievements_v" ADD CONSTRAINT "_achievements_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_achievements_v" ADD CONSTRAINT "_achievements_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_preview_id_media_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certificates_v" ADD CONSTRAINT "_certificates_v_parent_id_certificates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."certificates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certificates_v" ADD CONSTRAINT "_certificates_v_version_preview_id_media_id_fk" FOREIGN KEY ("version_preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certificates_v" ADD CONSTRAINT "_certificates_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certificates_v" ADD CONSTRAINT "_certificates_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certificates_v" ADD CONSTRAINT "_certificates_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "research" ADD CONSTRAINT "research_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_research_v" ADD CONSTRAINT "_research_v_parent_id_research_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."research"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_research_v" ADD CONSTRAINT "_research_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_rels" ADD CONSTRAINT "gallery_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_rels" ADD CONSTRAINT "gallery_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_gallery_v" ADD CONSTRAINT "_gallery_v_parent_id_gallery_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_v" ADD CONSTRAINT "_gallery_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_v_rels" ADD CONSTRAINT "_gallery_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_gallery_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_gallery_v_rels" ADD CONSTRAINT "_gallery_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal" ADD CONSTRAINT "journal_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_parent_id_journal_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journey_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academic_records_fk" FOREIGN KEY ("academic_records_id") REFERENCES "public"."academic_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_medical_camps_fk" FOREIGN KEY ("medical_camps_id") REFERENCES "public"."medical_camps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_community_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_achievements_fk" FOREIGN KEY ("achievements_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_research_fk" FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_share_image_id_media_id_fk" FOREIGN KEY ("share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_buttons" ADD CONSTRAINT "home_page_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_highlights" ADD CONSTRAINT "home_page_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_education" ADD CONSTRAINT "about_page_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_interests" ADD CONSTRAINT "about_page_interests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_research_interests" ADD CONSTRAINT "about_page_research_interests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_skills" ADD CONSTRAINT "about_page_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_languages" ADD CONSTRAINT "about_page_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "journey_subjects_order_idx" ON "journey_subjects" USING btree ("_order");
  CREATE INDEX "journey_subjects_parent_id_idx" ON "journey_subjects" USING btree ("_parent_id");
  CREATE INDEX "journey_milestones_order_idx" ON "journey_milestones" USING btree ("_order");
  CREATE INDEX "journey_milestones_parent_id_idx" ON "journey_milestones" USING btree ("_parent_id");
  CREATE INDEX "journey_cover_idx" ON "journey" USING btree ("cover_id");
  CREATE UNIQUE INDEX "journey_slug_idx" ON "journey" USING btree ("slug");
  CREATE INDEX "journey_updated_at_idx" ON "journey" USING btree ("updated_at");
  CREATE INDEX "journey_created_at_idx" ON "journey" USING btree ("created_at");
  CREATE INDEX "journey__status_idx" ON "journey" USING btree ("_status");
  CREATE INDEX "_journey_v_version_subjects_order_idx" ON "_journey_v_version_subjects" USING btree ("_order");
  CREATE INDEX "_journey_v_version_subjects_parent_id_idx" ON "_journey_v_version_subjects" USING btree ("_parent_id");
  CREATE INDEX "_journey_v_version_milestones_order_idx" ON "_journey_v_version_milestones" USING btree ("_order");
  CREATE INDEX "_journey_v_version_milestones_parent_id_idx" ON "_journey_v_version_milestones" USING btree ("_parent_id");
  CREATE INDEX "_journey_v_parent_idx" ON "_journey_v" USING btree ("parent_id");
  CREATE INDEX "_journey_v_version_version_cover_idx" ON "_journey_v" USING btree ("version_cover_id");
  CREATE INDEX "_journey_v_version_version_slug_idx" ON "_journey_v" USING btree ("version_slug");
  CREATE INDEX "_journey_v_version_version_updated_at_idx" ON "_journey_v" USING btree ("version_updated_at");
  CREATE INDEX "_journey_v_version_version_created_at_idx" ON "_journey_v" USING btree ("version_created_at");
  CREATE INDEX "_journey_v_version_version__status_idx" ON "_journey_v" USING btree ("version__status");
  CREATE INDEX "_journey_v_created_at_idx" ON "_journey_v" USING btree ("created_at");
  CREATE INDEX "_journey_v_updated_at_idx" ON "_journey_v" USING btree ("updated_at");
  CREATE INDEX "_journey_v_latest_idx" ON "_journey_v" USING btree ("latest");
  CREATE INDEX "academic_records_year_idx" ON "academic_records" USING btree ("year");
  CREATE INDEX "academic_records_updated_at_idx" ON "academic_records" USING btree ("updated_at");
  CREATE INDEX "academic_records_created_at_idx" ON "academic_records" USING btree ("created_at");
  CREATE INDEX "academic_records__status_idx" ON "academic_records" USING btree ("_status");
  CREATE INDEX "academic_records_rels_order_idx" ON "academic_records_rels" USING btree ("order");
  CREATE INDEX "academic_records_rels_parent_idx" ON "academic_records_rels" USING btree ("parent_id");
  CREATE INDEX "academic_records_rels_path_idx" ON "academic_records_rels" USING btree ("path");
  CREATE INDEX "academic_records_rels_media_id_idx" ON "academic_records_rels" USING btree ("media_id");
  CREATE INDEX "_academic_records_v_parent_idx" ON "_academic_records_v" USING btree ("parent_id");
  CREATE INDEX "_academic_records_v_version_version_year_idx" ON "_academic_records_v" USING btree ("version_year");
  CREATE INDEX "_academic_records_v_version_version_updated_at_idx" ON "_academic_records_v" USING btree ("version_updated_at");
  CREATE INDEX "_academic_records_v_version_version_created_at_idx" ON "_academic_records_v" USING btree ("version_created_at");
  CREATE INDEX "_academic_records_v_version_version__status_idx" ON "_academic_records_v" USING btree ("version__status");
  CREATE INDEX "_academic_records_v_created_at_idx" ON "_academic_records_v" USING btree ("created_at");
  CREATE INDEX "_academic_records_v_updated_at_idx" ON "_academic_records_v" USING btree ("updated_at");
  CREATE INDEX "_academic_records_v_latest_idx" ON "_academic_records_v" USING btree ("latest");
  CREATE INDEX "_academic_records_v_rels_order_idx" ON "_academic_records_v_rels" USING btree ("order");
  CREATE INDEX "_academic_records_v_rels_parent_idx" ON "_academic_records_v_rels" USING btree ("parent_id");
  CREATE INDEX "_academic_records_v_rels_path_idx" ON "_academic_records_v_rels" USING btree ("path");
  CREATE INDEX "_academic_records_v_rels_media_id_idx" ON "_academic_records_v_rels" USING btree ("media_id");
  CREATE INDEX "events_cover_idx" ON "events" USING btree ("cover_id");
  CREATE INDEX "events_video_file_idx" ON "events" USING btree ("video_file_id");
  CREATE INDEX "events_category_idx" ON "events" USING btree ("category_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_year_idx" ON "events" USING btree ("year");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX "events_rels_certificates_id_idx" ON "events_rels" USING btree ("certificates_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_cover_idx" ON "_events_v" USING btree ("version_cover_id");
  CREATE INDEX "_events_v_version_version_video_file_idx" ON "_events_v" USING btree ("version_video_file_id");
  CREATE INDEX "_events_v_version_version_category_idx" ON "_events_v" USING btree ("version_category_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_year_idx" ON "_events_v" USING btree ("version_year");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");
  CREATE INDEX "_events_v_rels_certificates_id_idx" ON "_events_v_rels" USING btree ("certificates_id");
  CREATE INDEX "medical_camps_team_order_idx" ON "medical_camps_team" USING btree ("_order");
  CREATE INDEX "medical_camps_team_parent_id_idx" ON "medical_camps_team" USING btree ("_parent_id");
  CREATE INDEX "medical_camps_services_order_idx" ON "medical_camps_services" USING btree ("_order");
  CREATE INDEX "medical_camps_services_parent_id_idx" ON "medical_camps_services" USING btree ("_parent_id");
  CREATE INDEX "medical_camps_awareness_order_idx" ON "medical_camps_awareness" USING btree ("_order");
  CREATE INDEX "medical_camps_awareness_parent_id_idx" ON "medical_camps_awareness" USING btree ("_parent_id");
  CREATE INDEX "medical_camps_sponsors_order_idx" ON "medical_camps_sponsors" USING btree ("_order");
  CREATE INDEX "medical_camps_sponsors_parent_id_idx" ON "medical_camps_sponsors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "medical_camps_year_idx" ON "medical_camps" USING btree ("year");
  CREATE INDEX "medical_camps_video_file_idx" ON "medical_camps" USING btree ("video_file_id");
  CREATE INDEX "medical_camps_certificate_idx" ON "medical_camps" USING btree ("certificate_id");
  CREATE INDEX "medical_camps_report_idx" ON "medical_camps" USING btree ("report_id");
  CREATE INDEX "medical_camps_updated_at_idx" ON "medical_camps" USING btree ("updated_at");
  CREATE INDEX "medical_camps_created_at_idx" ON "medical_camps" USING btree ("created_at");
  CREATE INDEX "medical_camps__status_idx" ON "medical_camps" USING btree ("_status");
  CREATE INDEX "medical_camps_rels_order_idx" ON "medical_camps_rels" USING btree ("order");
  CREATE INDEX "medical_camps_rels_parent_idx" ON "medical_camps_rels" USING btree ("parent_id");
  CREATE INDEX "medical_camps_rels_path_idx" ON "medical_camps_rels" USING btree ("path");
  CREATE INDEX "medical_camps_rels_media_id_idx" ON "medical_camps_rels" USING btree ("media_id");
  CREATE INDEX "_medical_camps_v_version_team_order_idx" ON "_medical_camps_v_version_team" USING btree ("_order");
  CREATE INDEX "_medical_camps_v_version_team_parent_id_idx" ON "_medical_camps_v_version_team" USING btree ("_parent_id");
  CREATE INDEX "_medical_camps_v_version_services_order_idx" ON "_medical_camps_v_version_services" USING btree ("_order");
  CREATE INDEX "_medical_camps_v_version_services_parent_id_idx" ON "_medical_camps_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_medical_camps_v_version_awareness_order_idx" ON "_medical_camps_v_version_awareness" USING btree ("_order");
  CREATE INDEX "_medical_camps_v_version_awareness_parent_id_idx" ON "_medical_camps_v_version_awareness" USING btree ("_parent_id");
  CREATE INDEX "_medical_camps_v_version_sponsors_order_idx" ON "_medical_camps_v_version_sponsors" USING btree ("_order");
  CREATE INDEX "_medical_camps_v_version_sponsors_parent_id_idx" ON "_medical_camps_v_version_sponsors" USING btree ("_parent_id");
  CREATE INDEX "_medical_camps_v_parent_idx" ON "_medical_camps_v" USING btree ("parent_id");
  CREATE INDEX "_medical_camps_v_version_version_year_idx" ON "_medical_camps_v" USING btree ("version_year");
  CREATE INDEX "_medical_camps_v_version_version_video_file_idx" ON "_medical_camps_v" USING btree ("version_video_file_id");
  CREATE INDEX "_medical_camps_v_version_version_certificate_idx" ON "_medical_camps_v" USING btree ("version_certificate_id");
  CREATE INDEX "_medical_camps_v_version_version_report_idx" ON "_medical_camps_v" USING btree ("version_report_id");
  CREATE INDEX "_medical_camps_v_version_version_updated_at_idx" ON "_medical_camps_v" USING btree ("version_updated_at");
  CREATE INDEX "_medical_camps_v_version_version_created_at_idx" ON "_medical_camps_v" USING btree ("version_created_at");
  CREATE INDEX "_medical_camps_v_version_version__status_idx" ON "_medical_camps_v" USING btree ("version__status");
  CREATE INDEX "_medical_camps_v_created_at_idx" ON "_medical_camps_v" USING btree ("created_at");
  CREATE INDEX "_medical_camps_v_updated_at_idx" ON "_medical_camps_v" USING btree ("updated_at");
  CREATE INDEX "_medical_camps_v_latest_idx" ON "_medical_camps_v" USING btree ("latest");
  CREATE INDEX "_medical_camps_v_rels_order_idx" ON "_medical_camps_v_rels" USING btree ("order");
  CREATE INDEX "_medical_camps_v_rels_parent_idx" ON "_medical_camps_v_rels" USING btree ("parent_id");
  CREATE INDEX "_medical_camps_v_rels_path_idx" ON "_medical_camps_v_rels" USING btree ("path");
  CREATE INDEX "_medical_camps_v_rels_media_id_idx" ON "_medical_camps_v_rels" USING btree ("media_id");
  CREATE INDEX "community_services_order_idx" ON "community_services" USING btree ("_order");
  CREATE INDEX "community_services_parent_id_idx" ON "community_services" USING btree ("_parent_id");
  CREATE INDEX "community_video_file_idx" ON "community" USING btree ("video_file_id");
  CREATE INDEX "community_certificate_idx" ON "community" USING btree ("certificate_id");
  CREATE INDEX "community_report_idx" ON "community" USING btree ("report_id");
  CREATE UNIQUE INDEX "community_slug_idx" ON "community" USING btree ("slug");
  CREATE INDEX "community_year_idx" ON "community" USING btree ("year");
  CREATE INDEX "community_updated_at_idx" ON "community" USING btree ("updated_at");
  CREATE INDEX "community_created_at_idx" ON "community" USING btree ("created_at");
  CREATE INDEX "community__status_idx" ON "community" USING btree ("_status");
  CREATE INDEX "community_rels_order_idx" ON "community_rels" USING btree ("order");
  CREATE INDEX "community_rels_parent_idx" ON "community_rels" USING btree ("parent_id");
  CREATE INDEX "community_rels_path_idx" ON "community_rels" USING btree ("path");
  CREATE INDEX "community_rels_media_id_idx" ON "community_rels" USING btree ("media_id");
  CREATE INDEX "_community_v_version_services_order_idx" ON "_community_v_version_services" USING btree ("_order");
  CREATE INDEX "_community_v_version_services_parent_id_idx" ON "_community_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_community_v_parent_idx" ON "_community_v" USING btree ("parent_id");
  CREATE INDEX "_community_v_version_version_video_file_idx" ON "_community_v" USING btree ("version_video_file_id");
  CREATE INDEX "_community_v_version_version_certificate_idx" ON "_community_v" USING btree ("version_certificate_id");
  CREATE INDEX "_community_v_version_version_report_idx" ON "_community_v" USING btree ("version_report_id");
  CREATE INDEX "_community_v_version_version_slug_idx" ON "_community_v" USING btree ("version_slug");
  CREATE INDEX "_community_v_version_version_year_idx" ON "_community_v" USING btree ("version_year");
  CREATE INDEX "_community_v_version_version_updated_at_idx" ON "_community_v" USING btree ("version_updated_at");
  CREATE INDEX "_community_v_version_version_created_at_idx" ON "_community_v" USING btree ("version_created_at");
  CREATE INDEX "_community_v_version_version__status_idx" ON "_community_v" USING btree ("version__status");
  CREATE INDEX "_community_v_created_at_idx" ON "_community_v" USING btree ("created_at");
  CREATE INDEX "_community_v_updated_at_idx" ON "_community_v" USING btree ("updated_at");
  CREATE INDEX "_community_v_latest_idx" ON "_community_v" USING btree ("latest");
  CREATE INDEX "_community_v_rels_order_idx" ON "_community_v_rels" USING btree ("order");
  CREATE INDEX "_community_v_rels_parent_idx" ON "_community_v_rels" USING btree ("parent_id");
  CREATE INDEX "_community_v_rels_path_idx" ON "_community_v_rels" USING btree ("path");
  CREATE INDEX "_community_v_rels_media_id_idx" ON "_community_v_rels" USING btree ("media_id");
  CREATE INDEX "achievements_image_idx" ON "achievements" USING btree ("image_id");
  CREATE INDEX "achievements_certificate_idx" ON "achievements" USING btree ("certificate_id");
  CREATE INDEX "achievements_event_idx" ON "achievements" USING btree ("event_id");
  CREATE INDEX "achievements_category_idx" ON "achievements" USING btree ("category_id");
  CREATE UNIQUE INDEX "achievements_slug_idx" ON "achievements" USING btree ("slug");
  CREATE INDEX "achievements_year_idx" ON "achievements" USING btree ("year");
  CREATE INDEX "achievements_updated_at_idx" ON "achievements" USING btree ("updated_at");
  CREATE INDEX "achievements_created_at_idx" ON "achievements" USING btree ("created_at");
  CREATE INDEX "achievements__status_idx" ON "achievements" USING btree ("_status");
  CREATE INDEX "_achievements_v_parent_idx" ON "_achievements_v" USING btree ("parent_id");
  CREATE INDEX "_achievements_v_version_version_image_idx" ON "_achievements_v" USING btree ("version_image_id");
  CREATE INDEX "_achievements_v_version_version_certificate_idx" ON "_achievements_v" USING btree ("version_certificate_id");
  CREATE INDEX "_achievements_v_version_version_event_idx" ON "_achievements_v" USING btree ("version_event_id");
  CREATE INDEX "_achievements_v_version_version_category_idx" ON "_achievements_v" USING btree ("version_category_id");
  CREATE INDEX "_achievements_v_version_version_slug_idx" ON "_achievements_v" USING btree ("version_slug");
  CREATE INDEX "_achievements_v_version_version_year_idx" ON "_achievements_v" USING btree ("version_year");
  CREATE INDEX "_achievements_v_version_version_updated_at_idx" ON "_achievements_v" USING btree ("version_updated_at");
  CREATE INDEX "_achievements_v_version_version_created_at_idx" ON "_achievements_v" USING btree ("version_created_at");
  CREATE INDEX "_achievements_v_version_version__status_idx" ON "_achievements_v" USING btree ("version__status");
  CREATE INDEX "_achievements_v_created_at_idx" ON "_achievements_v" USING btree ("created_at");
  CREATE INDEX "_achievements_v_updated_at_idx" ON "_achievements_v" USING btree ("updated_at");
  CREATE INDEX "_achievements_v_latest_idx" ON "_achievements_v" USING btree ("latest");
  CREATE INDEX "certificates_preview_idx" ON "certificates" USING btree ("preview_id");
  CREATE INDEX "certificates_file_idx" ON "certificates" USING btree ("file_id");
  CREATE INDEX "certificates_event_idx" ON "certificates" USING btree ("event_id");
  CREATE INDEX "certificates_category_idx" ON "certificates" USING btree ("category_id");
  CREATE UNIQUE INDEX "certificates_slug_idx" ON "certificates" USING btree ("slug");
  CREATE INDEX "certificates_year_idx" ON "certificates" USING btree ("year");
  CREATE INDEX "certificates_updated_at_idx" ON "certificates" USING btree ("updated_at");
  CREATE INDEX "certificates_created_at_idx" ON "certificates" USING btree ("created_at");
  CREATE INDEX "certificates__status_idx" ON "certificates" USING btree ("_status");
  CREATE INDEX "_certificates_v_parent_idx" ON "_certificates_v" USING btree ("parent_id");
  CREATE INDEX "_certificates_v_version_version_preview_idx" ON "_certificates_v" USING btree ("version_preview_id");
  CREATE INDEX "_certificates_v_version_version_file_idx" ON "_certificates_v" USING btree ("version_file_id");
  CREATE INDEX "_certificates_v_version_version_event_idx" ON "_certificates_v" USING btree ("version_event_id");
  CREATE INDEX "_certificates_v_version_version_category_idx" ON "_certificates_v" USING btree ("version_category_id");
  CREATE INDEX "_certificates_v_version_version_slug_idx" ON "_certificates_v" USING btree ("version_slug");
  CREATE INDEX "_certificates_v_version_version_year_idx" ON "_certificates_v" USING btree ("version_year");
  CREATE INDEX "_certificates_v_version_version_updated_at_idx" ON "_certificates_v" USING btree ("version_updated_at");
  CREATE INDEX "_certificates_v_version_version_created_at_idx" ON "_certificates_v" USING btree ("version_created_at");
  CREATE INDEX "_certificates_v_version_version__status_idx" ON "_certificates_v" USING btree ("version__status");
  CREATE INDEX "_certificates_v_created_at_idx" ON "_certificates_v" USING btree ("created_at");
  CREATE INDEX "_certificates_v_updated_at_idx" ON "_certificates_v" USING btree ("updated_at");
  CREATE INDEX "_certificates_v_latest_idx" ON "_certificates_v" USING btree ("latest");
  CREATE INDEX "research_pdf_idx" ON "research" USING btree ("pdf_id");
  CREATE UNIQUE INDEX "research_slug_idx" ON "research" USING btree ("slug");
  CREATE INDEX "research_year_idx" ON "research" USING btree ("year");
  CREATE INDEX "research_updated_at_idx" ON "research" USING btree ("updated_at");
  CREATE INDEX "research_created_at_idx" ON "research" USING btree ("created_at");
  CREATE INDEX "research__status_idx" ON "research" USING btree ("_status");
  CREATE INDEX "_research_v_parent_idx" ON "_research_v" USING btree ("parent_id");
  CREATE INDEX "_research_v_version_version_pdf_idx" ON "_research_v" USING btree ("version_pdf_id");
  CREATE INDEX "_research_v_version_version_slug_idx" ON "_research_v" USING btree ("version_slug");
  CREATE INDEX "_research_v_version_version_year_idx" ON "_research_v" USING btree ("version_year");
  CREATE INDEX "_research_v_version_version_updated_at_idx" ON "_research_v" USING btree ("version_updated_at");
  CREATE INDEX "_research_v_version_version_created_at_idx" ON "_research_v" USING btree ("version_created_at");
  CREATE INDEX "_research_v_version_version__status_idx" ON "_research_v" USING btree ("version__status");
  CREATE INDEX "_research_v_created_at_idx" ON "_research_v" USING btree ("created_at");
  CREATE INDEX "_research_v_updated_at_idx" ON "_research_v" USING btree ("updated_at");
  CREATE INDEX "_research_v_latest_idx" ON "_research_v" USING btree ("latest");
  CREATE INDEX "gallery_category_idx" ON "gallery" USING btree ("category_id");
  CREATE UNIQUE INDEX "gallery_slug_idx" ON "gallery" USING btree ("slug");
  CREATE INDEX "gallery_year_idx" ON "gallery" USING btree ("year");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  CREATE INDEX "gallery__status_idx" ON "gallery" USING btree ("_status");
  CREATE INDEX "gallery_rels_order_idx" ON "gallery_rels" USING btree ("order");
  CREATE INDEX "gallery_rels_parent_idx" ON "gallery_rels" USING btree ("parent_id");
  CREATE INDEX "gallery_rels_path_idx" ON "gallery_rels" USING btree ("path");
  CREATE INDEX "gallery_rels_media_id_idx" ON "gallery_rels" USING btree ("media_id");
  CREATE INDEX "_gallery_v_parent_idx" ON "_gallery_v" USING btree ("parent_id");
  CREATE INDEX "_gallery_v_version_version_category_idx" ON "_gallery_v" USING btree ("version_category_id");
  CREATE INDEX "_gallery_v_version_version_slug_idx" ON "_gallery_v" USING btree ("version_slug");
  CREATE INDEX "_gallery_v_version_version_year_idx" ON "_gallery_v" USING btree ("version_year");
  CREATE INDEX "_gallery_v_version_version_updated_at_idx" ON "_gallery_v" USING btree ("version_updated_at");
  CREATE INDEX "_gallery_v_version_version_created_at_idx" ON "_gallery_v" USING btree ("version_created_at");
  CREATE INDEX "_gallery_v_version_version__status_idx" ON "_gallery_v" USING btree ("version__status");
  CREATE INDEX "_gallery_v_created_at_idx" ON "_gallery_v" USING btree ("created_at");
  CREATE INDEX "_gallery_v_updated_at_idx" ON "_gallery_v" USING btree ("updated_at");
  CREATE INDEX "_gallery_v_latest_idx" ON "_gallery_v" USING btree ("latest");
  CREATE INDEX "_gallery_v_rels_order_idx" ON "_gallery_v_rels" USING btree ("order");
  CREATE INDEX "_gallery_v_rels_parent_idx" ON "_gallery_v_rels" USING btree ("parent_id");
  CREATE INDEX "_gallery_v_rels_path_idx" ON "_gallery_v_rels" USING btree ("path");
  CREATE INDEX "_gallery_v_rels_media_id_idx" ON "_gallery_v_rels" USING btree ("media_id");
  CREATE INDEX "journal_cover_idx" ON "journal" USING btree ("cover_id");
  CREATE UNIQUE INDEX "journal_slug_idx" ON "journal" USING btree ("slug");
  CREATE INDEX "journal_year_idx" ON "journal" USING btree ("year");
  CREATE INDEX "journal_updated_at_idx" ON "journal" USING btree ("updated_at");
  CREATE INDEX "journal_created_at_idx" ON "journal" USING btree ("created_at");
  CREATE INDEX "journal__status_idx" ON "journal" USING btree ("_status");
  CREATE INDEX "_journal_v_parent_idx" ON "_journal_v" USING btree ("parent_id");
  CREATE INDEX "_journal_v_version_version_cover_idx" ON "_journal_v" USING btree ("version_cover_id");
  CREATE INDEX "_journal_v_version_version_slug_idx" ON "_journal_v" USING btree ("version_slug");
  CREATE INDEX "_journal_v_version_version_year_idx" ON "_journal_v" USING btree ("version_year");
  CREATE INDEX "_journal_v_version_version_updated_at_idx" ON "_journal_v" USING btree ("version_updated_at");
  CREATE INDEX "_journal_v_version_version_created_at_idx" ON "_journal_v" USING btree ("version_created_at");
  CREATE INDEX "_journal_v_version_version__status_idx" ON "_journal_v" USING btree ("version__status");
  CREATE INDEX "_journal_v_created_at_idx" ON "_journal_v" USING btree ("created_at");
  CREATE INDEX "_journal_v_updated_at_idx" ON "_journal_v" USING btree ("updated_at");
  CREATE INDEX "_journal_v_latest_idx" ON "_journal_v" USING btree ("latest");
  CREATE INDEX "documents_file_idx" ON "documents" USING btree ("file_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_journey_id_idx" ON "payload_locked_documents_rels" USING btree ("journey_id");
  CREATE INDEX "payload_locked_documents_rels_academic_records_id_idx" ON "payload_locked_documents_rels" USING btree ("academic_records_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_medical_camps_id_idx" ON "payload_locked_documents_rels" USING btree ("medical_camps_id");
  CREATE INDEX "payload_locked_documents_rels_community_id_idx" ON "payload_locked_documents_rels" USING btree ("community_id");
  CREATE INDEX "payload_locked_documents_rels_achievements_id_idx" ON "payload_locked_documents_rels" USING btree ("achievements_id");
  CREATE INDEX "payload_locked_documents_rels_certificates_id_idx" ON "payload_locked_documents_rels" USING btree ("certificates_id");
  CREATE INDEX "payload_locked_documents_rels_research_id_idx" ON "payload_locked_documents_rels" USING btree ("research_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_journal_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_links_order_idx" ON "site_settings_footer_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_links_parent_id_idx" ON "site_settings_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_share_image_idx" ON "site_settings" USING btree ("share_image_id");
  CREATE INDEX "home_page_buttons_order_idx" ON "home_page_buttons" USING btree ("_order");
  CREATE INDEX "home_page_buttons_parent_id_idx" ON "home_page_buttons" USING btree ("_parent_id");
  CREATE INDEX "home_page_highlights_order_idx" ON "home_page_highlights" USING btree ("_order");
  CREATE INDEX "home_page_highlights_parent_id_idx" ON "home_page_highlights" USING btree ("_parent_id");
  CREATE INDEX "home_page_portrait_idx" ON "home_page" USING btree ("portrait_id");
  CREATE INDEX "about_page_education_order_idx" ON "about_page_education" USING btree ("_order");
  CREATE INDEX "about_page_education_parent_id_idx" ON "about_page_education" USING btree ("_parent_id");
  CREATE INDEX "about_page_interests_order_idx" ON "about_page_interests" USING btree ("_order");
  CREATE INDEX "about_page_interests_parent_id_idx" ON "about_page_interests" USING btree ("_parent_id");
  CREATE INDEX "about_page_research_interests_order_idx" ON "about_page_research_interests" USING btree ("_order");
  CREATE INDEX "about_page_research_interests_parent_id_idx" ON "about_page_research_interests" USING btree ("_parent_id");
  CREATE INDEX "about_page_skills_order_idx" ON "about_page_skills" USING btree ("_order");
  CREATE INDEX "about_page_skills_parent_id_idx" ON "about_page_skills" USING btree ("_parent_id");
  CREATE INDEX "about_page_languages_order_idx" ON "about_page_languages" USING btree ("_order");
  CREATE INDEX "about_page_languages_parent_id_idx" ON "about_page_languages" USING btree ("_parent_id");
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE INDEX "about_page_portrait_idx" ON "about_page" USING btree ("portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "journey_subjects" CASCADE;
  DROP TABLE "journey_milestones" CASCADE;
  DROP TABLE "journey" CASCADE;
  DROP TABLE "_journey_v_version_subjects" CASCADE;
  DROP TABLE "_journey_v_version_milestones" CASCADE;
  DROP TABLE "_journey_v" CASCADE;
  DROP TABLE "academic_records" CASCADE;
  DROP TABLE "academic_records_rels" CASCADE;
  DROP TABLE "_academic_records_v" CASCADE;
  DROP TABLE "_academic_records_v_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "medical_camps_team" CASCADE;
  DROP TABLE "medical_camps_services" CASCADE;
  DROP TABLE "medical_camps_awareness" CASCADE;
  DROP TABLE "medical_camps_sponsors" CASCADE;
  DROP TABLE "medical_camps" CASCADE;
  DROP TABLE "medical_camps_rels" CASCADE;
  DROP TABLE "_medical_camps_v_version_team" CASCADE;
  DROP TABLE "_medical_camps_v_version_services" CASCADE;
  DROP TABLE "_medical_camps_v_version_awareness" CASCADE;
  DROP TABLE "_medical_camps_v_version_sponsors" CASCADE;
  DROP TABLE "_medical_camps_v" CASCADE;
  DROP TABLE "_medical_camps_v_rels" CASCADE;
  DROP TABLE "community_services" CASCADE;
  DROP TABLE "community" CASCADE;
  DROP TABLE "community_rels" CASCADE;
  DROP TABLE "_community_v_version_services" CASCADE;
  DROP TABLE "_community_v" CASCADE;
  DROP TABLE "_community_v_rels" CASCADE;
  DROP TABLE "achievements" CASCADE;
  DROP TABLE "_achievements_v" CASCADE;
  DROP TABLE "certificates" CASCADE;
  DROP TABLE "_certificates_v" CASCADE;
  DROP TABLE "research" CASCADE;
  DROP TABLE "_research_v" CASCADE;
  DROP TABLE "gallery" CASCADE;
  DROP TABLE "gallery_rels" CASCADE;
  DROP TABLE "_gallery_v" CASCADE;
  DROP TABLE "_gallery_v_rels" CASCADE;
  DROP TABLE "journal" CASCADE;
  DROP TABLE "_journal_v" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings_footer_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_page_buttons" CASCADE;
  DROP TABLE "home_page_highlights" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page_education" CASCADE;
  DROP TABLE "about_page_interests" CASCADE;
  DROP TABLE "about_page_research_interests" CASCADE;
  DROP TABLE "about_page_skills" CASCADE;
  DROP TABLE "about_page_languages" CASCADE;
  DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "page_texts" CASCADE;
  DROP TYPE "public"."enum_journey_phase";
  DROP TYPE "public"."enum_journey_progress";
  DROP TYPE "public"."enum_journey_status";
  DROP TYPE "public"."enum__journey_v_version_phase";
  DROP TYPE "public"."enum__journey_v_version_progress";
  DROP TYPE "public"."enum__journey_v_version_status";
  DROP TYPE "public"."enum_academic_records_type";
  DROP TYPE "public"."enum_academic_records_status";
  DROP TYPE "public"."enum__academic_records_v_version_type";
  DROP TYPE "public"."enum__academic_records_v_version_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_medical_camps_camp_status";
  DROP TYPE "public"."enum_medical_camps_status";
  DROP TYPE "public"."enum__medical_camps_v_version_camp_status";
  DROP TYPE "public"."enum__medical_camps_v_version_status";
  DROP TYPE "public"."enum_community_type";
  DROP TYPE "public"."enum_community_status";
  DROP TYPE "public"."enum__community_v_version_type";
  DROP TYPE "public"."enum__community_v_version_status";
  DROP TYPE "public"."enum_achievements_status";
  DROP TYPE "public"."enum__achievements_v_version_status";
  DROP TYPE "public"."enum_certificates_visibility";
  DROP TYPE "public"."enum_certificates_status";
  DROP TYPE "public"."enum__certificates_v_version_visibility";
  DROP TYPE "public"."enum__certificates_v_version_status";
  DROP TYPE "public"."enum_research_type";
  DROP TYPE "public"."enum_research_research_status";
  DROP TYPE "public"."enum_research_status";
  DROP TYPE "public"."enum__research_v_version_type";
  DROP TYPE "public"."enum__research_v_version_research_status";
  DROP TYPE "public"."enum__research_v_version_status";
  DROP TYPE "public"."enum_gallery_status";
  DROP TYPE "public"."enum__gallery_v_version_status";
  DROP TYPE "public"."enum_journal_topic";
  DROP TYPE "public"."enum_journal_status";
  DROP TYPE "public"."enum__journal_v_version_topic";
  DROP TYPE "public"."enum__journal_v_version_status";
  DROP TYPE "public"."enum_documents_type";
  DROP TYPE "public"."enum_documents_visibility";
  DROP TYPE "public"."enum_media_visibility";
  DROP TYPE "public"."enum_categories_section";
  DROP TYPE "public"."enum_site_settings_default_theme";`)
}
