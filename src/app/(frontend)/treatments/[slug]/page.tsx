import { notFound } from 'next/navigation'
import { getTreatmentBySlug, getTreatments } from '@/lib/data'
import TreatmentPageClient from '@/components/TreatmentPageClient'

export const revalidate = false

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const treatment = await getTreatmentBySlug(slug)

  if (!treatment) {
    return {
      title: 'Treatment Not Found - Atidi NRI Care',
    }
  }

  const title = treatment.meta?.title || `${treatment.name} - Atidi NRI Care`
  const description = treatment.meta?.description || treatment.tagline || `Learn about ${treatment.name} at Atidi NRI Care.`
  const imageUrl = treatment.meta?.image?.url || treatment.image || undefined

  return {
    title,
    description,
    keywords: treatment.meta?.keywords || undefined,
    openGraph: {
      title,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    alternates: { canonical: `/treatments/${slug}` },
  }
}

export async function generateStaticParams() {
  try {
    const { all } = await getTreatments()
    return all.map((treatment: any) => ({
      slug: treatment.id,
    }))
  } catch {
    return []
  }
}

export default async function TreatmentPage({ params }: PageProps) {
  const { slug } = await params
  const treatment = await getTreatmentBySlug(slug)

  if (!treatment) {
    notFound()
  }

  return <TreatmentPageClient treatment={treatment} />
}
