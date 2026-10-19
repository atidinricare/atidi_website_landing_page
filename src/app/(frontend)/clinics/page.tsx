import { getClinics, getPageBySlug } from '@/lib/data'
import ClinicsPageClient from '@/components/ClinicsPageClient'

// Force dynamic rendering so CMS clinic updates appear immediately
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getPageBySlug('clinics')
  const meta = (page as any)?.meta || {}

  return {
    title: meta.title || 'Our Partner Clinics - Atidi NRI Care',
    description:
      meta.description ||
      'Explore Atidi NRI Care vetted partner dental hospitals and clinics across India. MDS specialists with international standards.',
    keywords:
      meta.keywords ||
      'NRI dental clinics, partner dental hospitals, dental clinics India, vetted dentists India',
    openGraph: {
      title: meta.title || 'Our Partner Clinics - Atidi NRI Care',
      description:
        meta.description ||
        'Explore Atidi NRI Care vetted partner dental hospitals and clinics across India.',
    },
    alternates: { canonical: '/clinics' },
  }
}

export default async function ClinicsPage() {
  const clinics = await getClinics()

  return <ClinicsPageClient clinics={clinics as any} />
}

