-- Adds every AWS region in src/lib/aws-regions.ts to the two Postgres enums
-- backing the region selects in Site Settings.
--
-- Same effect as migration 20260827_aws_regions_full_list; use this when
-- running `payload migrate` on the instance is inconvenient.
--
-- Run with:   psql "$DATABASE_URI" -f scripts/add-aws-regions.sql
--
-- Do NOT add --single-transaction: on PostgreSQL below 12, ALTER TYPE ... ADD
-- VALUE cannot run inside a transaction block. Every statement is idempotent,
-- so re-running this is safe.

-- enum_site_settings_storage_settings_s3_region
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'us-east-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'us-east-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'us-west-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'us-west-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'af-south-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-east-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-south-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-southeast-3';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-southeast-4';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-south-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-northeast-3';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-northeast-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-southeast-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-southeast-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ap-northeast-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ca-central-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'ca-west-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-central-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-west-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-west-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-south-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-west-3';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-south-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-north-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'eu-central-2';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'il-central-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'me-south-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'me-central-1';
ALTER TYPE "enum_site_settings_storage_settings_s3_region" ADD VALUE IF NOT EXISTS 'sa-east-1';

-- enum_site_settings_cdn_settings_cloudfront_region
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'us-east-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'us-east-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'us-west-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'us-west-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'af-south-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-east-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-south-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-southeast-3';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-southeast-4';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-south-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-northeast-3';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-northeast-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-southeast-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-southeast-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ap-northeast-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ca-central-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'ca-west-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-central-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-west-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-west-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-south-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-west-3';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-south-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-north-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'eu-central-2';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'il-central-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'me-south-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'me-central-1';
ALTER TYPE "enum_site_settings_cdn_settings_cloudfront_region" ADD VALUE IF NOT EXISTS 'sa-east-1';

