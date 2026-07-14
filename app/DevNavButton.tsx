'use client'

import Link from 'next/link'

export default function DevNavButton() {
  return (
    <Link
      href="/dev-nav"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#1c1008',
        color: '#fff',
        borderRadius: '9999px',
        padding: '10px 16px',
        fontSize: '12px',
        fontWeight: 700,
        textDecoration: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '14px' }}>⚡</span> Pages
    </Link>
  )
}
