import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 500

const COLLECTIONS = [
  { rangeStart: 1000, collection: 'posts' as const },
  { rangeStart: 2000, collection: 'treatments' as const },
  { rangeStart: 3000, collection: 'locations' as const },
  { rangeStart: 4000, collection: 'pages' as const },
]

export async function GET() {
  const BASE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const payload = await getPayload({ config: configPromise })

  const sitemapUrls: string[] = [`${BASE_URL}/sitemap/0`]

  for (const col of COLLECTIONS) {
    const result = await payload.find({
      collection: col.collection,
      where: { status: { equals: 'published' } },
      limit: 1,
      select: {},
    })
    const totalPages = Math.max(1, Math.ceil(result.totalDocs / PAGE_SIZE))
    for (let i = 0; i < totalPages; i++) {
      sitemapUrls.push(`${BASE_URL}/sitemap/${col.rangeStart + i}`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <sitemap>
    <loc>${url}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
