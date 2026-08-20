import React from 'react'

const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0'
    }}>
      <img
        src="/athidi.png"
        alt="Atidi NRI Care"
        style={{ height: '40px', width: 'auto' }}
      />
      <span style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#1a1a2e',
        letterSpacing: '0.5px'
      }}>
        KTree CMS
      </span>
    </div>
  )
}

export default Logo
