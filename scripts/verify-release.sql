-- Post-deploy verification. Read-only: safe to run on any instance.
--
--   psql "$DATABASE_URI" -f scripts/verify-release.sql
--
-- Every row should read PASS. Anything else names what is missing.

SELECT 'S3 region list' AS check,
       CASE WHEN bool_or(e.enumlabel='ap-south-2') THEN 'PASS' ELSE 'FAIL - run the region migration' END AS status,
       count(*)::text || ' regions' AS detail
FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid
WHERE t.typname='enum_site_settings_storage_settings_s3_region'

UNION ALL
SELECT 'CDN region list',
       CASE WHEN bool_or(e.enumlabel='ap-south-2') THEN 'PASS' ELSE 'FAIL - run the region migration' END,
       count(*)::text || ' regions'
FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid
WHERE t.typname='enum_site_settings_cdn_settings_cloudfront_region'

UNION ALL
SELECT 'Testimonials published',
       CASE WHEN count(*) FILTER (WHERE status='published') > 0 THEN 'PASS'
            ELSE 'FAIL - none published, home page section will be hidden' END,
       count(*) FILTER (WHERE status='published')::text || ' of ' || count(*)::text || ' published'
FROM testimonials

UNION ALL
SELECT 'Pages visible in admin',
       CASE WHEN count(*)=0 THEN 'PASS'
            ELSE 'FAIL - run: npx tsx scripts/rebuild-page-versions.ts' END,
       CASE WHEN count(*)=0 THEN 'every page has a version record'
            ELSE string_agg(slug, ', ') END
FROM (SELECT p.id, p.slug FROM pages p
      LEFT JOIN _pages_v v ON v.parent_id=p.id
      GROUP BY p.id, p.slug HAVING count(v.id)=0) missing

UNION ALL
SELECT 'Hero background option',
       CASE WHEN count(*)=2 THEN 'PASS' ELSE 'FAIL - run: npm run payload migrate' END,
       count(*)::text || ' of 2 columns (main + version table)'
FROM information_schema.columns
WHERE table_name IN ('pages_blocks_hero','_pages_v_blocks_hero') AND column_name='background'

UNION ALL
SELECT 'Contact card style option',
       CASE WHEN count(*)=2 THEN 'PASS' ELSE 'FAIL - run: npm run payload migrate' END,
       count(*)::text || ' of 2 columns (main + version table)'
FROM information_schema.columns
WHERE table_name IN ('pages_blocks_contact_cards','_pages_v_blocks_contact_cards') AND column_name='theme'

UNION ALL
SELECT 'Published CMS pages',
       'INFO',
       coalesce(string_agg(slug, ', ' ORDER BY slug), 'none')
FROM pages WHERE status='published'

UNION ALL
SELECT 'Media library',
       'INFO',
       count(*)::text || ' files'
FROM media;
