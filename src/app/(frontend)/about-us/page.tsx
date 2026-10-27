import AboutUsClient from '@/components/AboutUsClient'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata('about-us', {
    title: 'About Us - Atidi NRI Care',
    description: 'Learn about Atidi NRI Care and our mission to provide world-class dental care for NRIs at a fraction of US costs.',
    keywords: 'about Atidi NRI Care, dental tourism India, NRI dental care, dental care mission',
    canonical: '/about-us',
  })
}

export default async function AboutUsPage() {
  const schema = await getPageSchema('about-us')

  return (
    <>
      <JsonLd data={schema} />
      <AboutUsClient />
    </>
  )
}
