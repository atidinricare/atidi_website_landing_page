// Migration: Add "Our Services" link to Footer
// Run with: npx tsx scripts/002-add-our-services-footer.ts

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function migrate() {
  console.log('Migration 002: Add "Our Services" link to Footer\n')

  const payload = await getPayload({ config })

  // Get current footer data
  const footer = await payload.findGlobal({ slug: 'footer' })

  const columns = footer.columns || []
  const companyColumn = columns.find((col: any) => col.title === 'Company')

  if (!companyColumn) {
    console.log('No "Company" column found in footer. Skipping.')
    process.exit(0)
  }

  const links = companyColumn.links || []
  const alreadyExists = links.some((link: any) => link.url === '/our-services')

  if (alreadyExists) {
    console.log('"Our Services" link already exists in footer. Skipping.')
    process.exit(0)
  }

  // Insert "Our Services" after "About Us"
  const aboutUsIndex = links.findIndex((link: any) => link.url === '/about-us')
  const insertIndex = aboutUsIndex >= 0 ? aboutUsIndex + 1 : 0

  links.splice(insertIndex, 0, {
    label: 'Our Services',
    url: '/our-services',
    newTab: false,
  })

  companyColumn.links = links

  await payload.updateGlobal({
    slug: 'footer',
    data: { columns },
  })

  console.log('Footer updated. Company links:')
  links.forEach((link: any) => console.log(`  - ${link.label}: ${link.url}`))

  process.exit(0)
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
