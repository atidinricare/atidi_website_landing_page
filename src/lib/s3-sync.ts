import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { readStorageConfig } from './storage-config'
import fs from 'fs'
import path from 'path'

// Files that always stay in /public/ — never synced to S3
const LOCAL_ONLY_FILES = [
  'athidi.png',
  'favicon.ico',
  'AthidiLogo.png',
  'AthidiLogo.webp',
]

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

function getAllFiles(dirPath: string, prefix = ''): { filePath: string; key: string }[] {
  const files: { filePath: string; key: string }[] = []
  if (!fs.existsSync(dirPath)) return files

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    const key = prefix ? `${prefix}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, key))
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      // Skip non-media files and local-only files
      if (MIME_TYPES[ext] && !LOCAL_ONLY_FILES.includes(entry.name)) {
        files.push({ filePath: fullPath, key })
      }
    }
  }
  return files
}

export interface SyncResult {
  success: boolean
  uploaded: string[]
  skipped: string[]
  excluded: string[]
  errors: { file: string; error: string }[]
  s3BaseUrl: string
  bucketPublic: boolean
  totalFiles: number
}

export async function checkBucketPublicAccess(bucket: string, region: string, endpoint?: string): Promise<boolean> {
  const baseUrl = endpoint
    ? `${endpoint}/${bucket}`
    : `https://${bucket}.s3.${region}.amazonaws.com`

  try {
    // Try to fetch a known path — if we get 403 it's not public, 404 means public but file doesn't exist
    const response = await fetch(`${baseUrl}/assets/__public_access_test__`, {
      method: 'HEAD',
    })
    // 404 = bucket is public (file not found but access allowed)
    // 403 = bucket is not public
    // 200 = public (unlikely for test file)
    return response.status !== 403
  } catch {
    return false
  }
}

export async function syncPublicAssetsToS3(): Promise<SyncResult> {
  const config = readStorageConfig()

  if (!config.s3.enabled) {
    throw new Error('S3 storage is not enabled. Enable it in Site Settings > Storage (S3) first.')
  }

  if (!config.s3.accessKeyId || !config.s3.secretAccessKey || !config.s3.bucket) {
    throw new Error('S3 credentials are not configured. Set them in Site Settings > Storage (S3).')
  }

  const s3Client = new S3Client({
    region: config.s3.region,
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
    },
    ...(config.s3.endpoint ? { endpoint: config.s3.endpoint } : {}),
    forcePathStyle: config.s3.forcePathStyle,
  })

  const publicDir = path.resolve(process.cwd(), 'public')
  const files = getAllFiles(publicDir)
  const s3Prefix = 'assets'

  // Check bucket public access
  const bucketPublic = await checkBucketPublicAccess(
    config.s3.bucket,
    config.s3.region,
    config.s3.endpoint || undefined,
  )

  // List existing files in S3 to skip already synced ones
  const existingKeys = new Set<string>()
  try {
    let continuationToken: string | undefined
    do {
      const listResult = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: config.s3.bucket,
          Prefix: `${s3Prefix}/`,
          ContinuationToken: continuationToken,
        }),
      )
      listResult.Contents?.forEach((obj) => {
        if (obj.Key) existingKeys.add(obj.Key)
      })
      continuationToken = listResult.NextContinuationToken
    } while (continuationToken)
  } catch {
    // If listing fails, upload everything
  }

  const result: SyncResult = {
    success: true,
    uploaded: [],
    skipped: [],
    excluded: [...LOCAL_ONLY_FILES],
    errors: [],
    s3BaseUrl: getS3BaseUrl(config.s3.bucket, config.s3.region, config.s3.endpoint || undefined),
    bucketPublic,
    totalFiles: files.length,
  }

  for (const file of files) {
    const s3Key = `${s3Prefix}/${file.key}`

    if (existingKeys.has(s3Key)) {
      result.skipped.push(file.key)
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(file.filePath)
      await s3Client.send(
        new PutObjectCommand({
          Bucket: config.s3.bucket,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: getContentType(file.filePath),
          CacheControl: 'public, max-age=31536000',
        }),
      )
      result.uploaded.push(file.key)
    } catch (err: any) {
      result.errors.push({ file: file.key, error: err.message })
      result.success = false
    }
  }

  return result
}

export function getS3BaseUrl(bucket: string, region: string, endpoint?: string): string {
  if (endpoint) {
    return `${endpoint}/${bucket}`
  }
  return `https://${bucket}.s3.${region}.amazonaws.com`
}
