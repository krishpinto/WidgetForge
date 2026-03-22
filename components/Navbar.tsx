'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bolt } from 'lucide-react'

interface NavbarProps {
  userEmail?: string
  activePage?: 'dashboard' | 'docs' | 'other'
}

export default function Navbar({ userEmail, activePage }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 50, height: 52, 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '0 24px', borderBottom: '1px solid #1c1c1c', background: '#0f0f0f' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: '#ededed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bolt className="h-4 w-4" style={{ color: '#0f0f0f', fill: '#0f0f0f' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#ededed', letterSpacing: '-0.02em' }}>widgetforge</span>
        </Link>
        <nav style={{ display: 'flex', gap: 20 }}>
          <Link href="/dashboard" style={{ 
            fontSize: 13, textDecoration: 'none',
            color: activePage === 'dashboard' ? '#ededed' : '#71717a' 
          }}>
            Dashboard
          </Link>
          <Link href="/docs" style={{ 
            fontSize: 13, textDecoration: 'none',
            color: activePage === 'docs' ? '#ededed' : '#71717a' 
          }}>
            Docs
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {userEmail && <span style={{ fontSize: 13, color: '#71717a', fontFamily: 'monospace' }}>{userEmail}</span>}
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '6px 14px', borderRadius: 6, background: '#1c1c1c', 
            color: '#71717a', fontSize: 13, fontWeight: 500, 
            border: '1px solid #1c1c1c', cursor: 'pointer' 
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
