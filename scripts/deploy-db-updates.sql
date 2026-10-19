-- All database changes required by the current dev branch.
--
--   psql "$DATABASE_URI" -f scripts/deploy-db-updates.sql
--
-- Equivalent to `npm run payload migrate` plus the page-version backfill, for
-- instances where running the Payload CLI is inconvenient. Every statement is
-- idempotent, so re-running is safe.
--
-- Do NOT add --single-transaction: ALTER TYPE ... ADD VALUE cannot run inside a
-- transaction block on PostgreSQL below 12.
--
-- Schema only — this changes no page or testimonial content.
--
-- Afterwards redeploy (or re-save one record in the admin) so cached pages are
-- regenerated, then run scripts/verify-release.sql to confirm.

-- ===========================================================================
-- 1. AWS regions — adds ap-south-2 (Hyderabad) and the rest to both selects
-- ===========================================================================
\echo '--> 1/3 AWS region lists'
\i scripts/add-aws-regions.sql

-- ===========================================================================
-- 2. Block appearance options — hero Background, contact cards Card Style.
--    Drafts are enabled on Pages, so each column exists on the main table and
--    again on the matching _pages_v table.
-- ===========================================================================
\echo '--> 2/3 block appearance columns'

DO $$
DECLARE
  spec record;
BEGIN
  FOR spec IN
    SELECT * FROM (VALUES
      ('pages_blocks_hero',              'background', 'enum_pages_blocks_hero_background',              ARRAY['dark','light'], 'dark'),
      ('_pages_v_blocks_hero',           'background', 'enum__pages_v_blocks_hero_background',           ARRAY['dark','light'], 'dark'),
      ('pages_blocks_contact_cards',     'theme',      'enum_pages_blocks_contact_cards_theme',          ARRAY['light','dark'], 'light'),
      ('_pages_v_blocks_contact_cards',  'theme',      'enum__pages_v_blocks_contact_cards_theme',       ARRAY['light','dark'], 'light')
    ) AS t(tbl, col, typ, vals, def)
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = spec.typ) THEN
      EXECUTE format('CREATE TYPE %I AS ENUM (%s)',
                     spec.typ,
                     (SELECT string_agg(quote_literal(v), ',') FROM unnest(spec.vals) v));
    END IF;

    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I %I DEFAULT %L',
                   spec.tbl, spec.col, spec.typ, spec.def);
  END LOOP;
END $$;

-- ===========================================================================
-- 3. Page version records — a page inserted with raw SQL has no row in
--    _pages_v, so it renders on the site but is invisible in the admin list.
-- ===========================================================================
\echo '--> 3/3 page version records'

INSERT INTO _pages_v
  (parent_id, version_title, version_slug, version_status, version__status,
   version_updated_at, version_created_at, created_at, updated_at, latest)
SELECT p.id, p.title, p.slug,
       p.status::text::enum__pages_v_version_status,
       'published'::enum__pages_v_version_status,
       p.updated_at, p.created_at, now(), now(), true
FROM pages p
WHERE NOT EXISTS (SELECT 1 FROM _pages_v v WHERE v.parent_id = p.id);

\echo '--> done. Now run: psql "$DATABASE_URI" -f scripts/verify-release.sql'
