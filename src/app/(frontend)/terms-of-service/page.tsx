import TermsOfServiceClient from '@/components/TermsOfServiceClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export const metadata = {
  title: 'Terms of Service - Atidi NRI Care',
  description: 'Review the Atidi NRI Care terms of service. Understand the conditions governing use of our dental care coordination services.',
  openGraph: {
    title: 'Terms of Service - Atidi NRI Care',
    description: 'Review the Atidi NRI Care terms of service.',
  },
  alternates: { canonical: '/terms-of-service' },
}

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />
}
