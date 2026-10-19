import { getPageBySlug } from '@/lib/data'
import PrivacyPolicyClient from '@/components/PrivacyPolicyClient'

// Force dynamic rendering so edits in CMS immediately reflect on page reload
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getPageBySlug('privacy-policy')
  const meta = (page as any)?.meta || {}

  return {
    title: meta.title || 'Privacy Policy - Atidi NRI Care',
    description:
      meta.description ||
      'Read the Atidi NRI Care privacy policy. Understand how we collect, use, and protect your personal information.',
    openGraph: {
      title: meta.title || 'Privacy Policy - Atidi NRI Care',
      description: meta.description || 'Read the Atidi NRI Care privacy policy.',
    },
    alternates: { canonical: '/privacy-policy' },
  }
}

function parsePrivacyPage(page: any) {
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

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug('privacy-policy')
  const data = parsePrivacyPage(page)

  return <PrivacyPolicyClient data={data} />
}
