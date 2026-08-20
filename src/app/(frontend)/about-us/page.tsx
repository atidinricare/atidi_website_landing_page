import AboutUsClient from '@/components/AboutUsClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export const metadata = {
  title: 'About Us - Atidi NRI Care',
  description: 'Learn about Atidi NRI Care and our mission to provide world-class dental care for NRIs at a fraction of US costs.',
  keywords: 'about Atidi NRI Care, dental tourism India, NRI dental care, dental care mission',
  openGraph: {
    title: 'About Us - Atidi NRI Care',
    description: 'Learn about Atidi NRI Care and our mission to provide world-class dental care for NRIs at a fraction of US costs.',
  },
  alternates: { canonical: '/about-us' },
}

export default function AboutUsPage() {
  return <AboutUsClient />
}
