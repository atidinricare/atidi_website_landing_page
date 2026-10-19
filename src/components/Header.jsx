'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Calendar } from 'lucide-react'

import SmartLink from './SmartLink'

const Header = ({ navigation }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // Navigation data with fallbacks
  const navItems = navigation?.mainNav || [
    { label: 'Treatments', link: '#treatments', type: 'custom' },
    { label: 'Locations', link: '#locations', type: 'custom' },
    { label: 'Process', link: '#process', type: 'custom' },
    { label: 'FAQ', link: '#faq', type: 'custom' },
    { label: 'Clinics', link: '/clinics', type: 'page' },
    { label: 'Sign In', link: 'https://app.atidinricare.com/', type: 'custom' },
  ]
  const ctaButton = navigation?.ctaButton || {
    label: 'Book an Appointment',
    link: 'https://app.atidinricare.com/',
  }

  // Set transparent header mode
  useEffect(() => {
    document.documentElement.setAttribute('data-header-original', 'true')
  }, [])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Helper to determine if link is external
  const isExternal = (link) => link?.startsWith('http')

  // Helper to render nav link
  const renderNavLink = (item, onClick = null) => {
    return (
      <SmartLink href={item.link} onClick={onClick}>
        {item.label}
      </SmartLink>
    )
  }

  return (
    <>
      <header className={`header ${isScrolled || !isHomePage ? 'scrolled' : ''}`}>
        <Link href="/" className="logo">
          <img src="/athidi.png" alt="Atidi NRI Care" />
        </Link>

        <nav className="nav desktop-nav">
          {navItems.map((item, index) => (
            <span key={index}>
              {renderNavLink(item)}
            </span>
          ))}
        </nav>

        <a
          href={ctaButton.link}
          target={isExternal(ctaButton.link) ? '_blank' : undefined}
          rel={isExternal(ctaButton.link) ? 'noopener noreferrer' : undefined}
          className="header-cta"
        >
          <Calendar size={16} />
          {ctaButton.label}
        </a>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <nav>
              {navItems.map((item, index) => (
                <span key={index}>
                  {renderNavLink(item, () => setMobileMenuOpen(false))}
                </span>
              ))}
            </nav>
            <a
              href={ctaButton.link}
              target={isExternal(ctaButton.link) ? '_blank' : undefined}
              rel={isExternal(ctaButton.link) ? 'noopener noreferrer' : undefined}
              className="mobile-cta"
            >
              <Calendar size={18} />
              {ctaButton.label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
