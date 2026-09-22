'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, User, Calendar } from 'lucide-react'
import styles from './BlogPost.module.css'
import RichText from './RichText'

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const BlogPostClient = ({ post }) => {
  if (!post) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.notFoundTitle}>Post not found</h1>
            <p className={styles.notFoundText}>
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog" className={styles.notFoundLink}>
              <ArrowLeft size={18} /> Back to Blog
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <motion.header
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <div className={styles.meta}>
          {post.publishedDate && (
            <span className={styles.date}>
              <Calendar size={14} style={{ marginRight: 6, opacity: 0.7 }} />
              {formatDate(post.publishedDate)}
            </span>
          )}
          {post.categories && post.categories[0] && (
            <span className={styles.category}>{post.categories[0]}</span>
          )}
        </div>

        <h1 className={styles.title}>{post.title}</h1>

        {post.excerpt && (
          <p className={styles.excerpt}>{post.excerpt}</p>
        )}

        {post.author && (
          <div className={styles.authorRow}>
            <div className={styles.authorAvatar}>
              <User size={24} />
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorLabel}>Written by</span>
              <span className={styles.authorName}>{post.author.name}</span>
            </div>
          </div>
        )}
      </motion.header>

      {/* Hero Image */}
      {post.heroImage && (
        <motion.div
          className={styles.heroImage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.heroImageInner}>
            <img src={post.heroImage} alt={post.title} />
          </div>
        </motion.div>
      )}

      {/* Content */}
      <motion.article
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <RichText content={post.content} />
      </motion.article>

      {/* Footer CTA */}
      <motion.div
        className={styles.footerCta}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.footerCtaInner}>
          <h3 className={styles.footerCtaTitle}>Ready to start your dental journey?</h3>
          <p className={styles.footerCtaText}>
            Get a free consultation and personalized treatment plan from our expert team.
          </p>
          <a
            href="https://app.atidinricare.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerCtaButton}
          >
            Book Free Consultation <ArrowRight size={18} />
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default BlogPostClient
