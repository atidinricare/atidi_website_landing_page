-- Migration: Add slug field to locations table
-- Run as postgres superuser:
--   sudo -u postgres psql -d atidi-payload-node-dev-dbv1 -f scripts/001-add-location-slugs.sql

-- Step 1: Fix table ownership so atididev can manage schema
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tableowner = 'postgres'
  LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO atididev';
  END LOOP;
  FOR r IN SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' AND sequenceowner = 'postgres'
  LOOP
    EXECUTE 'ALTER SEQUENCE public.' || quote_ident(r.sequencename) || ' OWNER TO atididev';
  END LOOP;
END $$;

-- Step 2: Add slug column
ALTER TABLE locations ADD COLUMN IF NOT EXISTS slug varchar;

-- Step 3: Populate slugs from city names
UPDATE locations SET slug = lower(replace(city, ' ', '-')) WHERE slug IS NULL;

-- Step 4: Add unique index
CREATE UNIQUE INDEX IF NOT EXISTS locations_slug_idx ON locations (slug);

-- Verify
SELECT id, city, slug FROM locations ORDER BY city;
