import { getPageBySlug } from '@/lib/data'
import AboutUsClient from '@/components/AboutUsClient'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'

// Force dynamic rendering so edits in CMS immediately reflect on page reload
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildPageMetadata('about-us', {
    title: 'About Us - Atidi NRI Care',
    description:
      'Learn about Atidi NRI Care and our mission to provide world-class dental care for NRIs at a fraction of US costs.',
    keywords:
      'about Atidi NRI Care, dental tourism India, NRI dental care, dental care mission',
    canonical: '/about-us',
  })
}


  
  

function parseAboutPage(page: any) {
  if (!page || !Array.isArray(page.layout)) return null

  const richBlocks = page.layout.filter((b: any) => b.blockType === 'richContent')
  const highlightBlock = page.layout.find((b: any) => b.blockType === 'highlight')
  const statsBlock = page.layout.find((b: any) => b.blockType === 'statsGrid')
  const principlesBlock = page.layout.find((b: any) => b.blockType === 'principlesList')
  const ctaBlock = page.layout.find((b: any) => b.blockType === 'ctaBlock')

  return {
    opening: {
      eyebrow: richBlocks[0]?.eyebrow,
      headline: richBlocks[0]?.heading,
    },
    narrative: {
      marker: richBlocks[1]?.sidebarLabel || richBlocks[1]?.heading || 'The problem',
      content: richBlocks[1]?.content,
    },
    turn: {
      text: highlightBlock?.text,
    },
    approach: {
      title: richBlocks[2]?.heading,
      content: richBlocks[2]?.content,
    },
    stats: statsBlock?.stats,
    principles: {
      heading: principlesBlock?.heading,
      items: principlesBlock?.items,
    },
    closing: {
      title: ctaBlock?.heading,
      ctaLabel: ctaBlock?.button?.label,
      ctaLink: ctaBlock?.button?.link,
    },
  }
}

export default async function AboutUsPage() {
  const page = await getPageBySlug('about-us')
  const data = parseAboutPage(page)
  const schema = (page as any)?.meta?.schema
   return (
    <>
      <JsonLd data={schema} />
      <AboutUsClient data={data as any} />
    </>
  )
}


