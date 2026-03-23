'use client'

// app/docs/page.tsx
// ─────────────────────────────────────────────────────────────
// Full documentation page. Real content written specifically
// for widgetforge's architecture. Inline SVG flowcharts match
// the dark theme. Structure matches the Stitch-generated layout.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

// ── Types ──
interface Section {
  id: string
  title: string
  group: string
}

// ── Sidebar structure ──
const SIDEBAR_GROUPS = [
  {
    title: 'OVERVIEW',
    links: [
      { id: 'introduction', name: 'Introduction' },
      { id: 'how-it-works', name: 'How it works' },
    ],
  },
  {
    title: 'ARCHITECTURE',
    links: [
      { id: 'widget-shadow-dom', name: 'Widget (Shadow DOM)' },
      { id: 'api-proxy', name: 'API Proxy' },
      { id: 'encryption', name: 'Encryption' },
      { id: 'database-schema', name: 'Database Schema' },
    ],
  },
  {
    title: 'PROVIDERS',
    links: [
      { id: 'gemini', name: 'Gemini' },
      { id: 'openai', name: 'OpenAI' },
      { id: 'anthropic', name: 'Anthropic' },
    ],
  },
  {
    title: 'DEPLOYMENT',
    links: [
      { id: 'vercel-setup', name: 'Vercel Setup' },
      { id: 'environment-variables', name: 'Environment Variables' },
    ],
  },
  {
    title: 'EMBEDDING',
    links: [
      { id: 'script-tag', name: 'Script Tag' },
      { id: 'wordpress', name: 'WordPress' },
      { id: 'shopify', name: 'Shopify' },
      { id: 'webflow', name: 'Webflow' },
    ],
  },
]

// ── Reusable components ──
function CodeBlock({ filename, children }: { filename?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ border: '1px solid #1c1c1c', borderRadius: 8, overflow: 'hidden', margin: '16px 0' }}>
      {filename && (
        <div style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#71717a' }}>{filename}</span>
          <button
            onClick={() => {
              const text = typeof children === 'string' ? children : ''
              navigator.clipboard.writeText(text).catch(() => {})
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            style={{ fontSize: 10, color: copied ? '#3ecf8e' : '#71717a', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      )}
      <pre style={{ background: '#0c0c0c', padding: '14px 16px', overflowX: 'auto', fontSize: 12.5, fontFamily: 'monospace', lineHeight: 1.7, margin: 0, color: '#ededed' }}>
        {children}
      </pre>
    </div>
  )
}

function Callout({ icon, title, children }: { icon?: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #1c2e26', borderRadius: 8, padding: '14px 16px', background: '#0c0c0c', display: 'flex', gap: 12, margin: '16px 0' }}>
      {icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  )
}

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#ededed', flexShrink: 0 }}>
        {n}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#ededed', margin: 0 }}>{title}</h2>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ededed', margin: '32px 0 12px' }}>{children}</h3>
}

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.75, margin: '10px 0' }}>{children}</p>
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code style={{ fontFamily: 'monospace', fontSize: 12, background: '#1c1c1c', color: '#ededed', padding: '1px 6px', borderRadius: 4 }}>{children}</code>
}

function Green({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#3ecf8e' }}>{children}</span>
}

function Divider() {
  return <div style={{ borderTop: '1px solid #1c1c1c', margin: '40px 0' }} />
}

function EnvVar({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ border: '1px solid #1c1c1c', borderRadius: 8, padding: '12px 16px', marginBottom: 8, background: '#141414' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#3ecf8e', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 13, color: '#71717a' }}>{desc}</div>
    </div>
  )
}

// ── SVG Flowcharts ──

function RequestFlowChart() {
  return (
    <svg width="100%" viewBox="0 0 640 380" style={{ margin: '24px 0' }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="arr-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>

      {/* Row 1: Browser */}
      <rect x="20" y="20" width="140" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="90" y="43" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Visitor browser</text>
      <text x="90" y="60" textAnchor="middle" fill="#71717a" fontSize="11">types a message</text>

      {/* Arrow → */}
      <line x1="162" y1="46" x2="218" y2="46" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr)"/>
      <text x="190" y="40" textAnchor="middle" fill="#3ecf8e" fontSize="10" fontFamily="monospace">POST</text>

      {/* Row 1: API Chat */}
      <rect x="220" y="20" width="160" height="52" rx="8" fill="#141414" stroke="#3ecf8e" strokeWidth="1"/>
      <text x="300" y="43" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">/api/chat</text>
      <text x="300" y="60" textAnchor="middle" fill="#71717a" fontSize="11">{'{ botId, messages }'}</text>

      {/* Arrow → */}
      <line x1="382" y1="46" x2="438" y2="46" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr)"/>

      {/* Row 1: DB lookup */}
      <rect x="440" y="20" width="160" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="520" y="43" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Drizzle → Supabase</text>
      <text x="520" y="60" textAnchor="middle" fill="#71717a" fontSize="11">lookup bot by id</text>

      {/* Arrow down from DB */}
      <line x1="520" y1="74" x2="520" y2="118" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr)"/>

      {/* Decrypt box */}
      <rect x="440" y="120" width="160" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="520" y="143" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Decrypt API key</text>
      <text x="520" y="160" textAnchor="middle" fill="#71717a" fontSize="11">AES-256-GCM</text>

      {/* Arrow left from decrypt to LLM call */}
      <line x1="438" y1="146" x2="382" y2="146" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr)"/>

      {/* LLM Call box */}
      <rect x="220" y="120" width="160" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="300" y="143" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Call LLM provider</text>
      <text x="300" y="160" textAnchor="middle" fill="#71717a" fontSize="11">key + prompt + messages</text>

      {/* Arrow right to Gemini */}
      <line x1="382" y1="200" x2="438" y2="200" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-muted)"/>
      <text x="410" y="194" textAnchor="middle" fill="#3f3f46" fontSize="10" fontFamily="monospace">HTTPS</text>

      {/* Provider box */}
      <rect x="440" y="174" width="160" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="520" y="197" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Gemini / OpenAI</text>
      <text x="520" y="214" textAnchor="middle" fill="#71717a" fontSize="11">user's tokens used</text>

      {/* Arrow down from LLM call */}
      <line x1="300" y1="174" x2="300" y2="218" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr)"/>

      {/* Return reply box */}
      <rect x="220" y="220" width="160" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="300" y="243" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Return reply</text>
      <text x="300" y="260" textAnchor="middle" fill="#71717a" fontSize="11">{'{ reply: "..." }'}</text>

      {/* Arrow left to browser */}
      <line x1="218" y1="246" x2="162" y2="246" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr)"/>

      {/* Browser receives */}
      <rect x="20" y="220" width="140" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="90" y="243" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Widget renders</text>
      <text x="90" y="260" textAnchor="middle" fill="#71717a" fontSize="11">bot message bubble</text>

      {/* Fire and forget note */}
      <line x1="300" y1="274" x2="300" y2="308" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arr-muted)"/>
      <rect x="220" y="310" width="160" height="44" rx="8" fill="#0c0c0c" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="300" y="329" textAnchor="middle" fill="#3f3f46" fontSize="11">increment message_count</text>
      <text x="300" y="346" textAnchor="middle" fill="#3f3f46" fontSize="10">fire and forget</text>
    </svg>
  )
}

function ShadowDomChart() {
  return (
    <svg width="100%" viewBox="0 0 640 260" style={{ margin: '24px 0' }}>
      {/* Host page */}
      <rect x="20" y="20" width="600" height="220" rx="10" fill="none" stroke="#3f3f46" strokeWidth="1" strokeDasharray="5 4"/>
      <text x="36" y="44" fill="#3f3f46" fontSize="11" fontFamily="monospace">host website (any CSS, any styles)</text>

      {/* Host CSS box */}
      <rect x="40" y="58" width="160" height="44" rx="6" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="120" y="77" textAnchor="middle" fill="#71717a" fontSize="12">Host global CSS</text>
      <text x="120" y="93" textAnchor="middle" fill="#3f3f46" fontSize="11">font-family, colors, resets</text>

      {/* Widget host div */}
      <rect x="260" y="58" width="340" height="164" rx="8" fill="#0c0c0c" stroke="#3ecf8e" strokeWidth="1"/>
      <text x="278" y="78" fill="#3ecf8e" fontSize="11" fontFamily="monospace">#ai-widget-host (Shadow Root)</text>

      {/* Shadow DOM contents */}
      <rect x="278" y="88" width="140" height="40" rx="6" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="348" y="106" textAnchor="middle" fill="#ededed" fontSize="11">Scoped CSS</text>
      <text x="348" y="120" textAnchor="middle" fill="#71717a" fontSize="10">inside shadow only</text>

      <rect x="434" y="88" width="148" height="40" rx="6" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="508" y="106" textAnchor="middle" fill="#ededed" fontSize="11">Chat UI</text>
      <text x="508" y="120" textAnchor="middle" fill="#71717a" fontSize="10">button, panel, bubbles</text>

      <rect x="278" y="144" width="300" height="60" rx="6" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="428" y="166" textAnchor="middle" fill="#ededed" fontSize="11">Host CSS cannot reach inside</text>
      <text x="428" y="182" textAnchor="middle" fill="#71717a" fontSize="10">Shadow DOM boundary blocks all external styles</text>
      <text x="428" y="196" textAnchor="middle" fill="#3ecf8e" fontSize="10">✓ always looks correct on any website</text>

      {/* Blocked arrow */}
      <line x1="202" y1="80" x2="256" y2="80" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 3"/>
      <text x="229" y="74" textAnchor="middle" fill="#f87171" fontSize="10">blocked</text>
      <text x="258" y="76" fill="#f87171" fontSize="14">✕</text>
    </svg>
  )
}

function EncryptionChart() {
  return (
    <svg width="100%" viewBox="0 0 640 200" style={{ margin: '24px 0' }}>
      <defs>
        <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>

      {/* Plain key */}
      <rect x="20" y="74" width="130" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="85" y="97" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">API Key</text>
      <text x="85" y="113" textAnchor="middle" fill="#71717a" fontSize="11">plain text</text>

      {/* Arrow */}
      <line x1="152" y1="100" x2="194" y2="100" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr2)"/>

      {/* Encrypt box */}
      <rect x="196" y="60" width="160" height="80" rx="8" fill="#141414" stroke="#3ecf8e" strokeWidth="1"/>
      <text x="276" y="88" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">AES-256-GCM</text>
      <text x="276" y="105" textAnchor="middle" fill="#71717a" fontSize="11">random IV per encryption</text>
      <text x="276" y="120" textAnchor="middle" fill="#3ecf8e" fontSize="11">ENCRYPTION_KEY env var</text>

      {/* Arrow */}
      <line x1="358" y1="100" x2="400" y2="100" stroke="#3ecf8e" strokeWidth="1.5" markerEnd="url(#arr2)"/>

      {/* Stored */}
      <rect x="402" y="74" width="130" height="52" rx="8" fill="#141414" stroke="#1c1c1c" strokeWidth="1"/>
      <text x="467" y="97" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="600">Stored in DB</text>
      <text x="467" y="113" textAnchor="middle" fill="#71717a" fontSize="11">iv:authTag:ciphertext</text>

      {/* Labels below */}
      <text x="85" y="150" textAnchor="middle" fill="#3f3f46" fontSize="10">user pastes key</text>
      <text x="276" y="158" textAnchor="middle" fill="#3f3f46" fontSize="10">server encrypts once</text>
      <text x="467" y="150" textAnchor="middle" fill="#3f3f46" fontSize="10">never stored plain</text>

      {/* Decrypt path */}
      <text x="320" y="180" textAnchor="middle" fill="#3f3f46" fontSize="11">On each chat request → decrypted in memory → used → discarded</text>
    </svg>
  )
}

// ── Content sections map ──
const SECTIONS: Record<string, React.ReactNode> = {
  'introduction': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>OVERVIEW</span><span style={{ color: '#3f3f46' }}>›</span><span>INTRODUCTION</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Introduction</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>
          widgetforge turns any website into an AI-powered support hub — without a backend.
        </p>
      </div>

      <Divider />

      <Para>
        Most AI chatbot tools are black boxes. You hand over your data, pay per message, and hope the vendor doesn't go down. widgetforge flips this: you bring your own API key from Gemini, OpenAI, or Anthropic. We store it encrypted, proxy your requests, and give you a single script tag. The LLM bill goes to your account — not ours.
      </Para>

      <SectionTitle>The problem we solve</SectionTitle>
      <Para>
        Building a chatbot that knows about your website normally requires: a backend server, a vector database for embeddings, an auth system, a widget UI, and a deployment pipeline. That's weeks of work for something most developers don't want to maintain.
      </Para>
      <Para>
        widgetforge collapses this to: describe your website → preview the bot → paste one script tag. Total time: under 60 seconds.
      </Para>

      <SectionTitle>The BYOK model</SectionTitle>
      <Para>
        BYOK stands for Bring Your Own Key. You paste your Gemini, OpenAI, or Anthropic API key into the builder. We encrypt it with AES-256-GCM and store it in our database. When a visitor chats with your bot, we decrypt the key in memory, make the LLM call, and discard it. Your key is never exposed to the visitor's browser.
      </Para>

      <Callout icon="🔒" title="Your key, your bill">
        We never see your plain-text API key after it leaves your browser. Every LLM call uses your tokens directly. widgetforge charges nothing for AI usage — only for the platform itself (on paid tier).
      </Callout>

      <SectionTitle>Tech stack at a glance</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, margin: '16px 0' }}>
        {[
          { name: 'Next.js', desc: 'Full-stack framework. Frontend + API routes in one project.' },
          { name: 'Supabase', desc: 'Postgres database + auth. Hosted, managed, free tier available.' },
          { name: 'Drizzle ORM', desc: 'Type-safe SQL queries. Schema defined in TypeScript.' },
          { name: 'AES-256-GCM', desc: 'Symmetric encryption for API keys. Random IV per encryption.' },
          { name: 'React Flow', desc: 'The node-based builder canvas. 4 connected nodes, left to right.' },
          { name: 'Shadow DOM', desc: "Widget isolation. Host site's CSS can't touch the widget." },
        ].map(t => (
          <div key={t.name} style={{ background: '#141414', border: '1px solid #1c1c1c', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: '#71717a', lineHeight: 1.55 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  'how-it-works': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>OVERVIEW</span><span style={{ color: '#3f3f46' }}>›</span><span>HOW IT WORKS</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>How it works</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>
          The complete request lifecycle — from script tag to LLM response.
        </p>
      </div>

      <Divider />

      <StepHeader n={1} title="The script tag loads" />
      <Para>
        You paste a script tag on your website. The browser fetches <Mono>widget.js</Mono> from our Vercel URL. The file is ~800 lines of vanilla JavaScript with zero dependencies. It runs immediately.
      </Para>
      <CodeBlock filename="your-website.html">
{`<script
  src="https://widgetforge.vercel.app/widget.js"
  data-bot-id="bot_a3f9b2c1">
</script>`}
      </CodeBlock>

      <StepHeader n={2} title="Widget injects itself" />
      <Para>
        The script creates a <Mono>{'<div>'}</Mono> at the end of <Mono>{'<body>'}</Mono> and attaches a Shadow DOM to it. Inside the shadow it builds the full chat UI — floating button, chat panel, input, message bubbles. The host site's CSS cannot affect any of this.
      </Para>

      <StepHeader n={3} title="Visitor sends a message" />
      <Para>
        When a visitor types a message and hits send, the widget POSTs to <Mono>/api/chat</Mono> on our server. The request contains only the <Mono>botId</Mono> and the conversation history. No API key is ever sent from the browser.
      </Para>

      <StepHeader n={4} title="Server looks up the bot" />
      <Para>
        The API route receives the <Mono>botId</Mono>, queries the database using Drizzle ORM, and retrieves the bot's config row — provider, model, system prompt, and encrypted API key.
      </Para>

      <StepHeader n={5} title="Key decrypted, LLM called" />
      <Para>
        The encrypted API key is decrypted in memory using AES-256-GCM and the <Mono>ENCRYPTION_KEY</Mono> environment variable. The decrypted key is used immediately to call the LLM provider — it's never logged, cached, or returned to the client.
      </Para>

      <StepHeader n={6} title="Reply returned to widget" />
      <Para>
        The LLM response comes back to our server, we extract the reply text, and return <Mono>{'{ reply: "..." }'}</Mono> to the widget. The widget renders it as a bot message bubble.
      </Para>

      <SectionTitle>Full request flowchart</SectionTitle>
      <RequestFlowChart />

      <Callout icon="⚡" title="Dual mode API">
        <Mono>/api/chat</Mono> handles two modes. In <Green>production mode</Green>, the widget sends a <Mono>botId</Mono> and the server looks up everything from the DB. In <Green>preview mode</Green> (the builder), the frontend sends the full config directly so you can test before saving. Same endpoint, same code path.
      </Callout>
    </div>
  ),

  'widget-shadow-dom': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>
          ARCHITECTURE › WIDGET (SHADOW DOM)
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Widget (Shadow DOM)</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>
          How the embeddable widget is built and why it's isolated from the host site.
        </p>
      </div>

      <Divider />

      <SectionTitle>The isolation problem</SectionTitle>
      <Para>
        Every website has its own CSS — resets, font stacks, z-index wars, global overrides. If you inject a chat widget as a regular DOM element, the host site's styles bleed in. Fonts change, colors override, layouts break. The widget looks different on every site.
      </Para>
      <Para>
        The Shadow DOM solves this completely. It creates a separate DOM tree with its own style scope. Styles inside the shadow don't leak out, and styles outside can't get in.
      </Para>

      <ShadowDomChart />

      <SectionTitle>How widget.js works</SectionTitle>
      <Para>
        The file is structured in 13 sections. Here's the key flow:
      </Para>

      {[
        { n: 1, title: 'Read config from script tag', desc: 'Uses document.currentScript to find the <script> tag that loaded widget.js, then reads data-bot-id (V2) or data-key/data-model (V1 legacy) attributes.' },
        { n: 2, title: 'Create host container + Shadow DOM', desc: 'Injects a <div id="ai-widget-host"> into <body> with position:fixed. Calls attachShadow({ mode: "open" }) to create the isolated DOM tree.' },
        { n: 3, title: 'Inject scoped styles', desc: 'Creates a <style> element inside the shadow with all widget CSS. These styles only apply inside the shadow — completely invisible to the host page.' },
        { n: 4, title: 'Build the HTML structure', desc: 'Creates the chat panel, header, messages area, typing indicator, input row, and toggle button — all inside the shadow DOM.' },
        { n: 5, title: 'Wire up events', desc: 'Toggle open/close, Escape key close, auto-resize textarea, Enter to send.' },
        { n: 6, title: 'Send messages', desc: 'On send, POSTs to /api/chat with botId + conversation history. Shows typing indicator while waiting. Renders bot reply as a message bubble.' },
      ].map(item => (
        <div key={item.n} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#71717a', flexShrink: 0, marginTop: 2 }}>{item.n}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 3 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        </div>
      ))}

      <SectionTitle>V1 vs V2 mode</SectionTitle>
      <Para>
        The widget supports two modes detected automatically from the script tag attributes:
      </Para>
      <CodeBlock filename="V2 mode (secure — recommended)">
{`<script
  src="https://widgetforge.vercel.app/widget.js"
  data-bot-id="bot_a3f9b2c1">  ← only this
</script>`}
      </CodeBlock>
      <CodeBlock filename="V1 mode (legacy — still supported)">
{`<script
  src="https://widgetforge.vercel.app/widget.js"
  data-provider="gemini"
  data-key="AIza..."           ← exposed in HTML source
  data-model="gemini-2.5-flash"
  data-prompt="You are...">
</script>`}
      </CodeBlock>
      <Callout icon="⚠️" title="V1 exposes your API key">
        In V1 mode the API key is visible in your website's HTML source. Anyone who views source can find it. Use V2 with a botId for any production deployment.
      </Callout>
    </div>
  ),

  'api-proxy': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>
          ARCHITECTURE › API PROXY
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>API Proxy</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>
          How /api/chat handles requests from both the widget and the builder preview.
        </p>
      </div>

      <Divider />

      <Para>
        The proxy is the core of widgetforge. It sits between the widget (running on someone else's website) and the LLM provider (Gemini, OpenAI, Anthropic). Its job is to accept a message, look up the bot config, decrypt the key, call the LLM, and return the reply.
      </Para>

      <SectionTitle>CORS headers</SectionTitle>
      <Para>
        Because the widget runs on external websites (different origins), the browser's same-origin policy would normally block the request. The proxy includes CORS headers on every response:
      </Para>
      <CodeBlock>
{`Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type`}
      </CodeBlock>
      <Para>
        Browsers send a preflight <Mono>OPTIONS</Mono> request before the real <Mono>POST</Mono>. The route handles both.
      </Para>

      <SectionTitle>Dual mode</SectionTitle>
      <Para>
        The same <Mono>/api/chat</Mono> endpoint serves two different callers:
      </Para>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0' }}>
        <div style={{ background: '#141414', border: '1px solid #1c2e26', borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, color: '#3ecf8e', fontWeight: 600, marginBottom: 6 }}>Production mode</div>
          <div style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6 }}>Widget on external site sends <Mono>{'{ botId, messages }'}</Mono>. Server looks up config from DB.</div>
        </div>
        <div style={{ background: '#141414', border: '1px solid #1c1c1c', borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, color: '#71717a', fontWeight: 600, marginBottom: 6 }}>Preview mode</div>
          <div style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6 }}>Builder preview sends <Mono>{'{ provider, key, model, systemPrompt, messages }'}</Mono> directly.</div>
        </div>
      </div>

      <SectionTitle>Provider differences</SectionTitle>
      {[
        { name: 'Gemini', detail: 'Uses /v1beta/models/{model}:generateContent?key={key}. System prompt goes in systemInstruction field. Roles are "user" and "model" (not "assistant").' },
        { name: 'OpenAI', detail: 'Uses /v1/chat/completions with Authorization: Bearer {key}. System prompt is the first message with role "system".' },
        { name: 'Anthropic', detail: 'Uses /v1/messages with x-api-key header and anthropic-version: 2023-06-01. System prompt is a top-level field, not inside messages.' },
      ].map(p => (
        <div key={p.name} style={{ border: '1px solid #1c1c1c', borderRadius: 8, padding: '12px 16px', marginBottom: 8, background: '#141414' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 4 }}>{p.name}</div>
          <div style={{ fontSize: 12.5, color: '#71717a', lineHeight: 1.6 }}>{p.detail}</div>
        </div>
      ))}
    </div>
  ),

  'encryption': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>
          ARCHITECTURE › ENCRYPTION
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Encryption</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>
          How API keys are stored securely and never exposed.
        </p>
      </div>

      <Divider />

      <Para>
        Every API key you enter is encrypted before it touches the database. We use AES-256-GCM — the same algorithm used by banks and government systems. The encryption key itself (<Mono>ENCRYPTION_KEY</Mono>) is an environment variable that never enters the database.
      </Para>

      <EncryptionChart />

      <SectionTitle>AES-256-GCM explained simply</SectionTitle>
      <Para>
        AES-256 is a symmetric encryption algorithm — the same key encrypts and decrypts. The 256 refers to the key length (256 bits = 32 bytes). GCM (Galois/Counter Mode) adds authentication — it detects if the ciphertext was tampered with.
      </Para>
      <Para>
        Every encryption generates a random 12-byte IV (Initialization Vector). This means the same API key encrypted twice produces completely different ciphertext. No patterns are detectable in the stored data.
      </Para>

      <SectionTitle>What gets stored</SectionTitle>
      <Para>
        The database column <Mono>encrypted_api_key</Mono> stores a colon-separated string:
      </Para>
      <CodeBlock>
{`iv_hex:authTag_hex:ciphertext_hex

Example:
a3f9b2c1d4e5f6a7:8b9c0d1e2f3a4b5c:6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a`}
      </CodeBlock>

      <SectionTitle>Decryption flow</SectionTitle>
      <Para>
        On each chat request: split on colon → reconstruct IV, authTag, ciphertext → call <Mono>createDecipheriv</Mono> → verify auth tag → get plain text key → use it → discard. The key exists in memory for milliseconds.
      </Para>

      <Callout icon="🔑" title="If ENCRYPTION_KEY leaks">
        The encryption key is the master secret. If it leaks, all stored API keys can be decrypted. Keep it in Vercel environment variables, never in code, never in git, never in logs.
      </Callout>
    </div>
  ),

  'database-schema': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>
          ARCHITECTURE › DATABASE SCHEMA
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Database Schema</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>
          Two tables. Everything lives here.
        </p>
      </div>

      <Divider />

      <SectionTitle>profiles</SectionTitle>
      <Para>
        One row per user. Mirrors Supabase's <Mono>auth.users</Mono> table — we can't add columns to that, so we maintain our own profiles table linked by the same UUID.
      </Para>
      {[
        { col: 'id', type: 'text PK', desc: 'Same UUID as auth.users. This is the link between Supabase auth and our data.' },
        { col: 'email', type: 'text', desc: 'User email. Copied from auth on signup.' },
        { col: 'tier', type: 'enum', desc: '"free" or "paid". Free tier allows 3 bots. Paid is unlimited (Stripe integration pending).' },
        { col: 'created_at', type: 'timestamp', desc: 'Account creation time.' },
      ].map(r => (
        <div key={r.col} style={{ display: 'flex', gap: 12, borderBottom: '1px solid #1c1c1c', padding: '10px 0' }}>
          <div style={{ width: 120, fontFamily: 'monospace', fontSize: 12, color: '#3ecf8e', flexShrink: 0 }}>{r.col}</div>
          <div style={{ width: 100, fontFamily: 'monospace', fontSize: 11, color: '#71717a', flexShrink: 0 }}>{r.type}</div>
          <div style={{ fontSize: 12.5, color: '#71717a', lineHeight: 1.6 }}>{r.desc}</div>
        </div>
      ))}

      <SectionTitle>bots</SectionTitle>
      <Para>
        One row per chatbot. The <Mono>id</Mono> field (botId) is what goes in the script tag.
      </Para>
      {[
        { col: 'id', type: 'text PK', desc: 'The botId. Format: bot_xxxxxxxx (8 random hex chars). This is the only identifier exposed to the public.' },
        { col: 'user_id', type: 'text FK', desc: 'References profiles.id. ON DELETE CASCADE — deleting a user removes all their bots.' },
        { col: 'name', type: 'text', desc: 'Human-readable name the user gives the bot. "Support Bot", "Sales Assistant", etc.' },
        { col: 'website_url', type: 'text?', desc: 'Optional URL of the site this bot is for. Used for the scraper — not functionally required.' },
        { col: 'provider', type: 'enum', desc: '"gemini", "openai", or "anthropic".' },
        { col: 'model', type: 'text', desc: 'Model string e.g. "gemini-2.5-flash", "gpt-4o", "claude-3-5-sonnet-20241022".' },
        { col: 'encrypted_api_key', type: 'text', desc: 'AES-256-GCM encrypted API key. Format: iv:authTag:ciphertext.' },
        { col: 'system_prompt', type: 'text', desc: "The bot's personality and instructions. Generated by the scraper or written manually." },
        { col: 'primary_color', type: 'text', desc: 'Hex color for the widget button and user message bubbles. Default #6366f1.' },
        { col: 'message_count', type: 'int', desc: 'Total messages handled. Incremented on each chat request (fire and forget).' },
        { col: 'created_at', type: 'timestamp', desc: 'Bot creation time.' },
        { col: 'updated_at', type: 'timestamp', desc: 'Last edit time.' },
      ].map(r => (
        <div key={r.col} style={{ display: 'flex', gap: 12, borderBottom: '1px solid #1c1c1c', padding: '10px 0' }}>
          <div style={{ width: 140, fontFamily: 'monospace', fontSize: 12, color: '#3ecf8e', flexShrink: 0 }}>{r.col}</div>
          <div style={{ width: 90, fontFamily: 'monospace', fontSize: 11, color: '#71717a', flexShrink: 0 }}>{r.type}</div>
          <div style={{ fontSize: 12.5, color: '#71717a', lineHeight: 1.6 }}>{r.desc}</div>
        </div>
      ))}
    </div>
  ),

  'gemini': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>PROVIDERS › GEMINI</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Gemini</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>Google's Gemini models. Free tier available via Google AI Studio.</p>
      </div>
      <Divider />
      <SectionTitle>Getting a key</SectionTitle>
      <Para>Visit <Green>aistudio.google.com</Green> → API Keys → Create API key. No credit card needed for the free tier. The key starts with <Mono>AIza</Mono>.</Para>
      <SectionTitle>Model discovery</SectionTitle>
      <Para>widgetforge calls <Mono>GET /v1beta/models?key={'{key}'}</Mono> and filters to models that support <Mono>generateContent</Mono>. This gives you a live list of exactly which models your key has access to.</Para>
      <SectionTitle>Recommended models</SectionTitle>
      {[
        { model: 'gemini-2.5-flash', desc: 'Best for most use cases. Fast, cheap, capable. Free tier friendly.' },
        { model: 'gemini-2.5-pro', desc: 'More capable reasoning. Better for complex questions.' },
        { model: 'gemini-2.0-flash', desc: 'Previous generation flash. Still very capable.' },
      ].map(m => (
        <div key={m.model} style={{ border: '1px solid #1c1c1c', borderRadius: 8, padding: '12px 16px', marginBottom: 8, background: '#141414' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#3ecf8e', marginBottom: 4 }}>{m.model}</div>
          <div style={{ fontSize: 12.5, color: '#71717a' }}>{m.desc}</div>
        </div>
      ))}
    </div>
  ),

  'openai': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>PROVIDERS › OPENAI</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>OpenAI</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>GPT-4o, GPT-4 Turbo and other OpenAI models. Requires a paid account.</p>
      </div>
      <Divider />
      <SectionTitle>Getting a key</SectionTitle>
      <Para>Visit <Green>platform.openai.com</Green> → API Keys → Create new secret key. Requires adding a payment method. The key starts with <Mono>sk-</Mono>.</Para>
      <SectionTitle>Model discovery</SectionTitle>
      <Para>widgetforge calls <Mono>GET /v1/models</Mono> with your key as a Bearer token and filters to <Mono>gpt-*</Mono> prefixed models — the chat-capable ones.</Para>
      <SectionTitle>Recommended models</SectionTitle>
      {[
        { model: 'gpt-4o', desc: 'Best overall. Fast, multimodal, good at following instructions.' },
        { model: 'gpt-4o-mini', desc: 'Much cheaper than gpt-4o. Good for simple support use cases.' },
        { model: 'gpt-4-turbo', desc: 'Larger context window. Good for complex conversations.' },
      ].map(m => (
        <div key={m.model} style={{ border: '1px solid #1c1c1c', borderRadius: 8, padding: '12px 16px', marginBottom: 8, background: '#141414' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#3ecf8e', marginBottom: 4 }}>{m.model}</div>
          <div style={{ fontSize: 12.5, color: '#71717a' }}>{m.desc}</div>
        </div>
      ))}
    </div>
  ),

  'anthropic': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>PROVIDERS › ANTHROPIC</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Anthropic</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>Claude models. Excellent at following detailed system prompts.</p>
      </div>
      <Divider />
      <SectionTitle>Getting a key</SectionTitle>
      <Para>Visit <Green>console.anthropic.com</Green> → API Keys → Create Key. Requires a paid account. The key starts with <Mono>sk-ant-</Mono>.</Para>
      <SectionTitle>Model discovery</SectionTitle>
      <Para>Anthropic has no public models list endpoint. widgetforge returns a hardcoded list of current Claude models. This list is updated manually when new models are released.</Para>
      <SectionTitle>Recommended models</SectionTitle>
      {[
        { model: 'claude-3-5-sonnet-20241022', desc: 'Best Claude model. Excellent instruction following. Great for detailed system prompts.' },
        { model: 'claude-3-haiku-20240307', desc: 'Fastest and cheapest. Good for high-volume simple conversations.' },
        { model: 'claude-3-opus-20240229', desc: 'Most capable. Best for complex reasoning tasks.' },
      ].map(m => (
        <div key={m.model} style={{ border: '1px solid #1c1c1c', borderRadius: 8, padding: '12px 16px', marginBottom: 8, background: '#141414' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#3ecf8e', marginBottom: 4 }}>{m.model}</div>
          <div style={{ fontSize: 12.5, color: '#71717a' }}>{m.desc}</div>
        </div>
      ))}
    </div>
  ),

  'vercel-setup': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>DEPLOYMENT › VERCEL SETUP</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Vercel Setup</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>Deploy widgetforge to Vercel in under 5 minutes.</p>
      </div>
      <Divider />
      {[
        { n: 1, title: 'Push to GitHub', desc: 'Push your widgetforge project to a GitHub repository.' },
        { n: 2, title: 'Import on Vercel', desc: 'Go to vercel.com → New Project → Import from GitHub → select your repo.' },
        { n: 3, title: 'Add environment variables', desc: 'Before deploying, add all 5 environment variables in the Vercel project settings. See Environment Variables section.' },
        { n: 4, title: 'Deploy', desc: 'Click Deploy. Vercel builds the Next.js project and gives you a URL like widgetforge.vercel.app.' },
        { n: 5, title: 'Update NEXT_PUBLIC_APP_URL', desc: 'Go back to environment variables and set NEXT_PUBLIC_APP_URL to your actual Vercel URL. Redeploy.' },
        { n: 6, title: 'Update Supabase redirect URLs', desc: 'In Supabase → Authentication → URL Configuration, set Site URL to your Vercel URL.' },
      ].map(s => (
        <div key={s.n} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#71717a', flexShrink: 0, marginTop: 2 }}>{s.n}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
      <Callout icon="🔁" title="Auto-deploys">
        After the initial setup, every push to your main branch triggers an automatic Vercel deployment. No manual redeploys needed.
      </Callout>
    </div>
  ),

  'environment-variables': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>DEPLOYMENT › ENVIRONMENT VARIABLES</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Environment Variables</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>All 5 required variables explained.</p>
      </div>
      <Divider />
      <EnvVar name="NEXT_PUBLIC_SUPABASE_URL" desc="Your Supabase project URL. Found in Supabase → Settings → API. Starts with https://. Safe to expose to the browser (hence NEXT_PUBLIC_)." />
      <EnvVar name="NEXT_PUBLIC_SUPABASE_ANON_KEY" desc="Supabase anonymous key. Used for auth operations in the browser. Safe to expose — Supabase's RLS policies control what it can access." />
      <EnvVar name="DATABASE_URL" desc="PostgreSQL connection string for Drizzle ORM. Use the Transaction pooler URL from Supabase → Settings → Database. Format: postgresql://postgres.xxx:password@aws-x-region.pooler.supabase.com:6543/postgres" />
      <EnvVar name="ENCRYPTION_KEY" desc="32-byte hex string used to encrypt/decrypt API keys. Generate with: node -e 'console.log(require('crypto').randomBytes(32).toString('hex'))'. Never put this in git. If it leaks, rotate it and re-save all bot API keys." />
      <EnvVar name="NEXT_PUBLIC_APP_URL" desc="Your deployed URL without trailing slash. Example: https://widgetforge.vercel.app. Used to generate correct script tags in the dashboard." />
      <Callout icon="⚠️" title="Never commit these to git">
        All of these belong in <Mono>.env.local</Mono> locally and in Vercel's environment variable settings for production. The <Mono>.env.local</Mono> file should be in your <Mono>.gitignore</Mono>.
      </Callout>
    </div>
  ),

  'script-tag': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>EMBEDDING › SCRIPT TAG</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Script Tag</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>The two-line embed that makes everything work.</p>
      </div>
      <Divider />
      <Para>After creating a bot in the dashboard, you get a script tag with just a bot ID. Paste it before the closing <Mono>{'</body>'}</Mono> tag on any HTML page.</Para>
      <CodeBlock filename="V2 (secure — use this)">
{`<script
  src="https://yourapp.vercel.app/widget.js"
  data-bot-id="bot_a3f9b2c1">
</script>`}
      </CodeBlock>
      <Para>That's it. The widget loads, the floating chat button appears in the bottom-right corner. Visitors can click it and start chatting immediately.</Para>
      <SectionTitle>What the bot ID does</SectionTitle>
      <Para>The bot ID is a lookup key. When a visitor sends a message, the widget POSTs <Mono>{'{ botId: "bot_a3f9b2c1", messages: [...] }'}</Mono> to your server. The server queries the database for that bot ID and retrieves the API key, system prompt, and model — all server-side. Nothing sensitive is ever in the script tag.</Para>
      <SectionTitle>Optional attributes</SectionTitle>
      {[
        { attr: 'data-api-endpoint', desc: 'Override the API endpoint. Defaults to the URL the widget.js was loaded from. Useful if you host the widget on a CDN but the API on a different domain.' },
        { attr: 'data-title', desc: 'Override the bot name shown in the chat panel header. Defaults to "AI Assistant".' },
        { attr: 'data-primary-color', desc: 'Override the widget accent color. Note: in V2 mode, this is already stored in the DB per bot.' },
      ].map(a => (
        <div key={a.attr} style={{ border: '1px solid #1c1c1c', borderRadius: 8, padding: '12px 16px', marginBottom: 8, background: '#141414' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#3ecf8e', marginBottom: 4 }}>{a.attr}</div>
          <div style={{ fontSize: 12.5, color: '#71717a' }}>{a.desc}</div>
        </div>
      ))}
    </div>
  ),

  'wordpress': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>EMBEDDING › WORDPRESS</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>WordPress</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>Add the widget to any WordPress site without touching code.</p>
      </div>
      <Divider />
      <Para>The easiest method uses a WordPress plugin to inject the script tag into the footer of every page.</Para>
      {[
        { n: 1, title: 'Install "Insert Headers and Footers"', desc: 'In your WordPress admin: Plugins → Add New → search "Insert Headers and Footers" → Install → Activate.' },
        { n: 2, title: 'Open the plugin settings', desc: 'Go to Settings → Insert Headers and Footers.' },
        { n: 3, title: 'Paste the script tag', desc: 'In the "Scripts in Footer" section, paste your widgetforge script tag.' },
        { n: 4, title: 'Save', desc: 'Click Save. The widget will appear on every page of your site immediately.' },
      ].map(s => (
        <div key={s.n} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#71717a', flexShrink: 0, marginTop: 2 }}>{s.n}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  ),

  'shopify': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>EMBEDDING › SHOPIFY</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Shopify</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>Add the widget to your Shopify store through the theme editor.</p>
      </div>
      <Divider />
      {[
        { n: 1, title: 'Open the theme editor', desc: 'In your Shopify admin: Online Store → Themes → Actions → Edit code.' },
        { n: 2, title: 'Find theme.liquid', desc: 'In the Layout section, click on theme.liquid.' },
        { n: 3, title: 'Paste before </body>', desc: 'Find the closing </body> tag near the bottom of the file and paste your widgetforge script tag just above it.' },
        { n: 4, title: 'Save', desc: 'Click Save. The widget appears on every page of your store.' },
      ].map(s => (
        <div key={s.n} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#71717a', flexShrink: 0, marginTop: 2 }}>{s.n}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  ),

  'webflow': (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#3ecf8e', marginBottom: 12 }}>EMBEDDING › WEBFLOW</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ededed', letterSpacing: '-0.03em', marginBottom: 12 }}>Webflow</h1>
        <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7 }}>Add the widget to your Webflow site through project settings.</p>
      </div>
      <Divider />
      {[
        { n: 1, title: 'Open project settings', desc: 'In the Webflow designer: click the W logo top-left → Project Settings.' },
        { n: 2, title: 'Go to Custom Code tab', desc: 'Click the "Custom Code" tab in project settings.' },
        { n: 3, title: 'Paste in Footer Code', desc: 'In the "Footer Code" section, paste your widgetforge script tag.' },
        { n: 4, title: 'Save and publish', desc: 'Click Save Changes, then publish your site. The widget will appear on all pages.' },
      ].map(s => (
        <div key={s.n} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#71717a', flexShrink: 0, marginTop: 2 }}>{s.n}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ededed', marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  ),
}

// ── TOC per section ──
const TOC: Record<string, string[]> = {
  'introduction': ['What is widgetforge', 'The problem we solve', 'The BYOK model', 'Tech stack'],
  'how-it-works': ['Script tag loads', 'Widget injects', 'Visitor sends message', 'Server lookup', 'Key decrypted', 'Reply returned', 'Full flowchart'],
  'widget-shadow-dom': ['The isolation problem', 'How widget.js works', 'V1 vs V2 mode'],
  'api-proxy': ['CORS headers', 'Dual mode', 'Provider differences'],
  'encryption': ['AES-256-GCM explained', 'What gets stored', 'Decryption flow'],
  'database-schema': ['profiles table', 'bots table'],
  'gemini': ['Getting a key', 'Model discovery', 'Recommended models'],
  'openai': ['Getting a key', 'Model discovery', 'Recommended models'],
  'anthropic': ['Getting a key', 'Model discovery', 'Recommended models'],
  'vercel-setup': ['Steps 1-6', 'Auto-deploys'],
  'environment-variables': ['All 5 variables'],
  'script-tag': ['What the bot ID does', 'Optional attributes'],
  'wordpress': ['Steps 1-4'],
  'shopify': ['Steps 1-4'],
  'webflow': ['Steps 1-4'],
}

// ── Main page ──
export default function DocsPage() {
  const [active, setActive] = useState('introduction')

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] font-sans">

      <Navbar activePage="docs" />

      <div className="flex flex-1">
        <Sidebar />

        {/* Scrollable Container for Docs */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', background: '#0c0c0c', color: '#ededed' }}>
          
          <div style={{ display: 'flex', width: '100%', maxWidth: 1400 }}>

            {/* Left sidebar (Docs Sections) */}
            <aside style={{ width: 240, flexShrink: 0, borderRight: '1px solid #1c1c1c', padding: '28px 16px 28px 24px', position: 'sticky', top: 52, height: 'calc(100vh - 52px)', overflowY: 'auto' }}>
          {SIDEBAR_GROUPS.map(group => (
            <div key={group.title} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: '#3f3f46', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8, paddingLeft: 10 }}>
                {group.title}
              </div>
              {group.links.map(link => (
                <button
                  key={link.id}
                  onClick={() => setActive(link.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '5px 10px', borderRadius: 6, marginBottom: 1,
                    fontSize: 13, fontWeight: active === link.id ? 500 : 400,
                    color: active === link.id ? '#3ecf8e' : '#71717a',
                    background: active === link.id ? '#0d2018' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    transition: 'color 0.1s ease, background 0.1s ease',
                  }}
                >
                  {link.name}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, background: '#0f0f0f', padding: '40px 48px 80px' }}>
          {SECTIONS[active] || (
            <div style={{ color: '#71717a', fontSize: 14 }}>Section not found.</div>
          )}
        </main>

        {/* Right TOC */}
        <aside style={{ width: 200, flexShrink: 0, padding: '40px 24px', position: 'sticky', top: 52, height: 'calc(100vh - 52px)', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#ededed', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            On this page
          </div>
          {(TOC[active] || []).map((item, i) => (
            <div key={i} style={{ fontSize: 12.5, color: i === 0 ? '#3ecf8e' : '#71717a', marginBottom: 8, cursor: 'pointer' }}>
              {item}
            </div>
          ))}
          </aside>
          </div>
        </div>
      </div>
    </div>
  )
}