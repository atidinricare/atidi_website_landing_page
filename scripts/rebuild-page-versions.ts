/**
 * Creates the missing version record for any page that has none.
 *
 * The Pages collection has drafts enabled, so Payload keeps a row in _pages_v
 * alongside each row in `pages`, and the admin list view relies on it. A page
 * inserted with raw SQL has no version row and therefore renders on the site
 * but stays invisible in the admin. Re-saving it through the Local API creates
 * the missing record.
 *
 * Run with:  npx tsx scripts/rebuild-page-versions.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const { docs } = await payload.find({ collection: 'pages', limit: 500, depth: 0 })

let repaired = 0
for (const doc of docs as any[]) {
  const versions = await payload.findVersions({
    collection: 'pages',
    where: { parent: { equals: doc.id } },
    limit: 1,
    depth: 0,
  })

  if (versions.totalDocs > 0) continue

  // Re-saving with unchanged data is enough to write the version row.
  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: { title: doc.title },
    draft: false,
  })
  repaired++
  console.log(`Repaired "${doc.slug}" (id ${doc.id})`)
}

console.log(repaired === 0 ? 'All pages already have version records.' : `Repaired ${repaired} page(s).`)
process.exit(0)
