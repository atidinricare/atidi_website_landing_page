/**
 * Bootstrap script — runs BEFORE the app starts.
 * Reads S3 config from DB and writes storage-config.json so payload.config.ts can use it.
 */
import 'dotenv/config'
import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

const CONFIG_FILE = path.resolve(process.cwd(), 'storage-config.json')

async function bootstrap() {
  // Skip if config file already exists
  if (fs.existsSync(CONFIG_FILE)) {
    return
  }

  const dbUrl = process.env.DATABASE_URI
  if (!dbUrl) return

  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()

    const { rows } = await client.query(`
      SELECT
        storage_settings_s3_enabled as enabled,
        storage_settings_s3_bucket as bucket,
        storage_settings_s3_region as region,
        storage_settings_s3_access_key_id as access_key_id,
        storage_settings_s3_secret_access_key as secret_access_key,
        storage_settings_s3_endpoint as endpoint,
        storage_settings_s3_force_path_style as force_path_style,
        storage_settings_s3_asset_base_url as asset_base_url
      FROM site_settings
      LIMIT 1
    `)

    if (rows.length > 0 && rows[0].enabled) {
      const row = rows[0]
      const config = {
        s3: {
          enabled: true,
          bucket: row.bucket || '',
          region: row.region || 'us-east-1',
          accessKeyId: row.access_key_id || '',
          secretAccessKey: row.secret_access_key || '',
          endpoint: row.endpoint || '',
          forcePathStyle: row.force_path_style ?? true,
          assetBaseUrl: row.asset_base_url || '',
        },
        cdn: {
          provider: 'none',
          cloudflare: { apiToken: '', zoneId: '' },
          cloudfront: { distributionId: '', region: 'us-east-1', accessKeyId: '', secretAccessKey: '' },
        },
      }

      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
      console.log('[Bootstrap] Wrote storage-config.json from database')
    }
  } catch (err) {
    console.warn('[Bootstrap] Could not read storage config from DB:', (err as Error).message)
  } finally {
    await client.end()
  }
}

bootstrap()
