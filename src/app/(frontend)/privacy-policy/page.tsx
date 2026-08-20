import PrivacyPolicyClient from '@/components/PrivacyPolicyClient'

// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false

export const metadata = {
  title: 'Privacy Policy - Atidi NRI Care',
  description: 'Read the Atidi NRI Care privacy policy. Understand how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - Atidi NRI Care',
    description: 'Read the Atidi NRI Care privacy policy.',
  },
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
}
