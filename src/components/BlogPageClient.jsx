'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import styles from './BlogPage.module.css'

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const PostCard = ({ post, index, featured = false }) => {
  return (
    <motion.article
      className={`${styles.postCard} ${featured ? styles.featuredPost : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
        <div className={styles.postImageWrapper}>
          {post.heroImage ? (
            <img
              src={post.heroImage}
              alt={post.title}
              className={styles.postImage}
            />
          ) : (
            <div className={styles.postImagePlaceholder}>
              <FileText />
            </div>
          )}
        </div>
        <div className={styles.postContent}>
          <div className={styles.postMeta}>
            {post.publishedDate && (
              <span className={styles.postDate}>{formatDate(post.publishedDate)}</span>
            )}
            {post.categories && post.categories[0] && (
              <span className={styles.postCategory}>{post.categories[0]}</span>
            )}
          </div>
          <h2 className={styles.postTitle}>{post.title}</h2>
          {post.excerpt && (
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          )}
          <span className={styles.postLink}>
            Read Article <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}

const BlogPageClient = ({ posts }) => {
  return (
    <div className={styles.page}>
      {/* Opening */}
      <section className={styles.opening}>
        <motion.div
          className={styles.openingInner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className={styles.openingEyebrow}>Blog</p>
          <h1 className={styles.openingHeadline}>
            Insights & stories from<br />
            <em>dental care experts.</em>
          </h1>
          <p className={styles.openingDescription}>
            Expert advice, patient stories, and the latest in dental tourism.
            Stay informed about treatments, travel tips, and what to expect on your journey.
          </p>
        </motion.div>
      </section>

      {/* Posts Grid */}
      <section className={styles.postsSection}>
        {posts && posts.length > 0 ? (
          <div className={styles.postsGrid}>
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FileText className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>No posts yet</h2>
            <p className={styles.emptyText}>
              We're working on some great content. Check back soon for articles about dental care, travel tips, and patient stories.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default BlogPageClient
