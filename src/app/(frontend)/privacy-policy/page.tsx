import PrivacyPolicyClient from '@/components/PrivacyPolicyClient'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata('privacy-policy', {
    title: 'Privacy Policy - Atidi NRI Care',
    description: 'Read the Atidi NRI Care privacy policy. Understand how we collect, use, and protect your personal information.',
    canonical: '/privacy-policy',
  })
}

export default async function PrivacyPolicyPage() {
  const schema = await getPageSchema('privacy-policy')

  return (
    <>
      <JsonLd data={schema} />
      <PrivacyPolicyClient />
    </>
  )
}
