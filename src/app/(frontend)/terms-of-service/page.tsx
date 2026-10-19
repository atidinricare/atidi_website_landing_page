import { getPageBySlug } from '@/lib/data'
import TermsOfServiceClient from '@/components/TermsOfServiceClient'

// Force dynamic rendering so edits in CMS immediately reflect on page reload
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getPageBySlug('terms-of-service')
  const meta = (page as any)?.meta || {}

  return {
    title: meta.title || 'Terms of Service - Atidi NRI Care',
    description:
      meta.description ||
      'Review the Atidi NRI Care terms of service. Understand the conditions governing use of our dental care coordination services.',
    openGraph: {
      title: meta.title || 'Terms of Service - Atidi NRI Care',
      description: meta.description || 'Review the Atidi NRI Care terms of service.',
    },
    alternates: { canonical: '/terms-of-service' },
  }
}

function parseTermsPage(page: any) {
  if (!page || !Array.isArray(page.layout)) return null

  const heroBlock = page.layout.find((b: any) => b.blockType === 'hero')
  const legalBlock = page.layout.find((b: any) => b.blockType === 'legalContent')

  return {
    hero: {
      eyebrow: heroBlock?.eyebrow,
      headline: heroBlock?.headline,
      subheadline: heroBlock?.subheadline,
    },
    sections: Array.isArray(legalBlock?.sections) ? legalBlock.sections : [],
  }
}

export default async function TermsOfServicePage() {
  const page = await getPageBySlug('terms-of-service')
  const data = parseTermsPage(page)

  return <TermsOfServiceClient data={data} />
}
