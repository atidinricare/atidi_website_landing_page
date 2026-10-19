'use client'

import React, { useState, useEffect } from 'react'

type SetupData = {
  qrCode: string
  secret: string
  backupCodes: string[]
}

type StatusData = {
  systemRequires2FA: boolean
  userHas2FA: boolean
  isLoggedIn: boolean
  needsSetup: boolean
  backupCodesCount: number
}

const TwoFactorSetup: React.FC = () => {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [disableCode, setDisableCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDisable, setShowDisable] = useState(false)

  // Fetch 2FA status on mount
  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/2fa/status')
      const data = await res.json()
      setStatus(data)
    } catch (err) {
      console.error('Failed to fetch 2FA status:', err)
    }
  }

  const handleSetup = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/2fa/setup', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to setup 2FA')
      }

      setSetupData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify code')
      }

      setSuccess('2FA has been enabled successfully!')
      setSetupData(null)
      setVerifyCode('')
      fetchStatus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: disableCode }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to disable 2FA')
      }

      setSuccess('2FA has been disabled successfully!')
      setDisableCode('')
      setShowDisable(false)
      fetchStatus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!status) {
    return <div style={styles.container}>Loading...</div>
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Two-Factor Authentication</h2>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {status.systemRequires2FA && (
        <div style={styles.notice}>
          Two-factor authentication is required by your administrator.
        </div>
      )}

      {/* Already has 2FA enabled */}
      {status.userHas2FA && !setupData && (
        <div>
          <div style={styles.statusBox}>
            <span style={styles.statusIcon}>✓</span>
            <div>
              <strong>2FA is enabled</strong>
              <p style={styles.statusText}>
                Your account is protected with two-factor authentication.
                {status.backupCodesCount > 0 && (
                  <span> You have {status.backupCodesCount} backup codes remaining.</span>
                )}
              </p>
            </div>
          </div>

          {!status.systemRequires2FA && (
            <div style={{ marginTop: '20px' }}>
              {!showDisable ? (
                <button
                  onClick={() => setShowDisable(true)}
                  style={styles.dangerButton}
                >
                  Disable 2FA
                </button>
              ) : (
                <form onSubmit={handleDisable}>
                  <p style={styles.text}>Enter your current 2FA code to disable:</p>
                  <input
                    type="text"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    style={styles.input}
                    maxLength={8}
                    autoComplete="one-time-code"
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" disabled={loading} style={styles.dangerButton}>
                      {loading ? 'Disabling...' : 'Confirm Disable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowDisable(false); setDisableCode(''); }}
                      style={styles.secondaryButton}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Setup flow - not enabled yet */}
      {!status.userHas2FA && !setupData && (
        <div>
          <p style={styles.text}>
            Add an extra layer of security to your account by enabling two-factor authentication.
            You will need the Google Authenticator app on your phone.
          </p>
          <button onClick={handleSetup} disabled={loading} style={styles.primaryButton}>
            {loading ? 'Setting up...' : 'Enable 2FA'}
          </button>
        </div>
      )}

      {/* QR Code and verification */}
      {setupData && (
        <div>
          <div style={styles.setupBox}>
            <h3 style={styles.subheading}>Step 1: Scan QR Code</h3>
            <p style={styles.text}>
              Open Google Authenticator and scan this QR code:
            </p>
            <div style={styles.qrContainer}>
              <img src={setupData.qrCode} alt="2FA QR Code" style={styles.qrCode} />
            </div>
            <p style={styles.smallText}>
              Or enter this code manually: <code style={styles.code}>{setupData.secret}</code>
            </p>
          </div>

          <div style={styles.setupBox}>
            <h3 style={styles.subheading}>Step 2: Save Backup Codes</h3>
            <p style={styles.text}>
              Save these backup codes in a safe place. You can use them to access your account
              if you lose your phone.
            </p>
            <div style={styles.backupCodes}>
              {setupData.backupCodes.map((code, i) => (
                <span key={i} style={styles.backupCode}>{code}</span>
              ))}
            </div>
          </div>

          <div style={styles.setupBox}>
            <h3 style={styles.subheading}>Step 3: Verify</h3>
            <p style={styles.text}>
              Enter the 6-digit code from Google Authenticator to complete setup:
            </p>
            <form onSubmit={handleVerify}>
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Enter 6-digit code"
                style={styles.input}
                maxLength={6}
                autoComplete="one-time-code"
              />
              <button type="submit" disabled={loading} style={styles.primaryButton}>
                {loading ? 'Verifying...' : 'Verify and Enable'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#1a1a2e',
  },
  subheading: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '10px',
    color: '#1a1a2e',
  },
  text: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  smallText: {
    fontSize: '12px',
    color: '#888',
    marginTop: '10px',
  },
  notice: {
    padding: '12px 16px',
    backgroundColor: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#856404',
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#f8d7da',
    borderLeft: '4px solid #dc3545',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#721c24',
  },
  success: {
    padding: '12px 16px',
    backgroundColor: '#d4edda',
    borderLeft: '4px solid #28a745',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#155724',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#d4edda',
    borderRadius: '8px',
  },
  statusIcon: {
    fontSize: '24px',
    color: '#28a745',
  },
  statusText: {
    fontSize: '14px',
    color: '#155724',
    marginTop: '4px',
  },
  setupBox: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  qrCode: {
    width: '200px',
    height: '200px',
  },
  code: {
    backgroundColor: '#e9ecef',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    wordBreak: 'break-all',
  },
  backupCodes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  backupCode: {
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '18px',
    fontFamily: 'monospace',
    letterSpacing: '4px',
    textAlign: 'center',
    border: '2px solid #ddd',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  primaryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#666',
    backgroundColor: '#e9ecef',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  dangerButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
}

export default TwoFactorSetup
