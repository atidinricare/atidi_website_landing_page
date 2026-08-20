// Atidi NRI Care - Globals Seed Script
// Seeds SiteSettings, Navigation, Footer, HeroContent
// Run with: npx tsx src/seed/seed-globals.ts

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedGlobals() {
  console.log('============================================')
  console.log('  Atidi NRI Care - Globals Seed Script')
  console.log('============================================\n')

  console.log('[1/6] Initializing Payload CMS...')
  const payload = await getPayload({ config })
  console.log('  --> Payload initialized.\n')

  // --------------------------------------------------
  // Site Settings
  // --------------------------------------------------
  console.log('[2/6] Seeding Site Settings...')
  try {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'Atidi NRI Care',
        siteDescription: 'Premium dental care for NRIs. World-class treatment in India with seamless follow-up care in the USA.',
        contactEmail: 'contact@atidinricare.com',
        contactPhone: '+91 90309 91859',
        whatsappNumber: '919030991859',
        socialLinks: {
          facebook: '',
          instagram: '',
          youtube: '',
          linkedin: '',
        },
        announcement: {
          enabled: false,
          text: '',
          link: '',
        },
      },
    })
    console.log('  --> Site Settings updated.\n')
  } catch (error: any) {
    console.error('  --> Error:', error?.message || error, '\n')
  }

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------
  console.log('[3/6] Seeding Navigation...')
  try {
    await payload.updateGlobal({
      slug: 'navigation',
      data: {
        mainNav: [
          { label: 'Treatments', link: '/#treatments', type: 'custom' },
          { label: 'Locations', link: '/#locations', type: 'custom' },
          { label: 'Process', link: '/#process', type: 'custom' },
          { label: 'FAQ', link: '/#faq', type: 'custom' },
          { label: 'Clinics', link: '/clinics', type: 'page' },
          { label: 'Sign In', link: 'https://app.atidinricare.com/', type: 'custom' },
        ],
        ctaButton: {
          label: 'Book an Appointment',
          link: 'https://app.atidinricare.com/',
        },
      },
    })
    console.log('  --> Navigation updated.\n')
  } catch (error: any) {
    console.error('  --> Error:', error?.message || error, '\n')
  }

  // --------------------------------------------------
  // Footer
  // --------------------------------------------------
  console.log('[4/6] Seeding Footer...')
  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        tagline: 'Premium dental care for NRIs. World-class treatment in India with seamless follow-up in the USA.',
        columns: [
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
        ],
        bottomText: '\u00A9 2026 Atidi NRI Care. All rights reserved.',
        legalLinks: [
          { label: 'Privacy Policy', url: '/privacy-policy' },
          { label: 'Terms of Service', url: '/terms-of-service' },
        ],
      },
    })
    console.log('  --> Footer updated.\n')
  } catch (error: any) {
    console.error('  --> Error:', error?.message || error, '\n')
  }

  // --------------------------------------------------
  // Hero Content
  // --------------------------------------------------
  console.log('[5/6] Seeding Hero Content...')
  try {
    await payload.updateGlobal({
      slug: 'hero-content',
      data: {
        headline: "Premium dental care for NRI's,\n*without* the premium price.",
        subheadline: 'ATIDI NRI CARE connects NRIs to verified top premium dental hospitals in India & USA. We provide world-class treatment in India with seamless follow-up care when you return to the USA. At Atidi dental treatments are 70\u201390% cheaper than in USA without compromising quality.',
        ctaPrimary: {
          label: 'Book an Appointment',
          link: 'https://app.atidinricare.com/',
        },
        ctaSecondary: {
          label: 'Watch Our Story',
          link: '#video',
        },
        stats: [
          { value: '24/7', label: 'Free Teleconsultation' },
          { value: '100%', label: 'Success Rate' },
          { value: '10', label: 'US States Covered' },
        ],
      },
    })
    console.log('  --> Hero Content updated.\n')
  } catch (error: any) {
    console.error('  --> Error:', error?.message || error, '\n')
  }

  // --------------------------------------------------
  // Tracking Settings
  // --------------------------------------------------
  console.log('[6/6] Seeding Tracking Settings...')
  try {
    await payload.updateGlobal({
      slug: 'tracking-settings',
      data: {
        gtmId: '',
        ga4Id: '',
        facebookPixelId: '',
        headScripts: '',
        bodyStartScripts: '',
        bodyEndScripts: '',
      },
    })
    console.log('  --> Tracking Settings updated.\n')
  } catch (error: any) {
    console.error('  --> Error:', error?.message || error, '\n')
  }

  console.log('============================================')
  console.log('  GLOBALS SEED COMPLETE')
  console.log('============================================\n')

  process.exit(0)
}

seedGlobals().catch((error) => {
  console.error('\nGlobals seed failed:', error)
  process.exit(1)
})
