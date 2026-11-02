'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TwoFactorNavLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname === '/admin/two-factor'

  return (
    <Link
      href="/admin/two-factor"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        color: isActive ? '#0070f3' : '#666',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: isActive ? 600 : 400,
        borderLeft: isActive ? '3px solid #0070f3' : '3px solid transparent',
        backgroundColor: isActive ? 'rgba(0, 112, 243, 0.05)' : 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Two-Factor Auth
    </Link>
  )
}

export default TwoFactorNavLink
