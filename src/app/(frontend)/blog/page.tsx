import { getPosts } from '@/lib/data'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'
import BlogPageClient from '@/components/BlogPageClient'

// Force dynamic rendering - fetch posts at request time from CMS
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildPageMetadata('blog', {
    title: 'Blog - Atidi NRI Care',
    description: 'Expert advice, patient stories, and the latest in dental tourism. Stay informed about treatments, travel tips, and what to expect on your dental journey.',
    canonical: '/blog',
  })
}

export default async function BlogPage() {
  const [posts, schema] = await Promise.all([getPosts(), getPageSchema('blog')])

  return (
    <>
      <JsonLd data={schema} />
      <BlogPageClient posts={posts} />
    </>
  )
}
