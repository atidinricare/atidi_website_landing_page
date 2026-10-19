import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()

  console.log('--- PAYLOAD_PREFERENCES COLUMNS ---')
  const cols = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'payload_preferences'
    ORDER BY ordinal_position;
  `)
  console.log(cols.rows)

  console.log('--- PAYLOAD_PREFERENCES ROWS ---')
  const rows = await client.query('SELECT * FROM payload_preferences LIMIT 10;')
  console.log(rows.rows)

  console.log('--- TEST QUERY ---')
  try {
    const res = await client.query(`
      DELETE FROM "payload_preferences" 
      WHERE "payload_preferences"."key" IN ($1, $2, $3, $4, $5, $6, $7)
    `, ['collection-media-8', 'collection-media-7', 'collection-media-6', 'collection-media-5', 'collection-media-4', 'collection-media-3', 'collection-media-2'])
    console.log('Query succeeded! Deleted rows:', res.rowCount)
  } catch (err: any) {
    console.error('Query failed with error:', err.message)
    console.error('Error detail:', err.detail)
    console.error('Error hint:', err.hint)
    console.error('Error code:', err.code)
  }

  await client.end()
}

run().catch(console.error)

