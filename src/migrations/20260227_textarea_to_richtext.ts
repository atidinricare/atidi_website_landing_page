import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Wraps a plain text string into Lexical JSON paragraph format
// Uses PostgreSQL jsonb functions to safely handle any text content
const textToLexicalSQL = (column: string) => `
  jsonb_build_object(
    'root', jsonb_build_object(
      'type', 'root',
      'format', '',
      'indent', 0,
      'version', 1,
      'direction', 'ltr',
      'children', jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'format', '',
          'indent', 0,
          'version', 1,
          'direction', 'ltr',
          'textFormat', 0,
          'children', jsonb_build_array(
            jsonb_build_object(
              'type', 'text',
              'detail', 0,
              'format', 0,
              'mode', 'normal',
              'style', '',
              'text', ${column},
              'version', 1
            )
          )
        )
      )
    )
  )
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // faqs.answer: varchar -> jsonb
  await db.execute(sql.raw(`
    ALTER TABLE "faqs" ADD COLUMN "answer_new" jsonb;
    UPDATE "faqs" SET "answer_new" = ${textToLexicalSQL('"answer"')} WHERE "answer" IS NOT NULL;
    ALTER TABLE "faqs" DROP COLUMN "answer";
    ALTER TABLE "faqs" RENAME COLUMN "answer_new" TO "answer";
  `))

  // treatments.description: varchar -> jsonb
  await db.execute(sql.raw(`
    ALTER TABLE "treatments" ADD COLUMN "description_new" jsonb;
    UPDATE "treatments" SET "description_new" = ${textToLexicalSQL('"description"')} WHERE "description" IS NOT NULL;
    ALTER TABLE "treatments" DROP COLUMN "description";
    ALTER TABLE "treatments" RENAME COLUMN "description_new" TO "description";
  `))

  // locations.description: varchar -> jsonb
  await db.execute(sql.raw(`
    ALTER TABLE "locations" ADD COLUMN "description_new" jsonb;
    UPDATE "locations" SET "description_new" = ${textToLexicalSQL('"description"')} WHERE "description" IS NOT NULL;
    ALTER TABLE "locations" DROP COLUMN "description";
    ALTER TABLE "locations" RENAME COLUMN "description_new" TO "description";
  `))

  // testimonials.quote: varchar -> jsonb
  await db.execute(sql.raw(`
    ALTER TABLE "testimonials" ADD COLUMN "quote_new" jsonb;
    UPDATE "testimonials" SET "quote_new" = ${textToLexicalSQL('"quote"')} WHERE "quote" IS NOT NULL;
    ALTER TABLE "testimonials" DROP COLUMN "quote";
    ALTER TABLE "testimonials" RENAME COLUMN "quote_new" TO "quote";
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Revert jsonb columns back to varchar (data will be lost)
  await db.execute(sql.raw(`
    ALTER TABLE "faqs" ADD COLUMN "answer_old" varchar;
    ALTER TABLE "faqs" DROP COLUMN "answer";
    ALTER TABLE "faqs" RENAME COLUMN "answer_old" TO "answer";

    ALTER TABLE "treatments" ADD COLUMN "description_old" varchar;
    ALTER TABLE "treatments" DROP COLUMN "description";
    ALTER TABLE "treatments" RENAME COLUMN "description_old" TO "description";

    ALTER TABLE "locations" ADD COLUMN "description_old" varchar;
    ALTER TABLE "locations" DROP COLUMN "description";
    ALTER TABLE "locations" RENAME COLUMN "description_old" TO "description";

    ALTER TABLE "testimonials" ADD COLUMN "quote_old" varchar;
    ALTER TABLE "testimonials" DROP COLUMN "quote";
    ALTER TABLE "testimonials" RENAME COLUMN "quote_old" TO "quote";
  `))
}
