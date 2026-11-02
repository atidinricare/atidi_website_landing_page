import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function check() {
  const uri = process.env.DATABASE_URI
  console.log('URI:', uri ? uri.replace(/:[^:@]+@/, ':***@') : 'NONE')
  const client = new Client({ connectionString: uri })
  try {
    await client.connect()
    console.log('CONNECTED_TO_DB: true')

    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `)
    console.log('TOTAL_TABLES_IN_POSTGRES:', tables.rows.length)

    const list = [
      'users',
      'treatments',
      'locations',
      'clinics',
      'categories',
      'faqs',
      'testimonials',
      'posts',
      'site_settings',
      'hero_content',
      'navigation',
      'footer'
    ]

    for (const name of list) {
      try {
        const r = await client.query(`SELECT count(*) FROM "${name}"`)
        console.log(`Table "${name}": ${r.rows[0].count} rows`)
      } catch (e: any) {
        console.log(`Table "${name}": table does not exist (${e.message})`)
      }
    }
  } catch (err: any) {
    console.error('CONNECTED_TO_DB: false ->', err.message)
  } finally {
    await client.end()
  }
}

check()

