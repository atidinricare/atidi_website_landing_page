/**
 * Renderer for Payload's Lexical richText JSON.
 *
 * Shared by the blog post body and the CMS page blocks. Returns null for
 * empty/malformed content so callers can drop the wrapper element.
 */
const RichText = ({ content }) => {
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

export default RichText
