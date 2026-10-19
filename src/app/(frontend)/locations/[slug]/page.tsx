import { notFound } from 'next/navigation'
import { getLocationBySlug, getLocations } from '@/lib/data'
import LocationPageClient from '@/components/LocationPageClient'

export const revalidate = false

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const location = await getLocationBySlug(slug)

  if (!location) {
    return {
      title: 'Location Not Found - Atidi NRI Care',
    }
  }

  const isIndia = location.type === 'treatment'
  const locationName = location.stateCode
    ? `${location.city}, ${location.stateCode}`
    : location.city

  const title = location.meta?.title || `${locationName} ${isIndia ? 'Dental Care' : 'Follow-up Care'} - Atidi NRI Care`
  const description = location.meta?.description || location.tagline || `Explore ${isIndia ? 'dental treatment' : 'follow-up care'} in ${locationName}.`
  const imageUrl = location.meta?.image?.url || location.image || undefined

  return {
    title,
    description,
    keywords: location.meta?.keywords || undefined,
    openGraph: {
      title,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    alternates: { canonical: `/locations/${slug}` },
  }
}

export async function generateStaticParams() {
  try {
    const { all } = await getLocations()
    return all.map((location: any) => ({
      slug: location.id,
    }))
  } catch {
    return []
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params
  const location = await getLocationBySlug(slug)

  if (!location) {
    notFound()
  }

  return <LocationPageClient location={location} />
}
