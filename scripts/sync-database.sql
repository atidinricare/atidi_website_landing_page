-- ============================================================================
-- ATIDI NRI CARE - DATABASE SCHEMA & COMPATIBILITY SYNC (ZERO DATA LOSS)
-- ============================================================================

-- 1. ADD MISSING STATUS COLUMNS (Treatments, Locations, Clinics, FAQs, Testimonials)
ALTER TABLE "treatments" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE "clinics" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE "faqs" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';

-- Ensure all existing content is set to published so it appears on the live site
UPDATE "treatments" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
UPDATE "locations" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
UPDATE "clinics" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
UPDATE "faqs" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
UPDATE "testimonials" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
UPDATE "categories" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';

-- 2. ADD OPENS_IN_NEW_TAB COLUMNS
ALTER TABLE "treatments" ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;
ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;

-- Configure default tab behavior for 5 featured treatments
UPDATE "treatments" SET "opens_in_new_tab" = true WHERE "slug" IN ('dental-implants', 'smile-design', 'invisalign-aligners', 'root-canal', 'wisdom-teeth');
UPDATE "treatments" SET "opens_in_new_tab" = false WHERE "slug" NOT IN ('dental-implants', 'smile-design', 'invisalign-aligners', 'root-canal', 'wisdom-teeth');

-- 3. DECOUPLE CLINICS FROM LOCATIONS
ALTER TABLE "clinics" ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE "clinics" ALTER COLUMN "location_id" DROP NOT NULL;

-- 4. ADD AWS REGION VALUES TO ENUMS
DO $$
DECLARE
  reg text;
  regs text[] := ARRAY[
    'us-east-1','us-east-2','us-west-1','us-west-2','af-south-1',
    'ap-east-1','ap-south-1','ap-south-2','ap-southeast-1','ap-southeast-2',
    'ap-southeast-3','ap-southeast-4','ap-northeast-1','ap-northeast-2',
    'ap-northeast-3','ca-central-1','ca-west-1','eu-central-1','eu-central-2',
    'eu-west-1','eu-west-2','eu-west-3','eu-south-1','eu-south-2',
    'eu-north-1','il-central-1','me-south-1','me-central-1','sa-east-1'
  ];
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_settings_storage_settings_s3_region') THEN
    FOREACH reg IN ARRAY regs LOOP
      BEGIN
        EXECUTE format('ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS %L', reg);
      EXCEPTION WHEN OTHERS THEN NULL;
      END;
    END LOOP;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_settings_cdn_settings_cloudfront_region') THEN
    FOREACH reg IN ARRAY regs LOOP
      BEGIN
        EXECUTE format('ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS %L', reg);
      EXCEPTION WHEN OTHERS THEN NULL;
      END;
    END LOOP;
  END IF;
END $$;

-- 5. BLOCK APPEARANCE THEME ENUMS & COLUMNS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_hero_background') THEN
    CREATE TYPE "enum_pages_blocks_hero_background" AS ENUM ('dark', 'light');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__pages_v_blocks_hero_background') THEN
    CREATE TYPE "enum__pages_v_blocks_hero_background" AS ENUM ('dark', 'light');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_contact_cards_theme') THEN
    CREATE TYPE "enum_pages_blocks_contact_cards_theme" AS ENUM ('light', 'dark');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__pages_v_blocks_contact_cards_theme') THEN
    CREATE TYPE "enum__pages_v_blocks_contact_cards_theme" AS ENUM ('light', 'dark');
  END IF;
END $$;

ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "background" enum_pages_blocks_hero_background DEFAULT 'dark';
ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "background" enum__pages_v_blocks_hero_background DEFAULT 'dark';
ALTER TABLE "pages_blocks_contact_cards" ADD COLUMN IF NOT EXISTS "theme" enum_pages_blocks_contact_cards_theme DEFAULT 'light';
ALTER TABLE "_pages_v_blocks_contact_cards" ADD COLUMN IF NOT EXISTS "theme" enum__pages_v_blocks_contact_cards_theme DEFAULT 'light';

-- 6. HOMEPAGE LOCATIONS BLOCK (HEADER & STATS)
ALTER TABLE "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Our Network';
ALTER TABLE "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_count" varchar DEFAULT '23';
ALTER TABLE "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_label" varchar DEFAULT 'South Indian Cities';
ALTER TABLE "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_count" varchar DEFAULT '10';
ALTER TABLE "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_label" varchar DEFAULT 'USA States';

ALTER TABLE "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Our Network';
ALTER TABLE "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_count" varchar DEFAULT '23';
ALTER TABLE "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_label" varchar DEFAULT 'South Indian Cities';
ALTER TABLE "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_count" varchar DEFAULT '10';
ALTER TABLE "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_label" varchar DEFAULT 'USA States';

-- 7. HOMEPAGE TREATMENTS & CTA EYEBROWS
ALTER TABLE "pages_blocks_treatments_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Treatments';
ALTER TABLE "_pages_v_blocks_treatments_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Treatments';
ALTER TABLE "pages_blocks_cta_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Start Your Journey';
ALTER TABLE "_pages_v_blocks_cta_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Start Your Journey';

-- 8. CREATE TESTIMONIALS BLOCK TABLES (FOR PAGES)
CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_block" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar DEFAULT 'Testimonials',
  "heading" varchar DEFAULT 'Their words,\ntheir journey.',
  "subheading" varchar DEFAULT 'Patients who travelled for treatment, in their own words',
  "show_featured_only" boolean DEFAULT false,
  "block_name" varchar
);

CREATE SEQUENCE IF NOT EXISTS "_pages_v_blocks_testimonials_block_id_seq";
CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_block" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "_pages_v"("id") ON DELETE CASCADE,
  "_path" text NOT NULL,
  "id" integer PRIMARY KEY DEFAULT nextval('_pages_v_blocks_testimonials_block_id_seq'),
  "eyebrow" varchar DEFAULT 'Testimonials',
  "heading" varchar DEFAULT 'Their words,\ntheir journey.',
  "subheading" varchar DEFAULT 'Patients who travelled for treatment, in their own words',
  "show_featured_only" boolean DEFAULT false,
  "_uuid" varchar,
  "block_name" varchar
);
ALTER SEQUENCE "_pages_v_blocks_testimonials_block_id_seq" OWNED BY "_pages_v_blocks_testimonials_block"."id";

-- 9. CREATE CTA BLOCK SCREENS TABLES (FOR PHONE APP MOCKUPS)
CREATE TABLE IF NOT EXISTS "pages_blocks_cta_block_screens" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
  "image_url" varchar,
  "label" varchar DEFAULT '01',
  "caption" varchar
);

CREATE SEQUENCE IF NOT EXISTS "_pages_v_blocks_cta_block_screens_id_seq";
CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_block_screens" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY DEFAULT nextval('_pages_v_blocks_cta_block_screens_id_seq'),
  "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
  "image_url" varchar,
  "label" varchar DEFAULT '01',
  "caption" varchar,
  "_uuid" varchar
);
ALTER SEQUENCE "_pages_v_blocks_cta_block_screens_id_seq" OWNED BY "_pages_v_blocks_cta_block_screens"."id";

-- 10. BACKFILL PAGE VERSION RECORDS (_pages_v)
INSERT INTO _pages_v
  (parent_id, version_title, version_slug, version_status, version__status,
   version_updated_at, version_created_at, created_at, updated_at, latest)
SELECT p.id, p.title, p.slug,
       COALESCE(p.status, 'published')::text::enum__pages_v_version_status,
       'published'::enum__pages_v_version_status,
       p.updated_at, p.created_at, now(), now(), true
FROM pages p
WHERE NOT EXISTS (SELECT 1 FROM _pages_v v WHERE v.parent_id = p.id);

