'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, User, Calendar } from 'lucide-react'
import styles from './BlogPost.module.css'

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Simple rich text renderer for Payload's Lexical content
const RichTextRenderer = ({ content }) => {
  if (!content || !content.root) {
    return null
  }

  const renderNode = (node, index) => {
    if (!node) return null

    // Handle text nodes
    if (node.type === 'text') {
      let text = node.text || ''
      if (node.format) {
        if (node.format & 1) text = <strong key={index}>{text}</strong>
        if (node.format & 2) text = <em key={index}>{text}</em>
        if (node.format & 8) text = <u key={index}>{text}</u>
        if (node.format & 16) text = <code key={index}>{text}</code>
      }
      return text
    }

    // Handle element nodes
    const children = node.children?.map((child, i) => renderNode(child, i)) || []

    switch (node.type) {
      case 'paragraph':
        return <p key={index}>{children}</p>
      case 'heading':
        const HeadingTag = `h${node.tag || 2}`
        return <HeadingTag key={index}>{children}</HeadingTag>
      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        return <ListTag key={index}>{children}</ListTag>
      case 'listitem':
        return <li key={index}>{children}</li>
      case 'quote':
        return <blockquote key={index}>{children}</blockquote>
      case 'link':
        return (
          <a key={index} href={node.fields?.url || '#'} target={node.fields?.newTab ? '_blank' : undefined}>
            {children}
          </a>
        )
      case 'horizontalrule':
        return <hr key={index} />
      case 'upload':
        if (node.value?.url) {
          return <img key={index} src={node.value.url} alt={node.value.alt || ''} />
        }
        return null
      default:
        // For root and other containers, just render children
        if (children.length > 0) {
          return <>{children}</>
        }
        return null
    }
  }

  return <>{renderNode(content.root)}</>
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
        <RichTextRenderer content={post.content} />
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
