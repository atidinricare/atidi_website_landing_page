'use client'

import React from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f9fafb' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#4b5563', maxWidth: '440px', marginBottom: '24px', fontSize: '16px', lineHeight: 1.5 }}>
            An unexpected error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0d9488',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

