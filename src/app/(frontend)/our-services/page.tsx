import OurServicesClient from '@/components/OurServicesClient'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'

export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata('our-services', {
    title: 'Our Services - Atidi NRI Care',
    description: 'Explore Atidi NRI Care services: 24/7 tele support, fast US appointments, vetted Indian clinics, and 360-degree dental care for NRIs.',
    keywords: 'NRI dental services, tele dental support, US dental appointments, dental clinic India, 360 dental care',
    canonical: '/our-services',
  })
}

export default async function OurServicesPage() {
  const schema = await getPageSchema('our-services')

  return (
    <>
      <JsonLd data={schema} />
      <OurServicesClient />
    </>
  )
}
