'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Settings, Bolt, Book, HelpCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

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
  const supabase = createClient()

  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  // Editable fields
  const [name, setName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email)
    })

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
  }, [botId, supabase])

  const VERCEL_URL = process.env.NEXT_PUBLIC_APP_URL || 'YOUR_VERCEL_URL'
  const scriptTag = `<script\n  src="${VERCEL_URL}/widget.js"\n  data-bot-id="${botId}">\n</script>`

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
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

  const getProviderStyles = (provider: string) => {
    const p = provider.toLowerCase()
    if (p === 'gemini') return { backgroundColor: '#172554', color: '#93c5fd' }
    if (p === 'openai') return { backgroundColor: '#052e16', color: '#86efac' }
    if (p === 'anthropic') return { backgroundColor: '#431407', color: '#fdba74' }
    return { backgroundColor: 'transparent', color: '#71717a', border: '1px solid #1c1c1c' }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontFamily: 'system-ui', fontSize: 13 }}>
      Loading...
    </div>
  )

  if (!bot) return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', fontFamily: 'system-ui', fontSize: 13 }}>
      Bot not found. <Link href="/dashboard" style={{ color: '#ededed', marginLeft: 8 }}>Back to dashboard</Link>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] font-sans">
      
      <Navbar userEmail={userEmail} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>
        <Sidebar userEmail={userEmail} />

        {/* ── Main Content Area ── */}
        <main className="flex-1 overflow-y-auto w-full">
          
          {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-14 w-full border-b" style={{ backgroundColor: '#0f0f0f', borderBottom: '1px solid #1c1c1c' }}>
          <div className="flex items-center gap-4">
            <nav className="flex items-center text-[11px] font-mono" style={{ color: '#71717a' }}>
              <Link href="/dashboard" className="cursor-pointer transition-colors hover:opacity-80" style={{ color: '#71717a' }}>widgetforge</Link>
              <span className="mx-2 opacity-40">›</span>
              <Link href="/dashboard" className="cursor-pointer transition-colors hover:opacity-80" style={{ color: '#71717a' }}>Dashboard</Link>
              <span className="mx-2 opacity-40">›</span>
              <span style={{ color: '#ededed' }}>{name || bot.name}</span>
            </nav>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono tracking-tighter ml-2" style={{ backgroundColor: '#0f0f0f', borderColor: '#1c1c1c', color: '#71717a' }}>
              PRODUCTION
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-1.5 text-xs font-bold rounded-md transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: 'transparent', color: '#f87171', border: '1px solid #f87171' }}
            >
              {deleting ? 'Deleting...' : 'Delete bot'}
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 text-xs font-bold rounded-md transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: '#ededed', color: '#0f0f0f' }}
            >
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 w-full mx-auto" style={{ maxWidth: 720 }}>
          
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col p-4 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <span className="text-[10px] mb-2 uppercase tracking-widest font-mono" style={{ color: '#3f3f46' }}>Provider</span>
              <div className="mt-auto">
                <span className="px-2 py-0.5 text-[10px] font-mono rounded uppercase tracking-wider" style={getProviderStyles(bot.provider)}>
                  {bot.provider}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <span className="text-[10px] mb-2 uppercase tracking-widest font-mono" style={{ color: '#3f3f46' }}>Model</span>
              <span className="text-sm font-mono uppercase truncate" style={{ color: '#ededed' }}>{bot.model}</span>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <span className="text-[10px] mb-2 uppercase tracking-widest font-mono" style={{ color: '#3f3f46' }}>Messages</span>
              <span className="text-xl font-medium tracking-tight" style={{ color: '#ededed' }}>{bot.messageCount.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <span className="text-[10px] mb-2 uppercase tracking-widest font-mono" style={{ color: '#3f3f46' }}>Bot ID</span>
              <span className="text-xs font-mono truncate" style={{ color: '#71717a' }}>{bot.id}</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Bot Name */}
            <div className="p-5 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <label className="block text-xs font-medium mb-2 uppercase tracking-widest font-mono" style={{ color: '#71717a' }}>Bot Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md outline-none text-sm transition-colors"
                style={{ backgroundColor: '#0f0f0f', color: '#ededed', border: '1px solid #1c1c1c' }}
                onFocus={(e) => e.target.style.borderColor = '#71717a'}
                onBlur={(e) => e.target.style.borderColor = '#1c1c1c'}
              />
            </div>

            {/* System Prompt */}
            <div className="p-5 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <label className="block text-xs font-medium mb-2 uppercase tracking-widest font-mono" style={{ color: '#71717a' }}>System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={6}
                className="w-full px-3 py-3 rounded-md outline-none text-sm transition-colors resize-y min-h-[120px]"
                style={{ backgroundColor: '#0f0f0f', color: '#ededed', border: '1px solid #1c1c1c' }}
                onFocus={(e) => e.target.style.borderColor = '#71717a'}
                onBlur={(e) => e.target.style.borderColor = '#1c1c1c'}
              />
              <div className="mt-2 text-right text-[11px] font-mono" style={{ color: '#71717a' }}>
                {systemPrompt.length} characters
              </div>
            </div>

            {/* Widget Color */}
            <div className="p-5 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <label className="block text-xs font-medium mb-2 uppercase tracking-widest font-mono" style={{ color: '#71717a' }}>Widget Color</label>
              <div className="flex items-center gap-4 mt-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  style={{ backgroundColor: 'transparent' }}
                />
                <div className="px-3 py-1.5 rounded-md text-sm font-mono" style={{ backgroundColor: '#0f0f0f', color: '#ededed', border: '1px solid #1c1c1c' }}>
                  {primaryColor.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Script Tag */}
            <div className="p-5 rounded-lg border shadow-none" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-medium uppercase tracking-widest font-mono" style={{ color: '#71717a' }}>Script Tag</label>
                <button
                  onClick={copyScriptTag}
                  className="px-3 py-1 text-xs font-medium rounded transition-colors"
                  style={{ backgroundColor: 'transparent', color: copied ? '#86efac' : '#71717a', border: '1px solid #1c1c1c' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-md text-xs font-mono overflow-auto mb-3" style={{ backgroundColor: '#0f0f0f', color: '#71717a', border: '1px solid #1c1c1c' }}>
                {scriptTag}
              </pre>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: '#3f3f46' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>API key stored encrypted. Only bot ID exposed.</span>
              </div>
            </div>
            
          </div>
          </div>
        </main>
      </div>
    </div>
  )
}