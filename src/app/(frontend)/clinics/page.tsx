import { getLocations } from '@/lib/data'
import ClinicsPageClient from '@/components/ClinicsPageClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export const metadata = {
  title: 'Our Clinics - Atidi NRI Care',
  description: 'Explore Atidi NRI Care partner clinics across India and the USA. World-class dental facilities with JCI-accredited standards.',
  keywords: 'NRI dental clinics, dental clinics India, dental clinics USA, Atidi partner clinics',
  openGraph: {
    title: 'Our Clinics - Atidi NRI Care',
    description: 'Explore Atidi NRI Care partner clinics across India and the USA. World-class dental facilities with JCI-accredited standards.',
  },
  alternates: { canonical: '/clinics' },
}

export default async function ClinicsPage() {
  const locations = await getLocations()

  return (
    <ClinicsPageClient
      indiaLocations={locations.india}
      usLocations={locations.us}
    />
  )
}
