import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()

  console.log('Setting sequence ownership...')
  await client.query(`
    ALTER SEQUENCE "_pages_v_blocks_cta_block_screens_id_seq" OWNED BY "_pages_v_blocks_cta_block_screens"."id";
  `)
  console.log('Sequence ownership set successfully!')

  await client.end()
}

run().catch(console.error)

