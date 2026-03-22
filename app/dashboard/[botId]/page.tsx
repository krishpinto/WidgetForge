// app/dashboard/[botId]/page.tsx
// ─────────────────────────────────────────────────────────────
// View/edit a single bot. Shows all its details and the
// script tag. User can update the name, system prompt,
// and primary color. API key and model are locked after
// creation (changing them would require re-encrypting the key).
//
// Fetches bot data from GET /api/bots/[botId] on load.
// ─────────────────────────────────────────────────────────────
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Bot {
  id: string
  name: string
  provider: string
  model: string
  websiteUrl: string | null
  systemPrompt: string
  primaryColor: string
  messageCount: number
  createdAt: string
}

export default function BotDetailPage() {
  const { botId } = useParams() as { botId: string }
  const router = useRouter()

  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Editable fields
  const [name, setName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')

  useEffect(() => {
    fetch(`/api/bots/${botId}`)
      .then(r => r.json())
      .then(data => {
        if (data.bot) {
          setBot(data.bot)
          setName(data.bot.name)
          setSystemPrompt(data.bot.systemPrompt)
          setPrimaryColor(data.bot.primaryColor)
        }
        setLoading(false)
      })
  }, [botId])

  const VERCEL_URL = process.env.NEXT_PUBLIC_APP_URL || 'YOUR_VERCEL_URL'
  const scriptTag = `<script\n  src="${VERCEL_URL}/widget.js"\n  data-bot-id="${botId}">\n</script>`

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    // We only allow updating name, systemPrompt, primaryColor
    // For a full update API we'd need a PATCH /api/bots/[botId] route
    // For now we'll use a simple fetch
    const res = await fetch(`/api/bots/${botId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, systemPrompt, primaryColor }),
    })

    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this bot permanently?')) return
    setDeleting(true)
    await fetch(`/api/bots/${botId}`, { method: 'DELETE' })
    router.push('/dashboard')
  }

  async function copyScriptTag() {
    await navigator.clipboard.writeText(scriptTag).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const PROVIDER_COLORS: Record<string, string> = {
    gemini: '#1a73e8',
    openai: '#10a37f',
    anthropic: '#d97706',
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#080809',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#3a3a48', fontFamily: 'system-ui', fontSize: 13,
    }}>
      Loading...
    </div>
  )

  if (!bot) return (
    <div style={{
      minHeight: '100vh', background: '#080809',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#f87171', fontFamily: 'system-ui', fontSize: 13,
    }}>
      Bot not found. <Link href="/dashboard" style={{ color: '#6366f1', marginLeft: 8 }}>Back to dashboard</Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#080809', fontFamily: 'system-ui' }}>

      {/* Top bar */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
        borderBottom: '1px solid #111115', background: '#080809',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#3a3a48', fontSize: 12, cursor: 'pointer' }}>← Dashboard</span>
          </Link>
          <span style={{ color: '#1c1c22' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: primaryColor,
            }} />
            <span style={{ color: '#dddde8', fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>
              {name}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              fontSize: 11.5, color: '#f87171',
              background: 'none', border: '1px solid #ef444420',
              borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
            }}
          >
            {deleting ? 'Deleting...' : 'Delete bot'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontSize: 11.5,
              color: saved ? '#22c55e' : '#fff',
              background: saved ? '#22c55e18' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: saved ? '1px solid #22c55e33' : 'none',
              borderRadius: 6, padding: '4px 14px',
              cursor: saving ? 'wait' : 'pointer', fontWeight: 600,
            }}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 10,
        }}>
          {[
            { label: 'Provider', value: bot.provider, color: PROVIDER_COLORS[bot.provider] },
            { label: 'Model', value: bot.model, color: '#3a3a48' },
            { label: 'Messages', value: bot.messageCount.toString(), color: '#3a3a48' },
            { label: 'Bot ID', value: bot.id, color: '#2a2a35' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, background: '#0c0c0e', border: '1px solid #1c1c22',
              borderRadius: 10, padding: '11px 14px',
            }}>
              <div style={{ fontSize: 9.5, color: '#2a2a35', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: 11.5, fontFamily: 'monospace', color: stat.color,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bot name */}
        <div style={{ background: '#0c0c0e', border: '1px solid #1c1c22', borderRadius: 12, padding: 18 }}>
          <label style={{ fontSize: 11, color: '#3a3a48', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
            Bot Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#101012', border: '1px solid #1c1c22',
              borderRadius: 7, padding: '8px 11px',
              color: '#dddde8', fontSize: 13, outline: 'none',
              fontFamily: 'system-ui',
            }}
          />
        </div>

        {/* System prompt */}
        <div style={{ background: '#0c0c0e', border: '1px solid #1c1c22', borderRadius: 12, padding: 18 }}>
          <label style={{ fontSize: 11, color: '#3a3a48', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            rows={6}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#101012', border: '1px solid #1c1c22',
              borderRadius: 7, padding: '8px 11px',
              color: '#dddde8', fontSize: 12.5, outline: 'none',
              resize: 'vertical', fontFamily: 'system-ui', lineHeight: 1.55,
            }}
          />
          <div style={{ fontSize: 9.5, color: '#2a2a35', textAlign: 'right', marginTop: 4 }}>
            {systemPrompt.length} chars
          </div>
        </div>

        {/* Primary color */}
        <div style={{ background: '#0c0c0e', border: '1px solid #1c1c22', borderRadius: 12, padding: 18 }}>
          <label style={{ fontSize: 11, color: '#3a3a48', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
            Widget Color
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="color"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              style={{ width: 36, height: 36, borderRadius: 7, border: 'none', cursor: 'pointer', background: 'none' }}
            />
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#3a3a48' }}>{primaryColor}</span>
          </div>
        </div>

        {/* Script tag */}
        <div style={{ background: '#0c0c0e', border: '1px solid #1c1c22', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: '#3a3a48', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Script Tag
            </label>
            <button
              onClick={copyScriptTag}
              style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 5,
                border: copied ? '1px solid #22c55e44' : '1px solid #1c1c22',
                background: copied ? '#22c55e0e' : '#111114',
                color: copied ? '#22c55e' : '#3a3a48',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {copied ? '✓ Copied' : '⎘ Copy'}
            </button>
          </div>
          <div style={{
            background: '#070709', border: '1px solid #111115',
            borderRadius: 8, padding: '12px 14px',
          }}>
            <pre style={{
              margin: 0, fontSize: 11.5,
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              color: '#6a7aa8', whiteSpace: 'pre-wrap',
              wordBreak: 'break-all', lineHeight: 1.7,
            }}>
              {scriptTag}
            </pre>
          </div>
          <div style={{ fontSize: 10.5, color: '#2a2a35', marginTop: 10 }}>
            🔒 API key and system prompt are stored encrypted. Only the bot ID is exposed.
          </div>
        </div>

      </div>
    </div>
  )
}