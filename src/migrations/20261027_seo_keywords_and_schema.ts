import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the SEO fields the admin had no UI for: Focus Keywords and per-document
 * structured data (JSON-LD).
 *
 * The routes already read meta.keywords, but the field was never created, so
 * the keywords tag was silently never emitted. meta_schema is new.
 *
 * Pages and Posts have drafts enabled, so each field also exists on their
 * _v mirror; Treatments and Locations have no versions.
 */
const COLUMNS: Array<[table: string, column: string, type: string]> = [
  ['pages', 'meta_keywords', 'varchar'],
  ['pages', 'meta_schema', 'jsonb'],
  ['posts', 'meta_keywords', 'varchar'],
  ['posts', 'meta_schema', 'jsonb'],
  ['treatments', 'meta_keywords', 'varchar'],
  ['treatments', 'meta_schema', 'jsonb'],
  ['locations', 'meta_keywords', 'varchar'],
  ['locations', 'meta_schema', 'jsonb'],
  ['_pages_v', 'version_meta_keywords', 'varchar'],
  ['_pages_v', 'version_meta_schema', 'jsonb'],
  ['_posts_v', 'version_meta_keywords', 'varchar'],
  ['_posts_v', 'version_meta_schema', 'jsonb'],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, column, type] of COLUMNS) {
    await db.execute(
      sql.raw(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type};`),
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [table, column] of COLUMNS) {
    await db.execute(sql.raw(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${column}";`))
  }
}
