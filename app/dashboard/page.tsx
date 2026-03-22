// app/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────
// Main dashboard — shows all the user's bots as cards.
// Fetches bots from /api/bots on load.
// Each card links to /dashboard/[botId] to view/edit.
// "New Bot" button links to /dashboard/new.
// ─────────────────────────────────────────────────────────────
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Bot {
  id: string
  name: string
  provider: string
  model: string
  websiteUrl: string | null
  primaryColor: string
  messageCount: number
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    // Get user info for the header
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email)
    })

    // Fetch bots
    fetch('/api/bots')
      .then(r => r.json())
      .then(data => {
        setBots(data.bots || [])
        setLoading(false)
      })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleDelete(botId: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this bot? This cannot be undone.')) return

    setDeleting(botId)
    await fetch(`/api/bots/${botId}`, { method: 'DELETE' })
    setBots(prev => prev.filter(b => b.id !== botId))
    setDeleting(null)
  }

  const PROVIDER_COLORS: Record<string, string> = {
    gemini: '#1a73e8',
    openai: '#10a37f',
    anthropic: '#d97706',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080809',
      fontFamily: 'system-ui',
    }}>

      {/* ── Top Bar ── */}
      <div style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid #111115',
        background: '#080809',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L9.5 9.5H2L8 13.5L5.5 21L12 17L18.5 21L16 13.5L22 9.5H14.5L12 2Z"/>
            </svg>
          </div>
          <span style={{ color: '#f0f0f2', fontSize: 14, fontWeight: 700, letterSpacing: '-0.03em' }}>
            widgetforge
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11.5, color: '#3a3a48' }}>{userEmail}</span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 11.5, color: '#3a3a48',
              background: 'none', border: '1px solid #1c1c22',
              borderRadius: 6, padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 32,
        }}>
          <div>
            <h1 style={{
              color: '#f0f0f2', fontSize: 22, fontWeight: 700,
              letterSpacing: '-0.03em', margin: 0,
            }}>
              Your Bots
            </h1>
            <p style={{ color: '#3a3a48', fontSize: 12.5, margin: '4px 0 0' }}>
              {bots.length}/3 bots used on free tier
            </p>
          </div>

          <Link href="/dashboard/new" style={{ textDecoration: 'none' }}>
            <button
              disabled={bots.length >= 3}
              style={{
                padding: '9px 16px',
                borderRadius: 8, border: 'none',
                background: bots.length >= 3 ? '#1a1a20' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: bots.length >= 3 ? '#3a3a48' : '#fff',
                fontSize: 13, fontWeight: 600,
                cursor: bots.length >= 3 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              + New Bot
            </button>
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ color: '#3a3a48', fontSize: 13, textAlign: 'center', padding: 60 }}>
            Loading...
          </div>
        )}

        {/* Empty state */}
        {!loading && bots.length === 0 && (
          <div style={{
            border: '1px dashed #1c1c22',
            borderRadius: 14, padding: 60,
            textAlign: 'center',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 28 }}>⬡</div>
            <div style={{ color: '#dddde8', fontSize: 14, fontWeight: 600 }}>
              No bots yet
            </div>
            <div style={{ color: '#3a3a48', fontSize: 12.5 }}>
              Create your first bot in 60 seconds
            </div>
            <Link href="/dashboard/new" style={{ textDecoration: 'none', marginTop: 4 }}>
              <button style={{
                padding: '8px 16px', borderRadius: 7, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              }}>
                Create your first bot →
              </button>
            </Link>
          </div>
        )}

        {/* Bots grid */}
        {!loading && bots.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
          }}>
            {bots.map(bot => (
              <Link
                key={bot.id}
                href={`/dashboard/${bot.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#0c0c0e',
                  border: '1px solid #1c1c22',
                  borderRadius: 12,
                  padding: 18,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  position: 'relative',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a35'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#1c1c22'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                  }}
                >
                  {/* Color dot + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: bot.primaryColor, flexShrink: 0,
                    }} />
                    <span style={{
                      color: '#dddde8', fontSize: 13.5, fontWeight: 600,
                      letterSpacing: '-0.01em',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {bot.name}
                    </span>
                  </div>

                  {/* Provider + model */}
                  <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 9.5, fontFamily: 'monospace',
                      color: PROVIDER_COLORS[bot.provider] || '#6366f1',
                      background: `${PROVIDER_COLORS[bot.provider]}15`,
                      border: `1px solid ${PROVIDER_COLORS[bot.provider]}30`,
                      padding: '2px 6px', borderRadius: 4,
                    }}>
                      {bot.provider}
                    </span>
                    <span style={{
                      fontSize: 9.5, fontFamily: 'monospace',
                      color: '#3a3a48', background: '#111114',
                      border: '1px solid #1c1c22',
                      padding: '2px 6px', borderRadius: 4,
                    }}>
                      {bot.model}
                    </span>
                  </div>

                  {/* Website URL */}
                  {bot.websiteUrl && (
                    <div style={{
                      fontSize: 10.5, color: '#2a2a38',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', marginBottom: 12,
                    }}>
                      {bot.websiteUrl}
                    </div>
                  )}

                  {/* Stats row */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', paddingTop: 12,
                    borderTop: '1px solid #111115',
                  }}>
                    <span style={{ fontSize: 10.5, color: '#2a2a38' }}>
                      {bot.messageCount} messages
                    </span>
                    {/* Bot ID badge */}
                    <span style={{
                      fontSize: 9, fontFamily: 'monospace',
                      color: '#2a2a35', background: '#0a0a0c',
                      padding: '2px 5px', borderRadius: 3,
                    }}>
                      {bot.id}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={e => handleDelete(bot.id, e)}
                    disabled={deleting === bot.id}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'none', border: 'none',
                      color: '#2a2a35', fontSize: 14,
                      cursor: 'pointer', padding: 2,
                      opacity: deleting === bot.id ? 0.5 : 1,
                    }}
                    title="Delete bot"
                  >
                    ×
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}