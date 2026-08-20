import OurServicesClient from '@/components/OurServicesClient'

export const revalidate = false

export const metadata = {
  title: 'Our Services - Atidi NRI Care',
  description: 'Explore Atidi NRI Care services: 24/7 tele support, fast US appointments, vetted Indian clinics, and 360-degree dental care for NRIs.',
  keywords: 'NRI dental services, tele dental support, US dental appointments, dental clinic India, 360 dental care',
  openGraph: {
    title: 'Our Services - Atidi NRI Care',
    description: 'Explore Atidi NRI Care services: 24/7 tele support, fast US appointments, vetted Indian clinics, and 360-degree dental care for NRIs.',
  },
  alternates: { canonical: '/our-services' },
}

export default function OurServicesPage() {
  return <OurServicesClient />
}
