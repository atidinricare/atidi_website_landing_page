import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

interface ExpectedTable {
  table: string
  criticalColumns: string[]
}

const EXPECTED_SCHEMA: ExpectedTable[] = [
  {
    table: 'treatments',
    criticalColumns: ['id', 'name', 'slug', 'status', 'opens_in_new_tab', 'usa_price_min', 'india_price_min', 'description'],
  },
  {
    table: 'locations',
    criticalColumns: ['id', 'city', 'state', 'country', 'slug', 'status', 'opens_in_new_tab'],
  },
  {
    table: 'clinics',
    criticalColumns: ['id', 'name', 'status', 'city', 'location_id', 'address', 'phone', 'rating'],
  },
  {
    table: 'categories',
    criticalColumns: ['id', 'name', 'slug', 'status'],
  },
  {
    table: 'faqs',
    criticalColumns: ['id', 'question', 'answer', 'status', 'category'],
  },
  {
    table: 'testimonials',
    criticalColumns: ['id', 'patient_name', 'status', 'rating', 'quote', 'featured'],
  },
  {
    table: 'posts',
    criticalColumns: ['id', 'title', 'slug', '_status', 'published_date', 'content'],
  },
  {
    table: 'pages',
    criticalColumns: ['id', 'title', 'slug', '_status'],
  },
  {
    table: 'pages_blocks_locations_block',
    criticalColumns: ['id', 'eyebrow', 'india_count', 'india_label', 'us_count', 'us_label'],
  },
  {
    table: 'pages_blocks_treatments_block',
    criticalColumns: ['id', 'eyebrow', 'heading', 'subheading'],
  },
  {
    table: 'pages_blocks_cta_block',
    criticalColumns: ['id', 'eyebrow', 'heading', 'subheading', 'style'],
  },
  {
    table: 'pages_blocks_cta_block_screens',
    criticalColumns: ['id', '_order', '_parent_id', 'image_id', 'image_url', 'label', 'caption'],
  },
  {
    table: 'pages_blocks_testimonials_block',
    criticalColumns: ['id', 'eyebrow', 'heading', 'subheading', 'show_featured_only'],
  },
  {
    table: 'pages_blocks_hero',
    criticalColumns: ['id', 'background', 'headline', 'subheadline'],
  },
  {
    table: 'pages_blocks_contact_cards',
    criticalColumns: ['id', 'theme'],
  },
  {
    table: '_pages_v',
    criticalColumns: ['id', 'parent_id', 'version_title', 'version_slug', 'version__status', 'latest'],
  },
  {
    table: 'site_settings',
    criticalColumns: ['id', 'site_name', 'contact_email', 'contact_phone'],
  },
  {
    table: 'navigation',
    criticalColumns: ['id'],
  },
  {
    table: 'footer',
    criticalColumns: ['id', 'tagline', 'bottom_text'],
  },
  {
    table: 'users',
    criticalColumns: ['id', 'email', 'hash'],
  },
]

async function audit() {
  const uri = process.env.DATABASE_URI
  console.log('============================================================')
  console.log('       ATIDI NRI CARE - DATABASE COMPREHENSIVE AUDIT        ')
  console.log('============================================================')
  console.log('Connecting to:', uri ? uri.replace(/:[^:@]+@/, ':***@') : 'NONE')

  const client = new Client({ connectionString: uri })
  await client.connect()

  let totalErrors = 0

  // 1. Check existing tables in public schema
  const existingTablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `)
  const existingTables = new Set(existingTablesRes.rows.map((r) => r.table_name))
  console.log(`\n[1/3] TOTAL TABLES FOUND IN DATABASE: ${existingTables.size}\n`)

  // 2. Check each expected table and its critical columns
  console.log('[2/3] CHECKING TABLES & COLUMNS INTEGRITY...')
  console.log('------------------------------------------------------------')

  for (const expected of EXPECTED_SCHEMA) {
    if (!existingTables.has(expected.table)) {
      console.log(`❌ MISSING TABLE: "${expected.table}"`)
      totalErrors++
      continue
    }

    // Table exists, check its columns
    const columnsRes = await client.query(
      `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1
    `,
      [expected.table]
    )
    const existingCols = new Set(columnsRes.rows.map((r) => r.column_name))
    const missingCols = expected.criticalColumns.filter((c) => !existingCols.has(c))

    // Check row count
    let count = 0
    try {
      const countRes = await client.query(`SELECT COUNT(*) FROM "${expected.table}"`)
      count = parseInt(countRes.rows[0].count, 10)
    } catch {
      count = -1
    }

    if (missingCols.length > 0) {
      console.log(`⚠️ TABLE "${expected.table}" (${count} rows) -> ❌ MISSING COLUMNS: ${missingCols.join(', ')}`)
      totalErrors++
    } else {
      console.log(`✅ TABLE "${expected.table}" (${count} rows) -> ALL COLUMNS PRESENT`)
    }
  }

  // 3. Check data completeness (Pages, Treatments, Locations)
  console.log('\n[3/3] CHECKING DATA COMPLETENESS...')
  console.log('------------------------------------------------------------')

  // Check Pages
  const pagesRes = await client.query(`SELECT id, title, slug, _status FROM pages ORDER BY id`)
  console.log(`Found ${pagesRes.rows.length} Pages in CMS:`)
  for (const p of pagesRes.rows) {
    console.log(`   - [ID: ${p.id}] "${p.title}" (slug: /${p.slug}) -> Status: ${p._status || 'published'}`)
  }

  // Check critical pages
  const expectedSlugs = ['home', 'about-us', 'contact-us', 'our-services', 'clinics', 'privacy-policy', 'terms-of-service', 'our-team']
  const existingSlugs = new Set(pagesRes.rows.map(p => p.slug))
  const missingPages = expectedSlugs.filter(s => !existingSlugs.has(s))
  if (missingPages.length > 0) {
    console.log(`⚠️ MISSING PAGES IN DATABASE: ${missingPages.join(', ')}`)
    totalErrors++
  } else {
    console.log(`✅ All ${expectedSlugs.length} standard pages exist in the database!`)
  }

  console.log('\n============================================================')
  if (totalErrors === 0) {
    console.log('🎉 AUDIT RESULT: PERFECT HEALTH! 0 MISSING TABLES/COLUMNS.')
  } else {
    console.log(`⚠️ AUDIT RESULT: FOUND ${totalErrors} ISSUES. Run scripts/sync-database.sql to fix!`)
  }
  console.log('============================================================\n')

  await client.end()
}

audit().catch(console.error)

