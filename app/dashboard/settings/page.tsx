'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { LayoutDashboard, Settings, Book, HelpCircle, Bolt, ShieldAlert, KeyRound, Palette } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

interface Bot {
  id: string
  name: string
  provider: string
  model: string
  primaryColor: string
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userEmail, setUserEmail] = useState('')
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  
  // API Keys state
  const [rotatingKeyId, setRotatingKeyId] = useState<string | null>(null)
  const [newKey, setNewKey] = useState('')
  const [savingKeyId, setSavingKeyId] = useState<string | null>(null)

  // Preferences state
  const [defaultProvider, setDefaultProvider] = useState('gemini')
  const [defaultColor, setDefaultColor] = useState('#6366f1')

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

    // Load preferences
    const savedProvider = localStorage.getItem('wf_pref_provider')
    const savedColor = localStorage.getItem('wf_pref_color')
    if (savedProvider) setDefaultProvider(savedProvider)
    if (savedColor) setDefaultColor(savedColor)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleSaveKey(botId: string) {
    if (!newKey.trim()) return
    setSavingKeyId(botId)
    
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newKey.trim() })
      })
      if (!res.ok) throw new Error('Failed to update key')
      setRotatingKeyId(null)
      setNewKey('')
    } catch (e) {
      console.error(e)
      alert("Failed to update API key.")
    } finally {
      setSavingKeyId(null)
    }
  }

  const handleProviderPref = (p: string) => {
    setDefaultProvider(p)
    localStorage.setItem('wf_pref_provider', p)
  }

  const handleColorPref = (c: string) => {
    setDefaultColor(c)
    localStorage.setItem('wf_pref_color', c)
  }

  const getProviderStyles = (provider: string) => {
    const p = provider.toLowerCase()
    if (p === 'gemini') return { backgroundColor: '#172554', color: '#93c5fd' }
    if (p === 'openai') return { backgroundColor: '#052e16', color: '#86efac' }
    if (p === 'anthropic') return { backgroundColor: '#431407', color: '#fdba74' }
    return { backgroundColor: 'transparent', color: '#71717a', border: '1px solid #1c1c1c' }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] font-sans text-[#ededed]">
      
      <Navbar userEmail={userEmail} activePage="settings" onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>
        <Sidebar userEmail={userEmail} />

        {/* ── Main Content Area ── */}
        <main className="flex-1 overflow-y-auto w-full">
          
          <div className="p-8 max-w-3xl mx-auto w-full flex-1">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: '#ededed' }}>Settings</h1>
            <p className="text-sm" style={{ color: '#71717a' }}>Manage your account, preferences, and API endpoints.</p>
          </div>

          <div className="space-y-8">
            
            {/* 1. Account */}
            <section style={{ background: '#141414', border: '1px solid #1c1c1c', borderRadius: 8 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1c1c1c' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ededed' }}>Account</h2>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#ededed', marginBottom: 8 }}>Email Address</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={userEmail || 'Loading...'} 
                    style={{ width: '100%', maxWidth: 400, background: '#0c0c0c', border: '1px solid #1c1c1c', color: '#71717a', padding: '10px 12px', fontSize: 14, borderRadius: 6, cursor: 'not-allowed' }} 
                  />
                </div>
                
                <div style={{ border: '1px solid #7f1d1d', borderRadius: 8, padding: 16, background: '#450a0a10', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f87171', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldAlert className="w-4 h-4" /> Danger Zone</h3>
                    <p style={{ fontSize: 13, color: '#71717a' }}>Permanently delete your account and all associated bots.</p>
                  </div>
                  <button style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Delete account
                  </button>
                </div>
              </div>
            </section>

            {/* 2. API Keys */}
            <section style={{ background: '#141414', border: '1px solid #1c1c1c', borderRadius: 8 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ededed', display: 'flex', gap: 8, alignItems: 'center' }}><KeyRound className="w-4 h-4 text-[#71717a]"/> API Keys</h2>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: 13, color: '#71717a', marginBottom: 24, padding: 16, background: '#0f0f0f', border: '1px solid #1c1c1c', borderRadius: 8 }}>
                  Keys are stored encrypted. You cannot view them after saving — only replace them.
                </div>
                
                {loading ? (
                  <div className="h-10 w-full animate-pulse rounded" style={{ backgroundColor: '#1c1c1c' }}></div>
                ) : bots.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#71717a', fontStyle: 'italic' }}>No bots active.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {bots.map(bot => (
                      <div key={bot.id} style={{ border: '1px solid #1c1c1c', borderRadius: 8, background: '#0f0f0f', overflow: 'hidden' }}>
                        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: bot.primaryColor }}></div>
                            <span style={{ fontSize: 14, fontWeight: 500, color: '#ededed' }}>{bot.name}</span>
                            <span className="px-2 py-0.5 text-[10px] font-mono rounded uppercase tracking-wider ml-2" style={getProviderStyles(bot.provider)}>
                              {bot.provider}
                            </span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setRotatingKeyId(rotatingKeyId === bot.id ? null : bot.id)
                              setNewKey('')
                            }}
                            style={{ background: 'transparent', border: '1px solid #1c1c1c', color: '#ededed', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1c1c1c'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {rotatingKeyId === bot.id ? 'Cancel' : 'Rotate key'}
                          </button>
                        </div>
                        
                        {/* Rotation Expanded Input */}
                        {rotatingKeyId === bot.id && (
                          <div style={{ borderTop: '1px solid #1c1c1c', padding: '16px', background: '#141414', display: 'flex', gap: 12 }}>
                            <input 
                              type="password" 
                              placeholder={`Paste new ${bot.provider} API key...`}
                              value={newKey}
                              onChange={e => setNewKey(e.target.value)}
                              style={{ flex: 1, background: '#0c0c0c', border: '1px solid #1c1c1c', color: '#ededed', padding: '8px 12px', fontSize: 13, borderRadius: 6, outline: 'none' }}
                            />
                            <button 
                              onClick={() => handleSaveKey(bot.id)}
                              disabled={savingKeyId === bot.id || !newKey.trim()}
                              style={{ background: '#ededed', color: '#0f0f0f', border: 'none', padding: '0 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: (!newKey.trim() || savingKeyId === bot.id) ? 'not-allowed' : 'pointer', opacity: (!newKey.trim() || savingKeyId === bot.id) ? 0.5 : 1 }}
                            >
                              {savingKeyId === bot.id ? 'Saving...' : 'Confirm'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 3. Usage */}
            <section style={{ background: '#141414', border: '1px solid #1c1c1c', borderRadius: 8 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1c1c1c' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ededed' }}>Usage</h2>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#71717a', marginBottom: 4 }}>Current Tier</div>
                    <div style={{ display: 'inline-block', background: '#1c1c1c', color: '#ededed', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, border: '1px solid #2a2a2a' }}>Free Tier</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: '#71717a', marginBottom: 6 }}>Bots Deployed</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 120, height: 6, borderRadius: 3, background: '#1c1c1c', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#3ecf8e', width: `${Math.min(((loading ? 0 : bots.length) / 3) * 100, 100)}%` }}></div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#ededed' }}>{loading ? 0 : bots.length}/3</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#0f0f0f', border: '1px dashed #3f3f46', borderRadius: 8, padding: 24, opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>Upgrade to Pro</h3>
                      <p style={{ fontSize: 13, color: '#71717a' }}>Unlock more limits and advanced options. Coming soon.</p>
                    </div>
                    <span style={{ background: '#1c1c1c', color: '#71717a', fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coming soon</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#71717a' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#3ecf8e' }}>✓</span> Support for up to 10 bots</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#3ecf8e' }}>✓</span> Priority email support</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#3ecf8e' }}>✓</span> Custom domain embedding</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Preferences */}
            <section style={{ background: '#141414', border: '1px solid #1c1c1c', borderRadius: 8 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1c1c1c', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Palette className="w-4 h-4 text-[#71717a]"/>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ededed' }}>Preferences</h2>
              </div>
              <div style={{ padding: '24px' }}>
                
                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ededed', marginBottom: 12 }}>Default LLM Provider</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { id: 'gemini', label: 'Gemini' },
                      { id: 'openai', label: 'OpenAI' },
                      { id: 'anthropic', label: 'Anthropic' }
                    ].map(p => (
                      <div 
                        key={p.id}
                        onClick={() => handleProviderPref(p.id)}
                        style={{ background: defaultProvider === p.id ? '#1c1c1c' : '#0f0f0f', border: defaultProvider === p.id ? '1px solid #3f3f46' : '1px solid #1c1c1c', padding: 16, borderRadius: 8, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #3f3f46', background: defaultProvider === p.id ? '#ededed' : 'transparent', position: 'relative' }}>
                             {defaultProvider === p.id && <div style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: '#0f0f0f' }}></div>}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: defaultProvider === p.id ? '#ededed' : '#71717a' }}>{p.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ededed', marginBottom: 12 }}>Default Widget Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <input 
                      type="color" 
                      value={defaultColor}
                      onChange={e => handleColorPref(e.target.value)}
                      style={{ width: 48, height: 48, padding: 0, background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', outline: 'none' }} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 13, color: '#ededed', fontFamily: 'monospace' }}>{defaultColor.toUpperCase()}</span>
                      <span style={{ fontSize: 12, color: '#71717a' }}>Primary accent for new widgets.</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

          </div>
          
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
      </div>
    </div>
  )
}
