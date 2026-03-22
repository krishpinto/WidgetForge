'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { 
  Search, Bell, HelpCircle, Terminal, User, 
  ChevronDown, Plug, LogOut, Settings, Book, Bolt 
} from 'lucide-react'

interface NavbarProps {
  userEmail?: string
  activePage?: 'dashboard' | 'docs' | 'other' | string
  onLogout?: () => void
}

export default function Navbar({ userEmail, activePage = 'dashboard', onLogout }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const formattedPage = activePage.charAt(0).toUpperCase() + activePage.slice(1)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 50, height: 52, 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '0 16px', borderBottom: '1px solid #1c1c1c', background: '#0c0c0c',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* ── Left: Logo & Breadcrumbs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        
        

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: '#1c1c1c' }} />

        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 500 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }} className="group">
            <span style={{ color: '#ededed', transition: 'color 0.2s' }} className="group-hover:text-white">
              Personal
            </span>
            <span style={{ 
              fontSize: 10, padding: '1px 6px', borderRadius: 9999, 
              border: '1px solid #3f3f46', color: '#71717a', fontWeight: 600, letterSpacing: '0.05em'
            }}>
              FREE
            </span>
            <ChevronDown className="w-3.5 h-3.5" style={{ color: '#71717a' }} />
          </Link>

          <span style={{ color: '#3f3f46', fontSize: 14 }}>/</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} className="group">
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: '#ededed' }} />
            </div>
            <span style={{ color: '#ededed', transition: 'color 0.2s' }} className="group-hover:text-white">
              {formattedPage}
            </span>
            <span style={{ 
              fontSize: 10, padding: '1px 6px', borderRadius: 9999, 
              border: '1px solid #ca8a04', color: '#eab308', background: 'rgba(202, 138, 4, 0.1)',
              fontWeight: 600, letterSpacing: '0.05em'
            }}>
              PRODUCTION
            </span>
            <ChevronDown className="w-3.5 h-3.5" style={{ color: '#71717a' }} />
          </div>

          <button style={{ 
            display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8,
            padding: '4px 10px', borderRadius: 6, border: '1px solid #3f3f46', 
            background: 'transparent', color: '#ededed', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1c1c1c'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Plug className="w-3 h-3" />
            Connect
          </button>
        </div>
      </div>

      {/* ── Right: Utilities & Profile ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        
        <a href="mailto:support@widgetforge.com" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none', fontWeight: 500 }} className="hover:text-[#ededed] transition-colors hidden md:block">
          Feedback
        </a>

        {/* Search Bar Placeholder */}
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: 48,
          padding: '4px 8px 4px 10px', borderRadius: 6, border: '1px solid #1c1c1c', 
          background: '#141414', color: '#71717a', fontSize: 13, cursor: 'text'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'monospace' }}>
            <span style={{ background: '#1c1c1c', padding: '2px 4px', borderRadius: 4, color: '#ededed' }}>⌘</span>
            <span style={{ background: '#1c1c1c', padding: '2px 4px', borderRadius: 4, color: '#ededed' }}>K</span>
          </div>
        </button>

        {/* Utility Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/docs" style={{ padding: 6, background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', borderRadius: 6 }} className="hover:text-[#ededed] hover:bg-[#1c1c1c] transition-all">
            <HelpCircle className="w-4 h-4" />
          </Link>
          <button style={{ padding: 6, background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', borderRadius: 6, position: 'relative' }} className="hover:text-[#ededed] hover:bg-[#1c1c1c] transition-all">
            <Bell className="w-4 h-4" />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, background: '#ef4444', borderRadius: '50%', border: '2px solid #0c0c0c' }} />
          </button>
          <button style={{ padding: 6, background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', borderRadius: 6 }} className="hover:text-[#ededed] hover:bg-[#1c1c1c] transition-all">
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ 
              width: 28, height: 28, borderRadius: '50%', 
              background: '#1c1c1c', border: '1px solid #3f3f46', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0, overflow: 'hidden'
            }}
          >
            <User className="w-4 h-4" style={{ color: '#71717a' }} />
          </button>

          {isProfileOpen && (
            <div style={{ 
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 220,
              background: '#141414', border: '1px solid #1c1c1c', borderRadius: 8,
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)', padding: 4, zIndex: 50
            }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #1c1c1c', marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Signed in as</div>
                <div style={{ fontSize: 13, color: '#ededed', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userEmail || 'user@example.com'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#ededed', textDecoration: 'none', borderRadius: 4 }} className="hover:bg-[#1c1c1c] transition-colors">
                  <Settings className="w-4 h-4" style={{ color: '#71717a' }} />
                  Account Settings
                </Link>
                <Link href="/docs" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#ededed', textDecoration: 'none', borderRadius: 4 }} className="hover:bg-[#1c1c1c] transition-colors">
                  <Book className="w-4 h-4" style={{ color: '#71717a' }} />
                  Documentation
                </Link>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onLogout) onLogout();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 4, width: '100%', textAlign: 'left' }} 
                  className="hover:bg-[#2a1414] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </header>
  )
}