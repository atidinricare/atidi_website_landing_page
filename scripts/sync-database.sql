-- ============================================================================
-- ATIDI NRI CARE - DATABASE SCHEMA & COMPATIBILITY SYNC (ZERO DATA LOSS)
-- FULLY IDEMPOTENT & DEFENSIVE ACROSS DIFFERENT DATABASE SCHEMAS
-- ============================================================================

-- 1. ADD MISSING STATUS COLUMNS (Treatments, Locations, Clinics, FAQs, Testimonials, Categories)
ALTER TABLE IF EXISTS "treatments" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE IF EXISTS "locations" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE IF EXISTS "clinics" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE IF EXISTS "faqs" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE IF EXISTS "testimonials" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
ALTER TABLE IF EXISTS "categories" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';

-- Ensure all existing content is set to published if the tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'treatments') THEN
    UPDATE "treatments" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'locations') THEN
    UPDATE "locations" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clinics') THEN
    UPDATE "clinics" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'faqs') THEN
    UPDATE "faqs" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'testimonials') THEN
    UPDATE "testimonials" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
    UPDATE "categories" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  END IF;
END $$;

-- 2. ADD OPENS_IN_NEW_TAB COLUMNS
ALTER TABLE IF EXISTS "treatments" ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS "locations" ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;

-- Configure default tab behavior for featured treatments if treatments table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'treatments') THEN
    UPDATE "treatments" SET "opens_in_new_tab" = true WHERE "slug" IN ('dental-implants', 'smile-design', 'invisalign-aligners', 'root-canal', 'wisdom-teeth');
    UPDATE "treatments" SET "opens_in_new_tab" = false WHERE "slug" NOT IN ('dental-implants', 'smile-design', 'invisalign-aligners', 'root-canal', 'wisdom-teeth');
  END IF;
END $$;

-- 3. DECOUPLE CLINICS FROM LOCATIONS
ALTER TABLE IF EXISTS "clinics" ADD COLUMN IF NOT EXISTS "city" text;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clinics' AND column_name = 'location_id') THEN
    ALTER TABLE "clinics" ALTER COLUMN "location_id" DROP NOT NULL;
  END IF;
END $$;

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

ALTER TABLE IF EXISTS "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "background" enum_pages_blocks_hero_background DEFAULT 'dark';
ALTER TABLE IF EXISTS "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "background" enum__pages_v_blocks_hero_background DEFAULT 'dark';
ALTER TABLE IF EXISTS "pages_blocks_contact_cards" ADD COLUMN IF NOT EXISTS "theme" enum_pages_blocks_contact_cards_theme DEFAULT 'light';
ALTER TABLE IF EXISTS "_pages_v_blocks_contact_cards" ADD COLUMN IF NOT EXISTS "theme" enum__pages_v_blocks_contact_cards_theme DEFAULT 'light';

-- 6. HOMEPAGE LOCATIONS BLOCK (HEADER & STATS)
ALTER TABLE IF EXISTS "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Our Network';
ALTER TABLE IF EXISTS "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_count" varchar DEFAULT '23';
ALTER TABLE IF EXISTS "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_label" varchar DEFAULT 'South Indian Cities';
ALTER TABLE IF EXISTS "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_count" varchar DEFAULT '10';
ALTER TABLE IF EXISTS "pages_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_label" varchar DEFAULT 'USA States';

ALTER TABLE IF EXISTS "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Our Network';
ALTER TABLE IF EXISTS "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_count" varchar DEFAULT '23';
ALTER TABLE IF EXISTS "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "india_label" varchar DEFAULT 'South Indian Cities';
ALTER TABLE IF EXISTS "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_count" varchar DEFAULT '10';
ALTER TABLE IF EXISTS "_pages_v_blocks_locations_block" ADD COLUMN IF NOT EXISTS "us_label" varchar DEFAULT 'USA States';

-- 7. HOMEPAGE TREATMENTS & CTA EYEBROWS
ALTER TABLE IF EXISTS "pages_blocks_treatments_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Treatments';
ALTER TABLE IF EXISTS "_pages_v_blocks_treatments_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Treatments';
ALTER TABLE IF EXISTS "pages_blocks_cta_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Start Your Journey';
ALTER TABLE IF EXISTS "_pages_v_blocks_cta_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'Start Your Journey';

-- 8. CREATE TESTIMONIALS BLOCK TABLES (FOR PAGES)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
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
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v') THEN
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
  END IF;
END $$;

-- 9. CREATE CTA BLOCK SCREENS TABLES (FOR PHONE APP MOCKUPS)
CREATE TABLE IF NOT EXISTS "pages_blocks_cta_block_screens" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "image_url" varchar,
  "label" varchar DEFAULT '01',
  "caption" varchar
);

CREATE SEQUENCE IF NOT EXISTS "_pages_v_blocks_cta_block_screens_id_seq";
CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_block_screens" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY DEFAULT nextval('_pages_v_blocks_cta_block_screens_id_seq'),
  "image_id" integer,
  "image_url" varchar,
  "label" varchar DEFAULT '01',
  "caption" varchar,
  "_uuid" varchar
);
ALTER SEQUENCE "_pages_v_blocks_cta_block_screens_id_seq" OWNED BY "_pages_v_blocks_cta_block_screens"."id";

-- 10. ENSURE "OUR TEAM" PAGE AND ITS BLOCKS EXIST
DO $$
DECLARE
  v_page_id integer;
  v_hero_id varchar := '6ad993d29f9efd59088b4405';
  v_rich_id varchar := '6ad993d29f9efd59088b4406';
  v_p_id    varchar := '6ad993d29f9efd59088b440a';
  v_c_id    varchar := '6ad993d29f9efd59088b440e';
  v_cta_id  varchar := '6ad993d29f9efd59088b440f';
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'our-team') THEN
      INSERT INTO pages (title, slug, status, _status, created_at, updated_at)
      VALUES ('Our Team', 'our-team', 'published', 'published', now(), now())
      RETURNING id INTO v_page_id;

      -- 1. Hero Block
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_hero') THEN
        INSERT INTO pages_blocks_hero (
          _order, _parent_id, _path, id, eyebrow, headline, subheadline,
          cta_primary_label, cta_primary_link, cta_secondary_label, cta_secondary_link,
          background
        ) VALUES (
          1, v_page_id, 'layout', v_hero_id,
          'Who We Are',
          'The people behind your care.',
          'Every Atidi journey is coordinated by a dedicated care manager and delivered by MDS-qualified specialists at our partner clinics.',
          'Book an Appointment',
          'https://app.atidinricare.com/',
          'Contact Us',
          '/contact-us',
          'dark'
        );
      END IF;

      -- 2. Rich Content Block
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_rich_content') THEN
        INSERT INTO pages_blocks_rich_content (
          _order, _parent_id, _path, id, heading, content, layout, sidebar_label
        ) VALUES (
          2, v_page_id, 'layout', v_rich_id,
          'Care that follows you home.',
          '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"Atidi was built around a simple idea: travelling for treatment should not mean travelling alone. From your first consultation to your follow-up care after you return, the same team stays with you.","mode":"normal","style":"","detail":0,"format":0,"version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"Replace this text in the admin with your own introduction — this page is fully editable under Collections -> Pages -> Our Team.","mode":"normal","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb,
          'withSidebar',
          'Our Approach'
        );
      END IF;

      -- 3. Principles List Block
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_principles_list') THEN
        INSERT INTO pages_blocks_principles_list (
          _order, _parent_id, _path, id, heading
        ) VALUES (
          3, v_page_id, 'layout', v_p_id,
          'How the team is structured'
        );

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_principles_list_items') THEN
          INSERT INTO pages_blocks_principles_list_items (_order, _parent_id, id, title, description)
          VALUES
          (1, v_p_id, '6ad993d29f9efd59088b4407', 'Care Managers',
           '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"A qualified dentist assigned as your single point of contact, coordinating scheduling, treatment and follow-up.","mode":"normal","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb),
          (2, v_p_id, '6ad993d29f9efd59088b4408', 'MDS-Qualified Specialists',
           '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"Every procedure is performed by specialists with advanced qualifications at vetted partner clinics.","mode":"normal","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb),
          (3, v_p_id, '6ad993d29f9efd59088b4409', 'US Follow-Up Network',
           '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"Affiliated clinics across the USA so your care continues seamlessly after you return.","mode":"normal","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb);
        END IF;
      END IF;

      -- 4. Contact Cards Block
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_contact_cards') THEN
        INSERT INTO pages_blocks_contact_cards (
          _order, _parent_id, _path, id, theme
        ) VALUES (
          4, v_page_id, 'layout', v_c_id,
          'light'
        );

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_contact_cards_cards') THEN
          INSERT INTO pages_blocks_contact_cards_cards (_order, _parent_id, id, icon, title, content, link, link_label)
          VALUES
          (1, v_c_id, '6ad993d29f9efd59088b440b', 'Users', 'Team Member Name',
           '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"Role / specialisation. Replace this card in the admin with a real team member.","mode":"normal","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb,
           '/contact-us', 'Get in touch'),
          (2, v_c_id, '6ad993d29f9efd59088b440c', 'Heart', 'Team Member Name',
           '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"Role / specialisation. Duplicate or remove cards as needed.","mode":"normal","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb,
           '/contact-us', 'Get in touch'),
          (3, v_c_id, '6ad993d29f9efd59088b440d', 'Award', 'Team Member Name',
           '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textFormat":0,"children":[{"type":"text","text":"Role / specialisation. Icons are set per card in the admin.","mode":"normal","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb,
           '/contact-us', 'Get in touch');
        END IF;
      END IF;

      -- 5. CTA Block
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_cta_block') THEN
        INSERT INTO pages_blocks_cta_block (
          _order, _parent_id, _path, id, heading, subheading, button_label, button_link, style, eyebrow
        ) VALUES (
          5, v_page_id, 'layout', v_cta_id,
          'Talk to a care manager',
          'Free teleconsultation, available 24/7.',
          'Book an Appointment',
          'https://app.atidinricare.com/',
          'premium',
          'Start Your Journey'
        );
      END IF;
    END IF;
  END IF;
END $$;

-- 11. BACKFILL PAGE VERSION RECORDS (_pages_v)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
    INSERT INTO _pages_v
      (parent_id, version_title, version_slug, version_status, version__status,
       version_updated_at, version_created_at, created_at, updated_at, latest)
    SELECT p.id, p.title, p.slug,
           COALESCE(p.status, 'published')::text::enum__pages_v_version_status,
           'published'::enum__pages_v_version_status,
           p.updated_at, p.created_at, now(), now(), true
    FROM pages p
    WHERE NOT EXISTS (SELECT 1 FROM _pages_v v WHERE v.parent_id = p.id);
  END IF;
END $$;

-- 12. ENSURE "OUR TEAM" LINK IS PRESENT IN CMS FOOTER
DO $$
DECLARE
  v_company_col_id varchar;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'footer_columns')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'footer_columns_links') THEN
    SELECT id INTO v_company_col_id FROM footer_columns WHERE title = 'Company' LIMIT 1;
    IF v_company_col_id IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM footer_columns_links WHERE _parent_id = v_company_col_id AND url = '/our-team') THEN
        INSERT INTO footer_columns_links (_order, _parent_id, id, label, url, new_tab)
        VALUES (
          (SELECT COALESCE(MAX(_order), 0) + 1 FROM footer_columns_links WHERE _parent_id = v_company_col_id),
          v_company_col_id,
          '6ad994839ba93f6cc40b56e3',
          'Our Team',
          '/our-team',
          false
        );
      END IF;
    END IF;
  END IF;
END $$;

-- 13. ENSURE "PROCESS" LINK IS PRESENT IN CMS NAVIGATION
DO $$
DECLARE
  v_nav_id integer;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'navigation_main_nav') THEN
    SELECT id INTO v_nav_id FROM navigation LIMIT 1;
    IF v_nav_id IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM navigation_main_nav WHERE _parent_id = v_nav_id AND (label ILIKE 'Process' OR link ILIKE '%#process%')) THEN
        INSERT INTO navigation_main_nav (_order, _parent_id, id, label, link, type)
        VALUES (
          3,
          v_nav_id,
          '6ad994839ba93f6cc40b56fa',
          'Process',
          '/#process',
          'custom'
        );
      END IF;
    END IF;
  END IF;
END $$;

