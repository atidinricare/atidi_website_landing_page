import { getTreatments, getLocations, getFAQs, getHeroContent, getSiteSettings } from '@/lib/data'
import HomePageClient from '@/components/HomePageClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export default async function HomePage() {
  const [treatments, locations, faqs, heroContent, siteSettings] = await Promise.all([
    getTreatments(),
    getLocations(),
    getFAQs(),
    getHeroContent(),
    getSiteSettings(),
  ])

  return (
    <HomePageClient
      featuredTreatments={treatments.all}
      allTreatments={treatments.all}
      indiaLocations={locations.india}
      usLocations={locations.us}
      allLocations={locations.all}
      faqs={faqs}
      heroContent={heroContent}
      siteSettings={siteSettings}
    />
  )
}
