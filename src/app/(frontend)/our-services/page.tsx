import { getPageBySlug } from '@/lib/data'
import OurServicesClient from '@/components/OurServicesClient'

// Force dynamic rendering so edits in CMS immediately reflect on page reload
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getPageBySlug('our-services')
  const meta = (page as any)?.meta || {}

  return {
    title: meta.title || 'Our Services - Atidi NRI Care',
    description:
      meta.description ||
      'Explore Atidi NRI Care services: 24/7 tele support, fast US appointments, vetted Indian clinics, and 360-degree dental care for NRIs.',
    keywords:
      meta.keywords ||
      'NRI dental services, tele dental support, US dental appointments, dental clinic India, 360 dental care',
    openGraph: {
      title: meta.title || 'Our Services - Atidi NRI Care',
      description:
        meta.description ||
        'Explore Atidi NRI Care services: 24/7 tele support, fast US appointments, vetted Indian clinics, and 360-degree dental care for NRIs.',
    },
    alternates: { canonical: '/our-services' },
  }
}

function parseServicesPage(page: any) {
  if (!page || !Array.isArray(page.layout)) return null

  const heroBlock = page.layout.find((b: any) => b.blockType === 'hero')
  const richBlocks = page.layout.filter((b: any) => b.blockType === 'richContent')
  const highlightBlock = page.layout.find((b: any) => b.blockType === 'highlight')
  const principlesBlock = page.layout.find((b: any) => b.blockType === 'principlesList')
  const statsBlock = page.layout.find((b: any) => b.blockType === 'statsGrid')
  const ctaBlock = page.layout.find((b: any) => b.blockType === 'ctaBlock')

  return {
    hero: {
      eyebrow: heroBlock?.eyebrow,
      headline: heroBlock?.headline,
      subheadline: heroBlock?.subheadline,
    },
    service1: {
      title: richBlocks[0]?.heading,
      content: richBlocks[0]?.content,
    },
    service2: {
      title: richBlocks[1]?.heading,
      content: richBlocks[1]?.content,
    },
    accent: {
      text: highlightBlock?.text,
    },
    service3: {
      title: richBlocks[2]?.heading,
      content: richBlocks[2]?.content,
    },
    steps: principlesBlock?.items,
    service4: {
      title: richBlocks[3]?.heading,
      content: richBlocks[3]?.content,
    },
    stats: statsBlock?.stats,
    closing: {
      title: ctaBlock?.heading,
      buttonLabel: ctaBlock?.button?.label,
      buttonLink: ctaBlock?.button?.link,
    },
  }
}

export default async function OurServicesPage() {
  const page = await getPageBySlug('our-services')
  const data = parseServicesPage(page)

  return <OurServicesClient data={data as any} />
}
