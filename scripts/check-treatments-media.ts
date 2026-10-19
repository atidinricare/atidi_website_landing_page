import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()

  console.log('=== FEATURED TREATMENTS ===')
  const r = await client.query(`
    SELECT t.id, t.name, t.slug, t.opens_in_new_tab, t.image_id, m.filename as image_file
    FROM treatments t
    LEFT JOIN media m ON t.image_id = m.id
    WHERE t.slug IN ('dental-implants', 'smile-design', 'invisalign-aligners', 'root-canal', 'wisdom-teeth')
    ORDER BY t.id
  `)
  console.log(r.rows)

  console.log('\n=== ALL GALLERIES IN DB ===')
  const g = await client.query(`
    SELECT g._parent_id, t.name as treatment_name, t.slug, g.caption, m.filename 
    FROM treatments_gallery g
    JOIN treatments t ON g._parent_id = t.id
    LEFT JOIN media m ON g.image_id = m.id
    ORDER BY g._parent_id, g._order
  `)
  console.log(g.rows)

  console.log('\n=== ALL VIDEOS IN DB ===')
  const v = await client.query(`
    SELECT v._parent_id, t.name as treatment_name, t.slug, v.title, v.type, v.youtube_url, m.filename as video_file
    FROM treatments_videos v
    JOIN treatments t ON v._parent_id = t.id
    LEFT JOIN media m ON v.video_file_id = m.id
    ORDER BY v._parent_id, v._order
  `)
  console.log(v.rows)

  await client.end()
}

run().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

