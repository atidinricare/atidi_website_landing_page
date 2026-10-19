import { getPageBySlug } from '@/lib/data'
import ContactUsClient from '@/components/ContactUsClient'

// Force dynamic rendering so edits in CMS immediately reflect on page reload
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const page = await getPageBySlug('contact-us')
  const meta = (page as any)?.meta || {}

  return {
    title: meta.title || 'Contact Us - Atidi NRI Care',
    description:
      meta.description ||
      'Get in touch with Atidi NRI Care. Reach us via phone, email, or WhatsApp for dental consultations and appointments.',
    keywords:
      meta.keywords ||
      'contact Atidi NRI Care, dental consultation, NRI dental helpline, dental appointment India',
    openGraph: {
      title: meta.title || 'Contact Us - Atidi NRI Care',
      description:
        meta.description ||
        'Get in touch with Atidi NRI Care. Reach us via phone, email, or WhatsApp for dental consultations and appointments.',
    },
    alternates: { canonical: '/contact-us' },
  }
}

function parseContactPage(page: any) {
  if (!page || !Array.isArray(page.layout)) return null
  const heroBlock = page.layout.find((b: any) => b.blockType === 'hero')
  const cardsBlock = page.layout.find((b: any) => b.blockType === 'contactCards')

  return {
    hero: {
      eyebrow: heroBlock?.eyebrow,
      headline: heroBlock?.headline,
      subheadline: heroBlock?.subheadline,
    },
    cards: cardsBlock?.cards || [],
  }
}

export default async function ContactUsPage() {
  const page = await getPageBySlug('contact-us')
  const data = parseContactPage(page)

  return <ContactUsClient data={data as any} />
}
