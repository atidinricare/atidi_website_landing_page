import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { AWS_REGION_VALUES } from '../lib/aws-regions'

/**
 * The S3 storage and CloudFront region selects were backed by hand-written,
 * incomplete option lists, so regions such as ap-south-2 (Hyderabad) could not
 * be selected in Site Settings. The field options now come from AWS_REGIONS;
 * this migration widens the matching Postgres enums to accept every value.
 *
 * Postgres cannot drop a value from an enum without recreating the type, so
 * `down` is intentionally a no-op — the extra values are harmless.
 */
const REGION_ENUMS = [
  'enum_site_settings_storage_settings_s3_region',
  'enum_site_settings_cdn_settings_cloudfront_region',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const enumName of REGION_ENUMS) {
    for (const region of AWS_REGION_VALUES) {
      await db.execute(
        sql.raw(`ALTER TYPE "${enumName}" ADD VALUE IF NOT EXISTS '${region}'`),
      )
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: Postgres cannot remove enum values without recreating the type.
}
