'use client'

import React, { useState } from 'react'

interface SyncResult {
  success: boolean
  uploaded: string[]
  skipped: string[]
  excluded: string[]
  errors: { file: string; error: string }[]
  s3BaseUrl: string
  bucketPublic: boolean
  totalFiles: number
}

const S3SyncButton: React.FC = () => {
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSync = async () => {
    setSyncing(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/api/s3-sync', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Sync failed')
        return
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setSyncing(false)
    }
  }

  const handleCheckStatus = async () => {
    try {
      const response = await fetch('/api/s3-sync', {
        credentials: 'include',
      })
      const data = await response.json()
      if (data.enabled === false) {
        setError('S3 storage is not enabled. Enable it and save settings first.')
      } else {
        setError(null)
        setResult(null)
        alert(
          `S3 Status:\n` +
          `Bucket: ${data.bucket}\n` +
          `Region: ${data.region}\n` +
          `Public Access: ${data.bucketPublic ? 'Yes' : 'No (images may not load directly)'}\n` +
          `Asset Base URL: ${data.assetBaseUrl}`
        )
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{
      marginTop: '24px',
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fafafa',
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
        Sync Assets to S3
      </h4>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#666' }}>
        Upload static images and videos from the application to your S3 bucket.
        Files like logo and favicon are excluded and always served locally.
        The sync is incremental — only new files are uploaded.
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          style={{
            padding: '8px 20px',
            backgroundColor: syncing ? '#999' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: syncing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {syncing ? 'Syncing...' : 'Sync to S3'}
        </button>

        <button
          type="button"
          onClick={handleCheckStatus}
          style={{
            padding: '8px 20px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Check Status
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: '12px',
          padding: '14px',
          backgroundColor: result.success ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '4px',
          fontSize: '13px',
        }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', color: result.success ? '#166534' : '#991b1b' }}>
            {result.success ? 'Sync completed successfully' : 'Sync completed with errors'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
            <span style={{ color: '#666' }}>Uploaded:</span>
            <span style={{ fontWeight: 500 }}>{result.uploaded.length} files</span>
            <span style={{ color: '#666' }}>Skipped (already in S3):</span>
            <span>{result.skipped.length} files</span>
            <span style={{ color: '#666' }}>Excluded (local-only):</span>
            <span>{result.excluded.length} files</span>
            <span style={{ color: '#666' }}>Bucket Public:</span>
            <span>{result.bucketPublic ? 'Yes' : 'No'}</span>
          </div>

          {result.uploaded.length > 0 && (
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', color: '#166534' }}>
                View uploaded files ({result.uploaded.length})
              </summary>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', maxHeight: '200px', overflow: 'auto' }}>
                {result.uploaded.map((f) => (
                  <li key={f} style={{ fontSize: '12px', color: '#444' }}>{f}</li>
                ))}
              </ul>
            </details>
          )}

          {result.errors.length > 0 && (
            <details style={{ marginTop: '10px' }} open>
              <summary style={{ cursor: 'pointer', color: '#991b1b' }}>
                Errors ({result.errors.length})
              </summary>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px' }}>
                {result.errors.map((e) => (
                  <li key={e.file} style={{ fontSize: '12px', color: '#c00' }}>
                    {e.file}: {e.error}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

export default S3SyncButton
