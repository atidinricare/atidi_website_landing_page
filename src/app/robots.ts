import type { MetadataRoute } from 'next'

function getValidBaseUrl(url?: string): string {
  if (!url || typeof url !== 'string') return 'http://localhost:3000'
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      return new URL(trimmed).origin
    } catch {
      // fallback
    }
  }
  return 'http://localhost:3000'
}

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    getValidBaseUrl(process.env.SITE_URL) !== 'http://localhost:3000'
      ? getValidBaseUrl(process.env.SITE_URL)
      : getValidBaseUrl(process.env.NEXT_PUBLIC_SERVER_URL)
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
