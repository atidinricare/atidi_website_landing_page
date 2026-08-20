import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const tables = ['treatments', 'clinics', 'faqs', 'testimonials', 'categories', 'locations']

  for (const table of tables) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'draft';
      UPDATE "${table}" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const tables = ['treatments', 'clinics', 'faqs', 'testimonials', 'categories', 'locations']

  for (const table of tables) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" DROP COLUMN IF EXISTS "status";
    `))
  }
}
