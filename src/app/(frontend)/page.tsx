import {
  getTreatments,
  getLocations,
  getFAQs,
  getTestimonials,
  getSiteSettings,
  getPageBySlug,
} from '@/lib/data'
import HomePageClient from '@/components/HomePageClient'

// Force dynamic rendering so edits in CMS immediately reflect on page reload
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [homePage, treatments, locations, faqs, testimonials, siteSettings] =
    await Promise.all([
      getPageBySlug('home'),
      getTreatments(),
      getLocations(),
      getFAQs(),
      getTestimonials(),
      getSiteSettings(),
    ])

  const heroBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'hero'
  )

  const statsGridBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'statsGrid'
  )

  let heroContent: any = null
  if (heroBlock) {
    let backgroundImage = ''
    if (typeof heroBlock.backgroundImage === 'object' && heroBlock.backgroundImage !== null && heroBlock.backgroundImage.url) {
      backgroundImage = heroBlock.backgroundImage.url
    } else if (typeof heroBlock.backgroundImage === 'string') {
      backgroundImage = heroBlock.backgroundImage
    }

    const rawStats = Array.isArray(heroBlock.stats) && heroBlock.stats.length > 0
      ? heroBlock.stats
      : Array.isArray(statsGridBlock?.stats) && statsGridBlock.stats.length > 0
        ? statsGridBlock.stats
        : []

    heroContent = {
      headline: heroBlock.headline,
      subheadline: heroBlock.subheadline,
      ctaPrimary: heroBlock.ctaPrimary || { label: 'Book an Appointment', link: 'https://app.atidinricare.com/' },
      ctaSecondary: heroBlock.ctaSecondary || { label: 'Watch Our Story', link: '' },
      stats: rawStats.map((stat: any) => ({
        value: stat.value,
        label: stat.label,
        prefix: stat.prefix || '',
        suffix: stat.suffix || '',
      })),
      backgroundImage,
    }
  }

  const treatmentsBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'treatmentsBlock'
  )

  const locationsBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'locationsBlock'
  )

  const testimonialsBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'testimonialsBlock'
  )

  const trustBannerBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'trustBanner'
  )

  const howItWorksBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'howItWorksBlock' || b.blockType === 'processBlock'
  )

  const faqBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'faqBlock'
  )

  const ctaBlock: any = (homePage?.layout || []).find(
    (b: any) => b.blockType === 'ctaBlock'
  )

  if (ctaBlock && Array.isArray(ctaBlock.screens)) {
    ctaBlock.screens = ctaBlock.screens
      .map((s: any, idx: number) => {
        let imageUrl = ''
        if (typeof s.image === 'object' && s.image !== null && s.image.url) {
          imageUrl = s.image.url
        } else if (typeof s.image === 'string') {
          imageUrl = s.image
        } else if (s.imageUrl) {
          imageUrl = s.imageUrl
        }
        return {
          id: s.id || idx + 1,
          image: imageUrl,
          imageUrl,
          label: s.label || String(idx + 1).padStart(2, '0'),
          caption: s.caption || '',
        }
      })
      .filter((s: any) => Boolean(s.image || s.imageUrl))
  }

  const displayedTreatments =
    treatmentsBlock?.showFeaturedOnly && treatments.featured?.length > 0
      ? treatments.featured
      : treatments.all

  const displayedTestimonials =
    testimonialsBlock?.showFeaturedOnly
      ? testimonials.filter((t: any) => t.featured)
      : testimonials

  return (
    <HomePageClient
      featuredTreatments={displayedTreatments}
      allTreatments={treatments.all}
      indiaLocations={locations.india}
      usLocations={locations.us}
      allLocations={locations.all}
      faqs={faqs}
      testimonials={displayedTestimonials}
      heroContent={heroContent}
      siteSettings={siteSettings}
      treatmentsHeader={treatmentsBlock}
      locationsHeader={locationsBlock}
      testimonialsHeader={testimonialsBlock}
      ctaBlock={ctaBlock}
      trustBanner={trustBannerBlock}
      howItWorks={howItWorksBlock}
      faqBlock={faqBlock}
    />
  )
}

