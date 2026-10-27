import { getLocations } from '@/lib/data'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'
import ClinicsPageClient from '@/components/ClinicsPageClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata('clinics', {
    title: 'Our Clinics - Atidi NRI Care',
    description: 'Explore Atidi NRI Care partner clinics across India and the USA. World-class dental facilities with JCI-accredited standards.',
    keywords: 'NRI dental clinics, dental clinics India, dental clinics USA, Atidi partner clinics',
    canonical: '/clinics',
  })
}

export default async function ClinicsPage() {
  const [locations, schema] = await Promise.all([getLocations(), getPageSchema('clinics')])

  return (
    <>
      <JsonLd data={schema} />
      <ClinicsPageClient
        indiaLocations={locations.india}
        usLocations={locations.us}
      />
    </>
  )
}
