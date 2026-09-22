import { notFound } from 'next/navigation'
import {
  getPageBySlug,
  getPageSlugs,
  getTreatments,
  getLocations,
  getFAQs,
} from '@/lib/data'
import PageBlocks from '@/components/PageBlocks'

export const revalidate = false

// A slug with no published page 404s rather than rendering an empty shell.
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return { title: 'Page Not Found - Atidi NRI Care' }
  }

  const meta = (page as any).meta || {}
  const title = meta.title || `${(page as any).title} - Atidi NRI Care`
  const description = meta.description || undefined

  return {
    title,
    description,
    keywords: meta.keywords || undefined,
    openGraph: {
      title,
      description,
      ...(meta.image?.url ? { images: [{ url: meta.image.url }] } : {}),
    },
    alternates: { canonical: `/${slug}` },
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getPageSlugs()
    return slugs.map((slug: string) => ({ slug }))
  } catch {
    return []
  }
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const layout = ((page as any).layout || []) as any[]
  const blockTypes = new Set(layout.map((block) => block.blockType))

  // Only pay for the collections this page's blocks actually reference.
  const [treatments, locations, faqs] = await Promise.all([
    blockTypes.has('treatmentsBlock') ? getTreatments() : Promise.resolve(null),
    blockTypes.has('locationsBlock') ? getLocations() : Promise.resolve(null),
    blockTypes.has('faqBlock') ? getFAQs() : Promise.resolve(null),
  ])

  return (
    <main>
      <PageBlocks
        layout={layout}
        treatments={treatments?.all ?? []}
        locations={locations?.all ?? []}
        faqs={faqs ?? []}
      />
    </main>
  )
}
