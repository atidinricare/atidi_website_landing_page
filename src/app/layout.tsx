import type { Metadata } from 'next'
import React from 'react'
import { DM_Serif_Display, Space_Grotesk } from 'next/font/google'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atidi NRI Care',
  description: 'Premium dental tourism for NRIs - Save up to 80% on world-class dental care in India',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
