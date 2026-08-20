import { getPosts } from '@/lib/data'
import BlogPageClient from '@/components/BlogPageClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

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
