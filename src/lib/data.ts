import { getPayload } from 'payload'
import config from '@payload-config'
import { adaptTreatment, adaptLocation, adaptFAQ, adaptTestimonial } from './adapters'

/**
 * Get all treatments from Payload CMS via Local API.
 * Returns both all treatments and featured-only.
 */
export async function getTreatments() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'treatments',
    where: { status: { equals: 'published' } },
    depth: 2,
    limit: 100,
    // Show treatments with a dedicated detail page (opensInNewTab=true) first,
    // then the rest alphabetically.
    sort: ['-opensInNewTab', 'name'],
  })

  const all = result.docs.map(adaptTreatment)
  const featured = all.filter((t: any) => t.featured)

  return { all, featured }
}

/**
 * Get a single treatment by slug from Payload CMS via Local API.
 */
export async function getTreatmentBySlug(slug: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'treatments',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  if (result.docs.length === 0) return null

  return adaptTreatment(result.docs[0])
}

/**
 * Get all locations from Payload CMS via Local API.
 * Fetches India locations, USA locations, and clinics in parallel.
 * Merges clinics into India locations.
 */
export async function getLocations() {
  const payload = await getPayload({ config })

  const [indiaResult, usResult, clinicsResult] = await Promise.all([
    payload.find({
      collection: 'locations',
      where: { country: { equals: 'India' } },
      limit: 100,
      sort: 'city',
    }),
    payload.find({
      collection: 'locations',
      where: { country: { equals: 'USA' } },
      limit: 100,
      sort: 'city',
    }),
    payload.find({
      collection: 'clinics',
      limit: 200,
      depth: 0,
    }),
  ])

  // Group clinics by location ID
  const clinicsByLocation: Record<string | number, any[]> = {}
  for (const clinic of clinicsResult.docs) {
    const locId = typeof clinic.location === 'object' ? clinic.location.id : clinic.location
    if (!clinicsByLocation[locId]) clinicsByLocation[locId] = []
    clinicsByLocation[locId].push(clinic)
  }

  const india = indiaResult.docs.map((doc) =>
    adaptLocation(doc, clinicsByLocation[doc.id as string | number] || [])
  )
  const us = usResult.docs.map((doc) => adaptLocation(doc))

  return { india, us, all: [...india, ...us] }
}

/**
 * Get a single location by slug from Payload CMS via Local API.
 * For India (treatment) locations, also fetches and merges associated clinics.
 */
export async function getLocationBySlug(slug: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (result.docs.length === 0) return null

  const doc = result.docs[0]

  let clinics: any[] = []
  if (doc.type === 'treatment') {
    const clinicsResult = await payload.find({
      collection: 'clinics',
      where: { location: { equals: doc.id } },
      limit: 50,
      depth: 0,
    })
    clinics = clinicsResult.docs
  }

  return adaptLocation(doc, clinics)
}

/**
 * Get all FAQs from Payload CMS via Local API.
 */
export async function getFAQs() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'faqs',
    sort: 'order',
    limit: 50,
  })

  return result.docs.map(adaptFAQ)
}

/**
 * Get all published blog posts from Payload CMS via Local API.
 */
export async function getPosts() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 2,
    limit: 100,
  })

  return result.docs.map((doc: any) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt || '',
    publishedDate: doc.publishedDate,
    heroImage: typeof doc.heroImage === 'object' ? doc.heroImage?.url : null,
    author: typeof doc.author === 'object' ? doc.author?.name || doc.author?.email : null,
    categories: (doc.categories || []).map((cat: any) =>
      typeof cat === 'object' ? cat.name : cat
    ),
  }))
}

/**
 * Get a single blog post by slug from Payload CMS via Local API.
 */
export async function getPostBySlug(slug: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  if (result.docs.length === 0) return null

  const doc = result.docs[0]
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt || '',
    content: doc.content,
    publishedDate: doc.publishedDate,
    heroImage: typeof doc.heroImage === 'object' ? doc.heroImage?.url : null,
    author: typeof doc.author === 'object' ? {
      name: (doc.author as any)?.name || doc.author?.email,
      email: doc.author?.email,
    } : null,
    categories: (doc.categories || []).map((cat: any) =>
      typeof cat === 'object' ? cat.name : cat
    ),
    meta: doc.meta || null,
  }
}

/**
 * Get Hero Content global from Payload CMS via Local API.
 */
export async function getHeroContent() {
  const payload = await getPayload({ config })

  const result = await payload.findGlobal({
    slug: 'hero-content',
    depth: 1,
  })

  return {
    headline: result.headline || '',
    subheadline: result.subheadline || '',
    ctaPrimary: {
      label: result.ctaPrimary?.label || 'Book an Appointment',
      link: result.ctaPrimary?.link || 'https://app.atidinricare.com/',
    },
    ctaSecondary: {
      label: result.ctaSecondary?.label || 'Watch Our Story',
      link: result.ctaSecondary?.link || '',
    },
    stats: (result.stats || []).map((stat: any) => ({
      value: stat.value,
      label: stat.label,
      prefix: stat.prefix || '',
      suffix: stat.suffix || '',
    })),
    backgroundImage: typeof result.backgroundImage === 'object' ? result.backgroundImage?.url : null,
  }
}

/**
 * Get Site Settings global from Payload CMS via Local API.
 */
export async function getSiteSettings() {
  const payload = await getPayload({ config })

  const result = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  return {
    siteName: result.siteName || 'Atidi NRI Care',
    siteDescription: result.siteDescription || '',
    logo: typeof result.logo === 'object' ? result.logo?.url : null,
    favicon: typeof result.favicon === 'object' ? result.favicon?.url : null,
    contactEmail: result.contactEmail || '',
    contactPhone: result.contactPhone || '',
    whatsappNumber: result.whatsappNumber || '',
    socialLinks: {
      facebook: result.socialLinks?.facebook || '',
      instagram: result.socialLinks?.instagram || '',
      youtube: result.socialLinks?.youtube || '',
      linkedin: result.socialLinks?.linkedin || '',
    },
    announcement: {
      enabled: result.announcement?.enabled || false,
      text: result.announcement?.text || '',
      link: result.announcement?.link || '',
    },
    assetBaseUrl: (result as any).storageSettings?.s3?.assetBaseUrl || '',
  }
}

/**
 * Get Footer global from Payload CMS via Local API.
 */
export async function getFooter() {
  const payload = await getPayload({ config })

  const result = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
  })

  return {
    tagline: result.tagline || '',
    columns: (result.columns || []).map((col: any) => ({
      title: col.title,
      links: (col.links || []).map((link: any) => ({
        label: link.label,
        url: link.url,
        newTab: link.newTab || false,
      })),
    })),
    bottomText: result.bottomText || '',
    legalLinks: (result.legalLinks || []).map((link: any) => ({
      label: link.label,
      url: link.url,
    })),
  }
}

/**
 * Get Tracking Settings global from Payload CMS via Local API.
 */
export async function getTrackingSettings() {
  const payload = await getPayload({ config })

  const result = await payload.findGlobal({
    slug: 'tracking-settings',
    depth: 0,
  })

  return {
    gtmId: result.gtmId || '',
    ga4Id: result.ga4Id || '',
    facebookPixelId: result.facebookPixelId || '',
    headScripts: result.headScripts || '',
    bodyStartScripts: result.bodyStartScripts || '',
    bodyEndScripts: result.bodyEndScripts || '',
  }
}

/**
 * Get Navigation global from Payload CMS via Local API.
 */
export async function getNavigation() {
  const payload = await getPayload({ config })

  const result = await payload.findGlobal({
    slug: 'navigation',
    depth: 0,
  })

  return {
    mainNav: (result.mainNav || []).map((item: any) => ({
      label: item.label,
      link: item.link || '',
      type: item.type || 'custom',
      children: (item.children || []).map((child: any) => ({
        label: child.label,
        link: child.link,
      })),
    })),
    ctaButton: {
      label: result.ctaButton?.label || 'Book an Appointment',
      link: result.ctaButton?.link || 'https://app.atidinricare.com/',
    },
  }
}

/**
 * Get published testimonials from Payload CMS via Local API.
 * Featured testimonials come first so the home page carousel leads with them.
 */
export async function getTestimonials() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'testimonials',
    where: { status: { equals: 'published' } },
    depth: 1,
    limit: 50,
    sort: ['-featured', 'patientName'],
  })

  return result.docs.map(adaptTestimonial)
}

/**
 * Get a single published page by slug from Payload CMS via Local API.
 * Returns null when no published page matches, so the route can 404.
 */
export async function getPageBySlug(slug: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  return result.docs[0] ?? null
}

/**
 * Slugs of every published page, for generateStaticParams.
 * "home" is excluded — the homepage has its own route.
 */
export async function getPageSlugs() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' } },
    depth: 0,
    limit: 200,
    pagination: false,
  })

  return result.docs
    .map((doc: any) => doc.slug)
    .filter((slug: string) => slug && slug !== 'home')
}
