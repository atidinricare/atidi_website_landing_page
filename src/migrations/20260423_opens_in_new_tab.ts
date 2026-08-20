import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const FEATURED_TREATMENT_SLUGS = [
  'dental-implants',
  'smile-design',
  'invisalign-aligners',
  'root-canal',
  'wisdom-teeth',
]

const NEW_HERO_SUBHEADLINE =
  'ATIDI NRI CARE connects NRIs to verified top premium dental hospitals in India & USA. We provide world-class treatment in India with seamless follow-up care when you return to the USA. At Atidi dental treatments are 70–90% cheaper than in USA without compromising quality.'

const FEATURED_VIDEOS: Record<string, Array<{ title: string; url: string }>> = {
  'dental-implants': [
    { title: 'All-on-4 Implants Overview', url: 'https://youtube.com/shorts/2ZRWYZ59TYg' },
    { title: 'Dental Implant Procedure', url: 'https://youtu.be/D788vZWD7Mc' },
  ],
  'smile-design': [
    { title: 'Digital Smile Design', url: 'https://youtu.be/nKjVUnQrt70' },
  ],
  'root-canal': [
    { title: 'Root Canal Treatment Explained', url: 'https://youtu.be/P3BJ6jR-_cI' },
    { title: 'Root Canal Procedure', url: 'https://youtu.be/4KbU1EG_6QQ' },
  ],
  'invisalign-aligners': [
    { title: 'Invisalign Aligners', url: 'https://youtu.be/Cu1Cz3lAcwI' },
  ],
  'wisdom-teeth': [
    { title: 'Wisdom Teeth Removal', url: 'https://youtu.be/_rmv3QFFHQk' },
  ],
}

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  // 1. Add opens_in_new_tab column to treatments + locations
  await db.execute(sql.raw(`
    ALTER TABLE "treatments"
      ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;
    ALTER TABLE "locations"
      ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;
  `))

  // 2. Publish all rows
  await db.execute(sql.raw(`
    UPDATE "treatments" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
    UPDATE "locations"  SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  `))

  // 3. Set opensInNewTab = true for 5 featured treatments (by slug), false for the rest.
  //    Locations stay at the default (true).
  const slugList = FEATURED_TREATMENT_SLUGS.map((s) => `'${s}'`).join(', ')
  await db.execute(sql.raw(`
    UPDATE "treatments" SET "opens_in_new_tab" = true  WHERE "slug" IN (${slugList});
    UPDATE "treatments" SET "opens_in_new_tab" = false WHERE "slug" NOT IN (${slugList});
  `))

  // 4. Update HeroContent global: new subheadline + US-states stat 8 → 10.
  try {
    const current = (await payload.findGlobal({ slug: 'hero-content' })) as any
    const updatedStats = (current?.stats ?? []).map((s: any) => {
      const label = (s?.label || '').toLowerCase()
      if (label.includes('us states') || label.includes('states covered')) {
        return { ...s, value: '10' }
      }
      return s
    })
    await payload.updateGlobal({
      slug: 'hero-content',
      data: {
        subheadline: NEW_HERO_SUBHEADLINE,
        stats: updatedStats,
      } as any,
    })
  } catch (err) {
    console.warn('[migration 20260423] HeroContent update skipped:', (err as Error).message)
  }

  // 5. Replace videos on the 5 client-specified treatments.
  for (const slug of Object.keys(FEATURED_VIDEOS)) {
    try {
      const result = await payload.find({
        collection: 'treatments',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      const doc = result.docs[0] as any
      if (!doc) continue
      const videos = FEATURED_VIDEOS[slug].map((v) => ({
        title: v.title,
        type: 'youtube',
        youtubeUrl: v.url,
      }))
      await payload.update({
        collection: 'treatments',
        id: doc.id,
        data: { videos } as any,
      })
    } catch (err) {
      console.warn(`[migration 20260423] Videos update skipped for ${slug}:`, (err as Error).message)
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`
    ALTER TABLE "treatments" DROP COLUMN IF EXISTS "opens_in_new_tab";
    ALTER TABLE "locations"  DROP COLUMN IF EXISTS "opens_in_new_tab";
  `))
}
