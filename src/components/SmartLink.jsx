'use client'

import { usePathname } from 'next/navigation'

export default function SmartLink({ href, children, className, target, rel, onClick }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  let finalHref = href || '#'
  // Fix empty hash for Patient Stories
  if (
    finalHref === '#' &&
    typeof children === 'string' &&
    children.toLowerCase().includes('patient stories')
  ) {
    finalHref = '/#testimonials'
  }

  const hashIndex = finalHref.indexOf('#')
  const hasHash = hashIndex !== -1
  const hashTarget = hasHash ? finalHref.substring(hashIndex) : ''

  const isExternal =
    finalHref.startsWith('http') ||
    finalHref.startsWith('tel:') ||
    finalHref.startsWith('mailto:')

  if (isExternal) {
    return (
      <a href={finalHref} target={target} rel={rel} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  if (hasHash && isHomePage) {
    return (
      <a
        href={hashTarget}
        className={className}
        onClick={(e) => {
          if (onClick) onClick(e)
          const targetId = hashTarget.replace(/^#/, '')
          const element =
            document.getElementById(targetId) ||
            (targetId === 'process' ? document.getElementById('how-it-works') : null)

          if (element) {
            e.preventDefault()
            element.scrollIntoView({ behavior: 'smooth' })
            window.history.pushState(null, '', hashTarget)
          }
        }}
      >
        {children}
      </a>
    )
  }

  if (hasHash && !isHomePage) {
    return (
      <a href={`/${hashTarget}`} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <a href={finalHref} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

