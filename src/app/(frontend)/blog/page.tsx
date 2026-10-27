import { getPosts } from '@/lib/data'
import BlogPageClient from '@/components/BlogPageClient'

// Force dynamic rendering - fetch posts at request time from CMS
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog - Atidi NRI Care',
  description: 'Expert advice, patient stories, and the latest in dental tourism. Stay informed about treatments, travel tips, and what to expect on your dental journey.',
  openGraph: {
    title: 'Blog - Atidi NRI Care',
    description: 'Expert advice, patient stories, and the latest in dental tourism.',
  },
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const posts = await getPosts()

  return <BlogPageClient posts={posts} />
}
