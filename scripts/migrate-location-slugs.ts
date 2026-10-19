// One-time migration to add slug field to existing locations
// Run with: npx tsx scripts/migrate-location-slugs.ts

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function migrateLocationSlugs() {
  console.log('Migrating location slugs...\n')

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'locations',
    limit: 200,
  })

  const usedSlugs = new Set<string>()
  let updated = 0

  for (const doc of result.docs) {
    if (doc.slug) {
      usedSlugs.add(doc.slug)
      console.log(`  [skip] "${doc.city}" already has slug "${doc.slug}"`)
      continue
    }

    let slug = doc.city.toLowerCase().replace(/\s+/g, '-')

    // Handle duplicates by appending state code
    if (usedSlugs.has(slug)) {
      const stateCode = doc.stateCode || doc.state.toLowerCase().replace(/\s+/g, '-')
      slug = `${slug}-${stateCode}`
    }

    usedSlugs.add(slug)

    await payload.update({
      collection: 'locations',
      id: doc.id,
      data: { slug },
    })

    updated++
    console.log(`  [updated] "${doc.city}" -> slug "${slug}"`)
  }

  console.log(`\nDone! ${updated} locations updated, ${result.docs.length - updated} skipped.`)
  process.exit(0)
}

migrateLocationSlugs().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
