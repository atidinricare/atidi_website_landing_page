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
    const locId = (typeof clinic.location === 'object' && clinic.location !== null) ? (clinic.location as any).id : clinic.location
    if (locId && !clinicsByLocation[locId]) clinicsByLocation[locId] = []
    if (locId) clinicsByLocation[locId].push(clinic)
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

function resolveClinicCity(clinic: any): string {
  if (clinic.city && typeof clinic.city === 'string' && clinic.city.trim()) {
    return clinic.city.trim()
  }
  if (typeof clinic.location === 'object' && clinic.location !== null && clinic.location.city) {
    return String(clinic.location.city).trim()
  }
  const text = `${clinic.name || ''} ${clinic.address || ''}`
  const knownCities = [
    'Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Kochi', 'Vijayawada',
    'Visakhapatnam', 'Coimbatore', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh',
    'Trivandrum', 'Goa', 'Madurai', 'Mysore', 'Guntur', 'Warangal', 'Nellore', 'Tirupati'
  ]
  for (const city of knownCities) {
    if (new RegExp(`\\b${city}\\b`, 'i').test(text)) {
      return city
    }
  }
  return ''
}

/**
 * Get all clinics from Payload CMS via Local API.
 * Fetches clinic documents directly from the clinics collection in KTree CMS.
 * Does not require or link to the locations collection.
 */
export async function getClinics() {
  const payload = await getPayload({ config })

  // Query published clinics first
  let result = await payload.find({
    collection: 'clinics',
    where: { status: { equals: 'published' } },
    depth: 2,
    limit: 200,
    sort: 'name',
  })

  // If none returned with published filter, retrieve all clinics
  if (result.docs.length === 0) {
    result = await payload.find({
      collection: 'clinics',
      depth: 2,
      limit: 200,
      sort: 'name',
    })
  }

  // If database collection has records, map and return them
  if (result.docs.length > 0) {
    return result.docs.map((clinic: any) => {
      const city = resolveClinicCity(clinic)
      const state =
        clinic.state ||
        (typeof clinic.location === 'object' && clinic.location !== null ? clinic.location.state : '') ||
        ''

      return {
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone || '',
        specialties: (clinic.specialties || [])
          .map((s: any) => (typeof s === 'object' && s !== null ? s.specialty || '' : s))
          .filter(Boolean),
        rating: clinic.rating || null,
        reviewCount: clinic.reviewCount || null,
        city,
        state,
      }
    })
  }

  // Fallback: If clinics collection has no documents, use seed data
  const { indiaLocationsData } = await import('@/seed/locations-data')
  const fallbackList: any[] = []
  indiaLocationsData.forEach((loc) => {
    (loc.clinics || []).forEach((c, idx) => {
      fallbackList.push({
        id: `${loc.id}-${idx}`,
        name: c.name,
        address: c.address,
        phone: c.phone || '',
        specialties: c.specialties || [],
        rating: c.rating || null,
        reviewCount: c.reviewCount || null,
        city: loc.city,
        state: loc.state,
      })
    })
  })
  return fallbackList
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
export async function getPageBySlug(slug: string, options?: { draft?: boolean }) {
  const payload = await getPayload({ config })

  // Support both 'clinics' and 'our-clinics' interchangeably
  const effectiveSlug = slug === 'our-clinics' ? 'clinics' : slug

  // In development, also check draft versions so CMS edits show immediately without requiring Publish
  const isDev = process.env.NODE_ENV === 'development'
  const shouldFetchDraft = options?.draft ?? isDev

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: effectiveSlug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
    draft: shouldFetchDraft,
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
