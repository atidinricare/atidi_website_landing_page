import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import BookAppointmentFloat from '@/components/BookAppointmentFloat'
import TrackingScriptsWrapper from '@/components/TrackingScriptsWrapper'
import { getNavigation } from '@/lib/data'
import './globals.css'

// Force dynamic rendering - database not available at build time
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atidi NRI Care - Premium Dental Care for NRIs',
  description: 'Premium dental tourism for NRIs - Save up to 80% on world-class dental care in India with seamless follow-up in the USA.',
  keywords: 'NRI dental care, dental tourism India, affordable dental treatment, NRI dentist',
  openGraph: {
    title: 'Atidi NRI Care - Premium Dental Care for NRIs',
    description: 'Premium dental tourism for NRIs - Save up to 80% on world-class dental care in India with seamless follow-up in the USA.',
    siteName: 'Atidi NRI Care',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getNavigation()

  return (
    <div className="app">
      <TrackingScriptsWrapper />
      <Header navigation={navigation} />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <BookAppointmentFloat />
    </div>
  )
}
