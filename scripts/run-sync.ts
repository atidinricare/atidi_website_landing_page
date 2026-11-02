import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import pg from 'pg'

const { Client } = pg

async function run() {
  const uri = process.env.DATABASE_URI
  if (!uri) {
    console.error('ERROR: DATABASE_URI is not set in environment or .env')
    process.exit(1)
  }

  console.log('Connecting to database:', uri.replace(/:[^:@]+@/, ':***@'))
  const client = new Client({ connectionString: uri })
  await client.connect()

  const sqlPath = path.resolve(process.cwd(), 'scripts/sync-database.sql')
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

  console.log('Applying database updates from scripts/sync-database.sql...')
  await client.query(sqlContent)
  console.log('✅ Database schema synchronized successfully!')

  await client.end()
}

run().catch((err) => {
  console.error('❌ Migration failed:', err.message)
  process.exit(1)
})

