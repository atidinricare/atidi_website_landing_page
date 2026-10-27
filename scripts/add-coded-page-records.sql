-- Creates the Pages records that back the SEO tab for pages built in code.
--
-- Routes like /our-services and /blog render their own components, but their
-- SEO is read from a Pages record with the matching slug. Without the record
-- there is nothing to edit in the admin.
--
-- These carry no layout blocks -- only the SEO tab is used.
--
-- Self-contained: no \i, no relative paths. Safe to re-run.
--   psql -U <user> -d <db> -f add-coded-page-records.sql
--
-- Creates the _pages_v row too: drafts are enabled on Pages, so a record with
-- no version row renders fine but stays invisible in the admin Pages list.

BEGIN;

INSERT INTO pages (title, slug, status, _status, updated_at, created_at)
SELECT v.title, v.slug, 'published', 'published', now(), now()
FROM (VALUES
  ('Home',             'home'),
  ('About Us',         'about-us'),
  ('Our Clinics',      'clinics'),
  ('Contact Us',       'contact-us'),
  ('Our Services',     'our-services'),
  ('Privacy Policy',   'privacy-policy'),
  ('Terms of Service', 'terms-of-service'),
  ('Blog',             'blog')
) AS v(title, slug)
WHERE NOT EXISTS (SELECT 1 FROM pages p WHERE p.slug = v.slug);

INSERT INTO _pages_v
  (parent_id, version_title, version_slug, version_status, version__status,
   version_updated_at, version_created_at, created_at, updated_at, latest)
SELECT p.id, p.title, p.slug,
       p.status::text::enum__pages_v_version_status,
       'published'::enum__pages_v_version_status,
       p.updated_at, p.created_at, now(), now(), true
FROM pages p
WHERE NOT EXISTS (SELECT 1 FROM _pages_v v WHERE v.parent_id = p.id);

COMMIT;

-- Must list all eight coded-page slugs.
SELECT p.slug, p.status, count(v.id) AS version_rows
FROM pages p LEFT JOIN _pages_v v ON v.parent_id = p.id
WHERE p.slug IN ('home','about-us','clinics','contact-us','our-services','privacy-policy','terms-of-service','blog')
GROUP BY p.slug, p.status ORDER BY p.slug;
