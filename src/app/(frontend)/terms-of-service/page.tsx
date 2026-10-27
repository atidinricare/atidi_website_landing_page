import TermsOfServiceClient from '@/components/TermsOfServiceClient'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata('terms-of-service', {
    title: 'Terms of Service - Atidi NRI Care',
    description: 'Review the Atidi NRI Care terms of service. Understand the conditions governing use of our dental care coordination services.',
    canonical: '/terms-of-service',
  })
}

export default async function TermsOfServicePage() {
  const schema = await getPageSchema('terms-of-service')

  return (
    <>
      <JsonLd data={schema} />
      <TermsOfServiceClient />
    </>
  )
}
