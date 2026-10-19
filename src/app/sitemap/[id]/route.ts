import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 500

const COLLECTIONS = [
  { rangeStart: 1000, collection: 'posts' as const, path: 'blog', changeFrequency: 'weekly', priority: '0.7' },
  { rangeStart: 2000, collection: 'treatments' as const, path: 'treatments', changeFrequency: 'monthly', priority: '0.8' },
  { rangeStart: 3000, collection: 'locations' as const, path: 'locations', changeFrequency: 'monthly', priority: '0.7' },
  { rangeStart: 4000, collection: 'pages' as const, path: '', changeFrequency: 'monthly', priority: '0.7' },
]

function buildUrlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function buildStaticSitemap(baseUrl: string): string {
  const now = new Date().toISOString()
  const entries = [
    buildUrlEntry(baseUrl, now, 'weekly', '1.0'),
    buildUrlEntry(`${baseUrl}/about-us`, now, 'monthly', '0.8'),
    buildUrlEntry(`${baseUrl}/our-services`, now, 'monthly', '0.8'),
    buildUrlEntry(`${baseUrl}/clinics`, now, 'weekly', '0.7'),
    buildUrlEntry(`${baseUrl}/blog`, now, 'daily', '0.7'),
    buildUrlEntry(`${baseUrl}/contact-us`, now, 'monthly', '0.6'),
    buildUrlEntry(`${baseUrl}/privacy-policy`, now, 'yearly', '0.3'),
    buildUrlEntry(`${baseUrl}/terms-of-service`, now, 'yearly', '0.3'),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const BASE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const { id } = await params
  const numId = Number(id)

  if (isNaN(numId)) {
    return new NextResponse('Not found', { status: 404 })
  }

  // Static routes
  if (numId === 0) {
    return new NextResponse(buildStaticSitemap(BASE_URL), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }

  // Find which collection this id belongs to
  const col = COLLECTIONS.find((c) => numId >= c.rangeStart && numId < c.rangeStart + 1000)
  if (!col) {
    return new NextResponse('Not found', { status: 404 })
  }

  const pageIndex = numId - col.rangeStart
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: col.collection,
    where: { status: { equals: 'published' } },
    limit: PAGE_SIZE,
    page: pageIndex + 1,
    select: { slug: true, updatedAt: true },
  })

  const prefix = col.path ? `${BASE_URL}/${col.path}` : BASE_URL

  const entries = result.docs
    .filter((doc) => doc.slug)
    .map((doc) =>
      buildUrlEntry(
        `${prefix}/${doc.slug}`,
        new Date(doc.updatedAt as string).toISOString(),
        col.changeFrequency,
        col.priority,
      ),
    )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
