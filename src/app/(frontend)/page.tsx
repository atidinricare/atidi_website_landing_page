import {
  getTreatments,
  getLocations,
  getFAQs,
  getTestimonials,
  getHeroContent,
  getSiteSettings,
  getPageBySlug,
} from '@/lib/data'
import HomePageClient from '@/components/HomePageClient'
import JsonLd from '@/components/JsonLd'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

// Site-wide defaults from the root layout, used when the CMS record leaves a
// field empty so the homepage is never worse off than before.
const FALLBACK_TITLE = 'Atidi NRI Care - Premium Dental Care for NRIs'
const FALLBACK_DESCRIPTION =
  'Premium dental tourism for NRIs - Save up to 80% on world-class dental care in India with seamless follow-up in the USA.'
// Page metadata replaces the layout's rather than merging with it, so without
// this an empty CMS field would strip the keywords the homepage already had.
const FALLBACK_KEYWORDS =
  'NRI dental care, dental tourism India, affordable dental treatment, NRI dentist'

/**
 * The homepage renders its own components rather than the Pages blocks, but the
 * "home" record in Pages still carries the SEO tab -- it was simply never read,
 * so the homepage could not be given a title, description, keywords or
 * structured data from the admin. Pull its meta in here.
 */
export async function generateMetadata() {
  const home = (await getPageBySlug('home')) as any
  const meta = home?.meta || {}

  const title = meta.title || FALLBACK_TITLE
  const description = meta.description || FALLBACK_DESCRIPTION
  const imageUrl = typeof meta.image === 'object' && meta.image !== null ? meta.image.url : undefined

  return {
    title,
    description,
    keywords: meta.keywords || FALLBACK_KEYWORDS,
    openGraph: {
      title,
      description,
      siteName: 'Atidi NRI Care',
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    alternates: { canonical: '/' },
  }
}

export default async function HomePage() {
  const [treatments, locations, faqs, testimonials, heroContent, siteSettings, home] =
    await Promise.all([
      getTreatments(),
      getLocations(),
      getFAQs(),
      getTestimonials(),
      getHeroContent(),
      getSiteSettings(),
      getPageBySlug('home'),
    ])

  return (
    <>
      <JsonLd data={(home as any)?.meta?.schema} />
      <HomePageClient
        featuredTreatments={treatments.all}
        allTreatments={treatments.all}
        indiaLocations={locations.india}
        usLocations={locations.us}
        allLocations={locations.all}
        faqs={faqs}
        testimonials={testimonials}
        heroContent={heroContent}
        siteSettings={siteSettings}
      />
    </>
  )
}
