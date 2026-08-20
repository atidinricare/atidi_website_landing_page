import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts } from '@/lib/data'
import BlogPostClient from '@/components/BlogPostClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found - Atidi NRI Care',
    }
  }

  const title = post.meta?.title || `${post.title} - Atidi NRI Care Blog`
  const description = post.meta?.description || post.excerpt || `Read ${post.title} on the Atidi NRI Care blog.`
  const metaImage = post.meta?.image
  const imageUrl = (typeof metaImage === 'object' && metaImage !== null ? metaImage.url : undefined) || post.heroImage || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    alternates: { canonical: `/blog/${slug}` },
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch {
    // Return empty array if database is not available during build
    return []
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} />
}
