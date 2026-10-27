-- Adds the SEO Focus Keywords and Structured Data (JSON-LD) fields.
--
-- Self-contained: no \i, no \echo, no relative paths. Safe to paste into
-- psql inside the database container, or:
--   psql -U <user> -d <db> -f add-seo-fields.sql
--
-- Safe to re-run. Pages and Posts have drafts enabled, so each field also
-- exists on their _v mirror table.

BEGIN;
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_schema" jsonb;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "meta_schema" jsonb;
ALTER TABLE "treatments" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
ALTER TABLE "treatments" ADD COLUMN IF NOT EXISTS "meta_schema" jsonb;
ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "meta_schema" jsonb;
ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_meta_keywords" varchar;
ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_meta_schema" jsonb;
ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_meta_keywords" varchar;
ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_meta_schema" jsonb;
COMMIT;

-- Must return 12 rows.
SELECT table_name, column_name, data_type FROM information_schema.columns
WHERE column_name IN ('meta_keywords','meta_schema','version_meta_keywords','version_meta_schema')
ORDER BY table_name, column_name;
