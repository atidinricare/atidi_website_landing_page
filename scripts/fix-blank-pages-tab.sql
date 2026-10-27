-- Fixes the blank Admin > Pages tab.
--
-- The deployed code queries hero.background and contactCards.theme. If those
-- columns are missing every Pages query fails with
--   column _pages_v__blocks_hero.background does not exist
-- and the admin renders its shell with an empty body.
--
-- Self-contained: no \i, no \echo, no relative paths. Paste it straight into
-- psql, or run:  psql -U atidi -d atidi_prod_landingpage -f fix-blank-pages-tab.sql
--
-- Safe to re-run.

BEGIN;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='enum_pages_blocks_hero_background') THEN
    CREATE TYPE "enum_pages_blocks_hero_background" AS ENUM ('dark','light');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='enum__pages_v_blocks_hero_background') THEN
    CREATE TYPE "enum__pages_v_blocks_hero_background" AS ENUM ('dark','light');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='enum_pages_blocks_contact_cards_theme') THEN
    CREATE TYPE "enum_pages_blocks_contact_cards_theme" AS ENUM ('light','dark');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='enum__pages_v_blocks_contact_cards_theme') THEN
    CREATE TYPE "enum__pages_v_blocks_contact_cards_theme" AS ENUM ('light','dark');
  END IF;
END $$;

ALTER TABLE "pages_blocks_hero"
  ADD COLUMN IF NOT EXISTS "background" "enum_pages_blocks_hero_background" DEFAULT 'dark';

ALTER TABLE "_pages_v_blocks_hero"
  ADD COLUMN IF NOT EXISTS "background" "enum__pages_v_blocks_hero_background" DEFAULT 'dark';

ALTER TABLE "pages_blocks_contact_cards"
  ADD COLUMN IF NOT EXISTS "theme" "enum_pages_blocks_contact_cards_theme" DEFAULT 'light';

ALTER TABLE "_pages_v_blocks_contact_cards"
  ADD COLUMN IF NOT EXISTS "theme" "enum__pages_v_blocks_contact_cards_theme" DEFAULT 'light';

COMMIT;

-- Must return 4 rows. Anything less means it did not apply.
SELECT table_name, column_name, column_default
FROM information_schema.columns
WHERE (table_name IN ('pages_blocks_hero','_pages_v_blocks_hero') AND column_name='background')
   OR (table_name IN ('pages_blocks_contact_cards','_pages_v_blocks_contact_cards') AND column_name='theme')
ORDER BY table_name;
