import Link from 'next/link'
import { getFooter } from '@/lib/data'

const Footer = async () => {
  const footerData = await getFooter()

  // Fallback data if CMS is empty
  const tagline = footerData.tagline || 'Premium dental care for NRIs. World-class treatment in India with seamless follow-up in the USA.'
  const columns = footerData.columns.length > 0 ? footerData.columns : [
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: '/about-us' },
        { label: 'Our Services', url: '/our-services' },
        { label: 'Our Clinics', url: '/clinics' },
        { label: 'Contact Us', url: '/contact-us' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Patient Stories', url: '#' },
        { label: 'Blog', url: '/blog' },
        { label: 'FAQ', url: '/#faq' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: '+91 90309 91859', url: 'tel:+919030991859' },
        { label: 'contact@atidinricare.com', url: 'mailto:contact@atidinricare.com' },
        { label: 'WhatsApp Support', url: 'https://wa.me/919030991859', newTab: true },
      ],
    },
  ]
  const bottomText = footerData.bottomText || '© 2026 Atidi NRI Care. All rights reserved.'
  const legalLinks = footerData.legalLinks.length > 0 ? footerData.legalLinks : [
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Service', url: '/terms-of-service' },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src="/athidi.png"
              alt="Atidi"
              className="footer-logo"
            />
            <p>{tagline}</p>
          </div>
          {columns.map((column, index) => (
            <div key={index} className="footer-links">
              <h4>{column.title}</h4>
              {column.links.map((link, linkIndex) => {
                // Check if it's an internal link (starts with /) or anchor link (starts with #)
                const isInternal = link.url.startsWith('/') || link.url.startsWith('#')

                if (isInternal && !link.newTab) {
                  return (
                    <Link key={linkIndex} href={link.url}>
                      {link.label}
                    </Link>
                  )
                }

                return (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target={link.newTab ? '_blank' : undefined}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>
            {bottomText}
            {' · Powered by '}
            <a
              href="https://ktree.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              KTree
            </a>
          </p>
          <p>
            {legalLinks.map((link, index) => (
              <span key={index}>
                {index > 0 && ' | '}
                <Link href={link.url}>{link.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
