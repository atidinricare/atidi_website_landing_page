import ContactUsClient from '@/components/ContactUsClient'
import { buildPageMetadata, getPageSchema } from '@/lib/page-meta'
import JsonLd from '@/components/JsonLd'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata('contact-us', {
    title: 'Contact Us - Atidi NRI Care',
    description: 'Get in touch with Atidi NRI Care. Reach us via phone, email, or WhatsApp for dental consultations and appointments.',
    keywords: 'contact Atidi NRI Care, dental consultation, NRI dental helpline, dental appointment India',
    canonical: '/contact-us',
  })
}

export default async function ContactUsPage() {
  const schema = await getPageSchema('contact-us')

  return (
    <>
      <JsonLd data={schema} />
      <ContactUsClient />
    </>
  )
}
