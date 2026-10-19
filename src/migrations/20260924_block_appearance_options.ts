import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Editors had no control over how the hero and contact-card blocks looked: a
 * CMS hero was always dark and contact cards were always light, which did not
 * match the hand-built Contact Us page. Adds a Background choice to the hero
 * block and a Card Style choice to the contact cards block.
 *
 * Drafts are enabled on Pages, so each column exists twice — once on the main
 * table and once on the matching _pages_v table.
 *
 * Defaults preserve the previous appearance, so existing pages are unchanged.
 */
const COLUMNS = [
  { table: 'pages_blocks_hero', column: 'background', type: 'enum_pages_blocks_hero_background', values: ['dark', 'light'], default: 'dark' },
  { table: '_pages_v_blocks_hero', column: 'background', type: 'enum__pages_v_blocks_hero_background', values: ['dark', 'light'], default: 'dark' },
  { table: 'pages_blocks_contact_cards', column: 'theme', type: 'enum_pages_blocks_contact_cards_theme', values: ['light', 'dark'], default: 'light' },
  { table: '_pages_v_blocks_contact_cards', column: 'theme', type: 'enum__pages_v_blocks_contact_cards_theme', values: ['light', 'dark'], default: 'light' },
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const { table, column, type, values, default: def } of COLUMNS) {
    const labels = values.map((v) => `'${v}'`).join(', ')

    // CREATE TYPE has no IF NOT EXISTS, so guard on the catalogue.
    await db.execute(
      sql.raw(`DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${type}') THEN
          CREATE TYPE "${type}" AS ENUM(${labels});
        END IF;
      END $$;`),
    )

    await db.execute(
      sql.raw(
        `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" "${type}" DEFAULT '${def}';`,
      ),
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const { table, column, type } of COLUMNS) {
    await db.execute(sql.raw(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${column}";`))
    await db.execute(sql.raw(`DROP TYPE IF EXISTS "${type}";`))
  }
}
