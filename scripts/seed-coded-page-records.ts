/**
 * Creates the Pages records that back the SEO tab for pages built in code.
 *
 * Routes such as /about-us and /our-services render their own components, but
 * their title, description, keywords and structured data are read from a Pages
 * record with the matching slug. Without the record there is nothing to edit.
 *
 * These records carry no layout blocks -- only the SEO tab is used.
 *
 * Run with:  npx tsx scripts/seed-coded-page-records.ts
 * Safe to re-run: existing records are left untouched.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const CODED_PAGES: Array<{ slug: string; title: string }> = [
  { slug: 'home', title: 'Home' },
  { slug: 'about-us', title: 'About Us' },
  { slug: 'clinics', title: 'Our Clinics' },
  { slug: 'contact-us', title: 'Contact Us' },
  { slug: 'our-services', title: 'Our Services' },
  { slug: 'privacy-policy', title: 'Privacy Policy' },
  { slug: 'terms-of-service', title: 'Terms of Service' },
  { slug: 'blog', title: 'Blog' },
]

const payload = await getPayload({ config })

let created = 0
for (const { slug, title } of CODED_PAGES) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.totalDocs > 0) {
    console.log(`exists: ${slug}`)
    continue
  }

  await payload.create({
    collection: 'pages',
    data: { title, slug, status: 'published', layout: [] } as any,
    draft: false,
  })
  created++
  console.log(`created: ${slug}`)
}

console.log(created === 0 ? 'All records already present.' : `Created ${created} record(s).`)
process.exit(0)
