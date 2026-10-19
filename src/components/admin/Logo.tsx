import React from 'react'

const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      width: '100%',
    }}>
      <img
        src="/admin-logo.png"
        alt="Atidi NRI Care"
        style={{
          height: '56px',
          width: 'auto',
          maxWidth: '220px',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}

export default Logo
