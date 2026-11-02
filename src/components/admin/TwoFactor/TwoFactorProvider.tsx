'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import TwoFactorSetup from './TwoFactorSetup'

type StatusData = {
  systemRequires2FA: boolean
  userHas2FA: boolean
  isLoggedIn: boolean
  needsSetup: boolean
}

interface Props {
  children: React.ReactNode
}

/**
 * Provider component that enforces 2FA setup when required
 * Wraps the admin panel and redirects to setup if needed
 */
const TwoFactorProvider: React.FC<Props> = ({ children }) => {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/2fa/status')
        if (res.ok) {
          const data = await res.json()
          setStatus(data)
        }
      } catch (err) {
        console.error('Failed to check 2FA status:', err)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [pathname])

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '14px',
        color: '#666',
      }}>
        Loading...
      </div>
    )
  }

  // If not logged in, show children (login page)
  if (!status?.isLoggedIn) {
    return <>{children}</>
  }

  // If 2FA is required but not set up, force setup
  if (status.needsSetup) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '20px',
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffc107',
          }}>
            <strong style={{ color: '#856404' }}>Setup Required</strong>
            <p style={{ color: '#856404', margin: '8px 0 0 0', fontSize: '14px' }}>
              Your administrator requires two-factor authentication.
              Please set up 2FA to continue using the admin panel.
            </p>
          </div>
          <TwoFactorSetup />
        </div>
      </div>
    )
  }

  // Otherwise, render children normally
  return <>{children}</>
}

export default TwoFactorProvider
