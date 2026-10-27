import { getPageBySlug } from './data'

type Fallback = {
  title: string
  description: string
  keywords?: string
  canonical: string
}

/**
 * Builds Next metadata for a route that renders its own components but whose
 * SEO should be editable in the CMS.
 *
 * These pages are coded rather than built from Pages blocks, so only the SEO
 * tab of the matching Pages record is used. Anything left empty in the CMS --
 * or a missing record entirely -- falls back to the values the route shipped
 * with, so a page is never left worse off than before.
 *
 * Next replaces layout metadata rather than merging it, which is why the
 * fallbacks must be passed explicitly rather than relying on the root layout.
 */
export async function buildPageMetadata(slug: string, fallback: Fallback) {
  let meta: any = {}

  try {
    const doc = (await getPageBySlug(slug)) as any
    meta = doc?.meta || {}
  } catch {
    // A CMS lookup must never take a static page down.
    meta = {}
  }

  const title = meta.title || fallback.title
  const description = meta.description || fallback.description
  const imageUrl =
    typeof meta.image === 'object' && meta.image !== null ? meta.image.url : undefined

  return {
    title,
    description,
    keywords: meta.keywords || fallback.keywords || undefined,
    openGraph: {
      title,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    alternates: { canonical: fallback.canonical },
  }
}

/** The structured data for a coded page, or undefined when none is set. */
export async function getPageSchema(slug: string): Promise<unknown> {
  try {
    const doc = (await getPageBySlug(slug)) as any
    return doc?.meta?.schema
  } catch {
    return undefined
  }
}
