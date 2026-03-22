'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MoreVertical, LayoutDashboard, Settings, Bot, Plus, Trash2, Book, HelpCircle, Terminal, Bell, Bolt } from 'lucide-react'
import Navbar from '@/components/Navbar'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
  
  // UI Hover States
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const [cardHover, setCardHover] = useState<string | null>(null)
  
  // Modal States
  const [connectModalId, setConnectModalId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email)
    })

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

  const getProviderStyles = (provider: string) => {
    const p = provider.toLowerCase()
    if (p === 'gemini') return { backgroundColor: '#172554', color: '#93c5fd' }
    if (p === 'openai') return { backgroundColor: '#052e16', color: '#86efac' }
    if (p === 'anthropic') return { backgroundColor: '#431407', color: '#fdba74' }
    return { backgroundColor: 'transparent', color: '#71717a', border: '1px solid #1c1c1c' }
  }

  const activeBot = bots.find(b => b.id === connectModalId)

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: '#0f0f0f', color: '#ededed' }}>
      
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 bottom-0 flex flex-col p-4 w-[200px] h-screen font-sans text-sm font-medium tracking-tight z-50" style={{ backgroundColor: '#0f0f0f', borderRight: '1px solid #1c1c1c' }}>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-6 h-6 rounded flex items-center justify-center shadow-md" style={{ backgroundColor: '#ededed' }}>
            <Bolt className="h-4 w-4" style={{ color: '#0f0f0f', fill: '#0f0f0f' }} />
          </div>
          <span className="text-lg font-bold tracking-tighter" style={{ color: '#ededed' }}>widgetforge</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200" style={{ backgroundColor: '#1c1c1c', color: '#ededed' }}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 transition-colors duration-200" style={{ color: '#71717a' }}>
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        
        <div className="mt-auto space-y-4 pt-4 border-t" style={{ borderTop: '1px solid #1c1c1c' }}>
          <div className="space-y-1">
            <Link href="/docs" className="flex items-center gap-3 px-3 py-2 transition-colors duration-200" style={{ color: '#71717a' }}>
              <Book className="h-4 w-4" />
              Docs
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 transition-colors duration-200" style={{ color: '#71717a' }}>
              <HelpCircle className="h-4 w-4" />
              Support
            </Link>
          </div>
          <div className="p-3 rounded-lg border" style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c1c1c' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: '#3f3f46' }}>Status</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#052e16' }}></span>
            </div>
            <div className="text-[11px] truncate font-mono" style={{ color: '#71717a' }}>{userEmail || 'user@example.com'}</div>
            <div className="inline-flex items-center px-1.5 py-0.5 mt-2 rounded border text-[10px] font-mono uppercase tracking-wider" style={{ backgroundColor: '#1c1c1c', borderColor: '#1c1c1c', color: '#ededed' }}>
              Free Tier
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 ml-[200px] flex flex-col min-h-screen overflow-x-hidden">
        
        <Navbar userEmail={userEmail} activePage="dashboard" onLogout={handleLogout} />

        {/* Page Content */}
        <div className="p-8 max-w-5xl mx-auto w-full flex-1">
          
          {/* Hero Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: '#ededed' }}>Your Bots</h1>
              <div className="flex items-center gap-3">
                <p className="text-sm" style={{ color: '#71717a' }}>{loading ? '0' : bots.length}/3 used on Free tier</p>
                <div className="w-32 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#1c1c1c' }}>
                  <div 
                    className="h-full transition-all duration-500" 
                    style={{ backgroundColor: '#ededed', width: `${Math.min(((loading ? 0 : bots.length) / 3) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
            
            <Link href="/dashboard/new">
              <button disabled={bots.length >= 3} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 13, backgroundColor: '#ededed', color: '#0f0f0f', border: 'none', cursor: bots.length >= 3 ? 'not-allowed' : 'pointer', opacity: bots.length >= 3 ? 0.5 : 1 }}>
                <Plus className="h-4 w-4" />
                New Bot
              </button>
            </Link>
          </div>

          {/* Quick Actions Row */}
          {!loading && bots.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <Link href="/dashboard/new" style={{ textDecoration: 'none' }}>
                  <div 
                    onMouseEnter={() => setCardHover('new')}
                    onMouseLeave={() => setCardHover(null)}
                    style={{ background: cardHover === 'new' ? '#1a1a1a' : '#141414', border: '1px solid #1c1c1c', borderRadius: 8, padding: 16, transition: 'background 0.2s', cursor: 'pointer' }}>
                    <Plus className="h-5 w-5 mb-3" style={{ color: '#ededed' }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>New Bot</div>
                    <div style={{ fontSize: 12, color: '#71717a' }}>Create a new AI agent</div>
                  </div>
                </Link>
                <Link href="/docs" style={{ textDecoration: 'none' }}>
                  <div 
                    onMouseEnter={() => setCardHover('docs')}
                    onMouseLeave={() => setCardHover(null)}
                    style={{ background: cardHover === 'docs' ? '#1a1a1a' : '#141414', border: '1px solid #1c1c1c', borderRadius: 8, padding: 16, transition: 'background 0.2s', cursor: 'pointer' }}>
                    <Book className="h-5 w-5 mb-3" style={{ color: '#ededed' }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>Read Docs</div>
                    <div style={{ fontSize: 12, color: '#71717a' }}>Integration guides</div>
                  </div>
                </Link>
                <div 
                  onMouseEnter={() => setCardHover('api')}
                  onMouseLeave={() => setCardHover(null)}
                  style={{ background: cardHover === 'api' ? '#1a1a1a' : '#141414', border: '1px solid #1c1c1c', borderRadius: 8, padding: 16, transition: 'background 0.2s', cursor: 'pointer' }}>
                  <Terminal className="h-5 w-5 mb-3" style={{ color: '#ededed' }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>View API</div>
                  <div style={{ fontSize: 12, color: '#71717a' }}>Explore the API</div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col border rounded-xl p-5" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#1c1c1c' }} />
                      <div className="h-4 w-32 animate-pulse rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
                    </div>
                    <div className="h-4 w-4 rounded-full animate-pulse" style={{ backgroundColor: '#1c1c1c' }} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 animate-pulse rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
                      <div className="h-5 w-24 animate-pulse rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
                    </div>
                    <div className="pt-4 border-t flex justify-between" style={{ borderTop: '1px solid #1c1c1c' }}>
                      <div className="h-8 w-16 animate-pulse rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
                      <div className="h-8 w-16 animate-pulse rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && bots.length === 0 && (
            <div className="border border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center group transition-colors" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform" style={{ backgroundColor: '#0f0f0f', borderColor: '#1c1c1c' }}>
                <Bot className="h-6 w-6" style={{ color: '#71717a' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#ededed' }}>No bots yet</h3>
              <p className="text-xs max-w-sm mb-6" style={{ color: '#71717a' }}>Build your first custom AI agent to deploy on any website in just 60 seconds.</p>
              <Link href="/dashboard/new">
                <Button className="h-9 gap-2 font-semibold px-4 border-0" style={{ backgroundColor: '#ededed', color: '#0f0f0f' }}>
                  <Plus className="h-4 w-4" />
                  Create your first bot
                </Button>
              </Link>
            </div>
          )}

          {/* Bot Cards Grid */}
          {!loading && bots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bots.map((bot) => (
                 <div 
                   key={bot.id} 
                   onMouseEnter={() => setHoveredCardId(bot.id)}
                   onMouseLeave={() => setHoveredCardId(null)}
                   className="group relative flex flex-col border rounded-xl p-5 transition-all duration-300 shadow-sm" 
                   style={{ backgroundColor: hoveredCardId === bot.id ? '#1a1a1a' : '#141414', borderColor: '#1c1c1c' }}
                 >
                  <Link href={`/dashboard/${bot.id}`} className="absolute inset-0 z-0" />
                  
                  <div className="flex items-start justify-between mb-6 z-10 relative pointer-events-none">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bot.primaryColor }}></div>
                      <h3 className="font-semibold tracking-tight pointer-events-auto transition-colors" style={{ color: '#ededed' }}>
                        <Link href={`/dashboard/${bot.id}`}>{bot.name}</Link>
                      </h3>
                    </div>
                    
                    {/* Connect Button + Kebab */}
                    <div className="pointer-events-auto flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConnectModalId(bot.id); }}
                        className="hover:bg-white/5 transition-colors"
                        style={{ padding: '3px 10px', fontSize: 11, fontWeight: 500, background: 'transparent', color: '#ededed', border: '1px solid #1c1c1c', borderRadius: 6, cursor: 'pointer' }}
                      >
                        Connect
                      </button>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="transition-colors focus:outline-none bg-transparent border-0 hover:text-white" style={{ color: '#71717a' }}>
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 border" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer bg-transparent hover:bg-white/5"
                                style={{ color: '#f87171' }}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                <span>Delete bot</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent className="border" style={{ backgroundColor: '#141414', borderColor: '#1c1c1c' }}>
                          <AlertDialogHeader>
                            <AlertDialogTitle style={{ color: '#ededed' }}>Delete {bot.name}?</AlertDialogTitle>
                            <AlertDialogDescription style={{ color: '#71717a' }}>
                              This action cannot be undone. This will permanently delete your bot from our servers and it will instantly stop working on deployed sites.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border hover:bg-white/5" style={{ color: '#ededed', borderColor: '#1c1c1c' }}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={(e) => handleDelete(bot.id, e as any)}
                              disabled={deleting === bot.id}
                              className="border-0 hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#f87171', color: '#0f0f0f' }}
                            >
                              {deleting === bot.id ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-4 z-10 relative pointer-events-none">
                    <div className="flex flex-wrap gap-2 hidden md:flex">
                       <span className="px-2 py-0.5 text-[10px] font-mono rounded uppercase tracking-wider" style={getProviderStyles(bot.provider)}>
                         {bot.provider}
                       </span>
                       <span className="px-2 py-0.5 text-[10px] font-mono border rounded tracking-wider uppercase" style={{ backgroundColor: '#0f0f0f', color: '#71717a', borderColor: '#1c1c1c' }}>
                         {bot.model}
                       </span>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between" style={{ borderTop: '1px solid #1c1c1c' }}>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest mb-0.5 font-mono" style={{ color: '#3f3f46' }}>ID</span>
                        <span className="text-xs font-mono" style={{ color: '#71717a' }}>{bot.id}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] uppercase tracking-widest mb-0.5 font-mono" style={{ color: '#3f3f46' }}>Messages</span>
                        <span className="text-xs font-mono" style={{ color: '#71717a' }}>{bot.messageCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                 </div>
              ))}
            </div>
          )}
          
          {/* Footer Meta */}
          <div className="mt-16 flex items-center justify-between pt-6 border-t pb-8" style={{ borderTop: '1px solid #1c1c1c' }}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <style>{`
                  @keyframes statusPulse {
                    0% { box-shadow: 0 0 0 0 rgba(62, 207, 142, 0.4); }
                    70% { box-shadow: 0 0 0 4px rgba(62, 207, 142, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(62, 207, 142, 0); }
                  }
                `}</style>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3ecf8e', animation: 'statusPulse 2s infinite' }}></div>
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#71717a' }}>All Systems Operational</span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: '#3f3f46' }}>widgetforge v2.0</span>
            </div>
          </div>

        </div>
      </main>

      {/* Connect Modal Overlay */}
      {connectModalId && activeBot && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(2px)' }} onClick={() => setConnectModalId(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, background: '#141414', border: '1px solid #1c1c1c', borderRadius: 12, padding: 32, margin: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#ededed' }}>Deploy {activeBot.name}</h2>
              <button 
                onClick={() => setConnectModalId(null)} 
                style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 18, padding: 4, display: 'flex' }}>
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Script Tag Row */}
              <div style={{ background: '#0f0f0f', border: '1px solid #1c1c1c', padding: '16px 20px', borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 12 }}>Script Tag</div>
                <div style={{ background: '#141414', border: '1px solid #1c1c1c', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <pre style={{ margin: 0, padding: 12, fontSize: 12, color: '#71717a', fontFamily: 'monospace', overflowX: 'auto' }}>
{`<script 
  src="\${process.env.NEXT_PUBLIC_APP_URL || 'https://widgetforge.vercel.app'}/widget.js" 
  data-bot-id="${connectModalId}">
</script>`}
                  </pre>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`<script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://widgetforge.vercel.app'}/widget.js" data-bot-id="${connectModalId}"></script>`)
                      setCopiedId('script')
                      setTimeout(() => setCopiedId(null), 2000)
                    }}
                    style={{ margin: 12, padding: '4px 10px', fontSize: 11, fontWeight: 500, background: '#1c1c1c', color: copiedId === 'script' ? '#3ecf8e' : '#71717a', border: '1px solid #1c1c1c', borderRadius: 4, cursor: 'pointer', transition: 'color 0.2s' }}
                  >
                    {copiedId === 'script' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* WordPress Row */}
              <div style={{ background: '#0f0f0f', border: '1px solid #1c1c1c', padding: '16px 20px', borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>WordPress</div>
                <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
                  1. Install "Insert Headers and Footers" plugin.<br/>
                  2. Paste the script tag above into the Footer section.
                </div>
              </div>

              {/* Webflow Row */}
              <div style={{ background: '#0f0f0f', border: '1px solid #1c1c1c', padding: '16px 20px', borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>Webflow</div>
                <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
                  1. Go to Project Settings -{'>'} Custom Code.<br/>
                  2. Paste the script tag above into the Footer Code section.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}