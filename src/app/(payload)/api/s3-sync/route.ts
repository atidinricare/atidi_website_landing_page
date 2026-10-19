import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { syncPublicAssetsToS3, checkBucketPublicAccess } from '@/lib/s3-sync'
import { readStorageConfig } from '@/lib/storage-config'

async function getAuthenticatedUser() {
  const payload = await getPayload({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) return null

  try {
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return user
  } catch {
    return null
  }
}

// POST /api/s3-sync — Sync public assets to S3
export async function POST() {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await syncPublicAssetsToS3()
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

// GET /api/s3-sync — Check sync status and bucket public access
export async function GET() {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const storageConfig = readStorageConfig()
  if (!storageConfig.s3.enabled) {
    return NextResponse.json({
      enabled: false,
      message: 'S3 storage is not enabled',
    })
  }

  const bucketPublic = await checkBucketPublicAccess(
    storageConfig.s3.bucket,
    storageConfig.s3.region,
    storageConfig.s3.endpoint || undefined,
  )

  return NextResponse.json({
    enabled: true,
    bucket: storageConfig.s3.bucket,
    region: storageConfig.s3.region,
    bucketPublic,
    assetBaseUrl: storageConfig.s3.assetBaseUrl || `https://${storageConfig.s3.bucket}.s3.${storageConfig.s3.region}.amazonaws.com`,
  })
}
