import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

const CONFIG_FILE = path.resolve(process.cwd(), 'storage-config.json')

export interface StorageConfig {
  s3: {
    enabled: boolean
    bucket: string
    region: string
    accessKeyId: string
    secretAccessKey: string
    endpoint: string
    forcePathStyle: boolean
    assetBaseUrl: string
  }
  cdn: {
    provider: 'none' | 'cloudflare' | 'cloudfront'
    cloudflare: {
      apiToken: string
      zoneId: string
    }
    cloudfront: {
      distributionId: string
      region: string
      accessKeyId: string
      secretAccessKey: string
    }
  }
}

const defaults: StorageConfig = {
  s3: {
    enabled: false,
    bucket: 'atidi-media',
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
    endpoint: '',
    forcePathStyle: true,
    assetBaseUrl: '',
  },
  cdn: {
    provider: 'none',
    cloudflare: { apiToken: '', zoneId: '' },
    cloudfront: { distributionId: '', region: 'us-east-1', accessKeyId: '', secretAccessKey: '' },
  },
}

/**
 * Read storage config from the database via a short synchronous subprocess.
 *
 * Why subprocess: `readStorageConfig` runs at module load (during payload.config.ts
 * evaluation), which is a synchronous context. The `pg` driver is async-only.
 * Running a tiny Node child with `execFileSync` gives us a blocking DB read
 * without forcing `buildConfig` to become async.
 *
 * Returns `null` when:
 *   - `DATABASE_URI` env var is missing,
 *   - the DB is unreachable,
 *   - the `site_settings` row doesn't exist yet (fresh DB),
 *   - or any SQL error occurs.
 * The caller falls through to the file / defaults path on null.
 */
function readStorageConfigFromDb(): StorageConfig | null {
  if (!process.env.DATABASE_URI) return null

  const script = `
    const { Client } = require('pg');
    (async () => {
      const c = new Client({ connectionString: process.env.DATABASE_URI });
      await c.connect();
      try {
        const r = await c.query(\`
          SELECT
            storage_settings_s3_enabled AS s3_enabled,
            storage_settings_s3_bucket AS s3_bucket,
            storage_settings_s3_region AS s3_region,
            storage_settings_s3_access_key_id AS s3_access_key_id,
            storage_settings_s3_secret_access_key AS s3_secret_access_key,
            storage_settings_s3_endpoint AS s3_endpoint,
            storage_settings_s3_force_path_style AS s3_force_path_style,
            storage_settings_s3_asset_base_url AS s3_asset_base_url,
            cdn_settings_provider AS cdn_provider,
            cdn_settings_cloudflare_api_token AS cf_token,
            cdn_settings_cloudflare_zone_id AS cf_zone,
            cdn_settings_cloudfront_distribution_id AS cf_dist,
            cdn_settings_cloudfront_region AS cf_region,
            cdn_settings_cloudfront_access_key_id AS cf_access_key,
            cdn_settings_cloudfront_secret_access_key AS cf_secret
          FROM site_settings LIMIT 1
        \`);
        if (r.rowCount === 0) { console.log('null'); return; }
        const row = r.rows[0];
        console.log(JSON.stringify({
          s3: {
            enabled: !!row.s3_enabled,
            bucket: row.s3_bucket || '',
            region: row.s3_region || '',
            accessKeyId: row.s3_access_key_id || '',
            secretAccessKey: row.s3_secret_access_key || '',
            endpoint: row.s3_endpoint || '',
            forcePathStyle: !!row.s3_force_path_style,
            assetBaseUrl: row.s3_asset_base_url || '',
          },
          cdn: {
            provider: row.cdn_provider || 'none',
            cloudflare: { apiToken: row.cf_token || '', zoneId: row.cf_zone || '' },
            cloudfront: {
              distributionId: row.cf_dist || '',
              region: row.cf_region || '',
              accessKeyId: row.cf_access_key || '',
              secretAccessKey: row.cf_secret || '',
            },
          },
        }));
      } finally {
        await c.end();
      }
    })().catch((err) => { process.stderr.write(String(err && err.message || err)); process.exit(1); });
  `

  try {
    const stdout = execFileSync(process.execPath, ['-e', script], {
      env: process.env,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 5000,
    }).trim()

    if (!stdout || stdout === 'null') return null

    const parsed = JSON.parse(stdout)
    return {
      ...defaults,
      ...parsed,
      s3: { ...defaults.s3, ...parsed.s3 },
      cdn: {
        ...defaults.cdn,
        ...parsed.cdn,
        cloudflare: { ...defaults.cdn.cloudflare, ...parsed.cdn?.cloudflare },
        cloudfront: { ...defaults.cdn.cloudfront, ...parsed.cdn?.cloudfront },
      },
    }
  } catch (err) {
    console.warn('[StorageConfig] DB read failed, falling back to file:', (err as Error).message)
    return null
  }
}

function readStorageConfigFromFile(): StorageConfig | null {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return null
    const saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
    return {
      ...defaults,
      ...saved,
      s3: { ...defaults.s3, ...saved.s3 },
      cdn: {
        ...defaults.cdn,
        ...saved.cdn,
        cloudflare: { ...defaults.cdn.cloudflare, ...saved.cdn?.cloudflare },
        cloudfront: { ...defaults.cdn.cloudfront, ...saved.cdn?.cloudfront },
      },
    }
  } catch {
    return null
  }
}

/**
 * Resolve storage configuration.
 *
 * Resolution order (first match wins):
 *   1. Database — `site_settings` row. Authoritative source for production.
 *   2. File — `storage-config.json` at CWD. Useful for local-dev overrides
 *      when you don't want to hit the DB.
 *   3. Defaults — S3 disabled, CDN none.
 */
export function readStorageConfig(): StorageConfig {
  return readStorageConfigFromDb() ?? readStorageConfigFromFile() ?? defaults
}

export function writeStorageConfig(config: StorageConfig): void {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[StorageConfig] Could not write config file:', (err as Error).message)
  }
}
