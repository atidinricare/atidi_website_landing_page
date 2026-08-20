import ContactUsClient from '@/components/ContactUsClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export const metadata = {
  title: 'Contact Us - Atidi NRI Care',
  description: 'Get in touch with Atidi NRI Care. Reach us via phone, email, or WhatsApp for dental consultations and appointments.',
  keywords: 'contact Atidi NRI Care, dental consultation, NRI dental helpline, dental appointment India',
  openGraph: {
    title: 'Contact Us - Atidi NRI Care',
    description: 'Get in touch with Atidi NRI Care. Reach us via phone, email, or WhatsApp for dental consultations and appointments.',
  },
  alternates: { canonical: '/contact-us' },
}

export default function ContactUsPage() {
  return <ContactUsClient />
}
