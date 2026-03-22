'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavbarProps {
  userEmail?: string
  activePage?: 'dashboard' | 'docs' | 'other'
  onLogout?: () => void
}

export default function Navbar({ userEmail, activePage, onLogout }: NavbarProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 50, height: 52, 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '0 24px', borderBottom: '1px solid #1c1c1c', background: '#0f0f0f' 
    }}>
      <nav style={{ display: 'flex', gap: 24, height: '100%' }}>
        <Link 
          href="/dashboard" 
          onMouseEnter={() => setHovered('dashboard')}
          onMouseLeave={() => setHovered(null)}
          style={{ 
            fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center',
            color: activePage === 'dashboard' ? '#ededed' : '#71717a',
            borderBottom: hovered === 'dashboard' ? '1px solid #3f3f46' : '1px solid transparent',
            marginBottom: -1,
            transition: 'color 0.2s, border-color 0.2s'
          }}>
          Dashboard
        </Link>
        <Link 
          href="/docs" 
          onMouseEnter={() => setHovered('docs')}
          onMouseLeave={() => setHovered(null)}
          style={{ 
            fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center',
            color: activePage === 'docs' ? '#ededed' : '#71717a',
            borderBottom: hovered === 'docs' ? '1px solid #3f3f46' : '1px solid transparent',
            marginBottom: -1,
            transition: 'color 0.2s, border-color 0.2s'
          }}>
          Docs
        </Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {userEmail && (
          <span style={{ 
            fontSize: 13, color: '#71717a', fontFamily: 'monospace', 
            maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
          }}>
            {userEmail}
          </span>
        )}
        <button 
          onClick={onLogout}
          onMouseEnter={() => setHovered('signout')}
          onMouseLeave={() => setHovered(null)}
          style={{ 
            padding: '6px 14px', borderRadius: 6,
            background: hovered === 'signout' ? '#2a2a2a' : '#1c1c1c',
            color: '#71717a', fontSize: 13, fontWeight: 500, 
            border: '1px solid #1c1c1c', cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
