import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

/**
 * Script to safely remove gallery items and videos from treatments in PostgreSQL.
 */
async function clearTreatmentMedia() {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()

  console.log('Clearing treatments gallery and videos...')

  // Clear treatments_gallery
  const galleryRes = await client.query('DELETE FROM treatments_gallery;')
  console.log(`Deleted ${galleryRes.rowCount} rows from treatments_gallery`)

  // Clear treatments_videos
  const videosRes = await client.query('DELETE FROM treatments_videos;')
  console.log(`Deleted ${videosRes.rowCount} rows from treatments_videos`)

  // Reset main image_id on treatments if desired
  const imageRes = await client.query('UPDATE treatments SET image_id = NULL;')
  console.log(`Reset image_id on ${imageRes.rowCount} treatments`)

  await client.end()
  console.log('Done! All gallery photos, videos, and treatment images have been cleanly cleared.')
}

clearTreatmentMedia().catch((err) => {
  console.error('Error clearing treatment media:', err)
  process.exit(1)
})

