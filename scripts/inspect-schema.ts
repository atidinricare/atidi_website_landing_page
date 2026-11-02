import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()

  const tables = [
    'pages_blocks_testimonials_block',
    '_pages_v_blocks_testimonials_block',
    'pages_blocks_cta_block_screens',
    '_pages_v_blocks_cta_block_screens',
  ]

  for (const t of tables) {
    const res = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [t])
    console.log(`=== TABLE: ${t} ===`)
    console.log(res.rows)
  }

  await client.end()
}

run().catch(console.error)

