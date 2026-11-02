
import { getClinics, getPageBySlug } from '@/lib/data'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'
import ClinicsPageClient from '@/components/ClinicsPageClient'

// Force dynamic rendering so CMS clinic updates appear immediately
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
return buildPageMetadata('clinics', {
    title: 'Our Partner Clinics - Atidi NRI Care',
    description:
      'Explore Atidi NRI Care vetted partner dental hospitals and clinics across India. MDS specialists with international standards.',
    keywords:
      'NRI dental clinics, partner dental hospitals, dental clinics India, vetted dentists India',
    canonical: '/clinics',
  })
}

export default async function ClinicsPage() {
   const [clinics, schema] = await Promise.all([
    getClinics(),
    getPageSchema('clinics'),
  ])
   return (
    <>
      <JsonLd data={schema} />
      <ClinicsPageClient clinics={clinics as any} />
    </>
  )
}


