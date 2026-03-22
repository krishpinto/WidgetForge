// components/nodes/ScriptNode.tsx
// ─────────────────────────────────────────────────────────────
// Step 4 — the finish line.
// User names their bot, hits "Create Bot" → we POST to /api/bots
// → bot saved to DB → real botId returned → clean script tag shown.
//
// V2 key difference: script tag contains ONLY the botId.
// No API key, no prompt, nothing sensitive. Everything lives
// in the database, looked up by botId on each request.
// ─────────────────────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { useBuilder } from '@/components/BuilderContext'

export default function ScriptNode({}: NodeProps) {
  const { step2Done, botName, setBotName, saving, saved, botId, saveBot } = useBuilder()
  const [copied, setCopied] = useState(false)

  const locked = !step2Done

  // The clean V2 script tag — only botId, nothing sensitive
  const VERCEL_URL = process.env.NEXT_PUBLIC_APP_URL || 'YOUR_VERCEL_URL'
  const scriptTag = saved ? `<script
  src="${VERCEL_URL}/widget.js"
  data-bot-id="${botId}">
</script>` : ''

  async function copy() {
    if (!scriptTag) return
    await navigator.clipboard.writeText(scriptTag).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="nodrag nopan"
      onMouseDown={e => e.stopPropagation()}
      style={{
        width: 320,
        background: '#0c0c0e',
        border: '1px solid #1c1c22',
        borderRadius: 14,
        fontFamily: 'system-ui',
        overflow: 'hidden',
        opacity: locked ? 0.35 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: locked ? 'none' : 'all',
        boxShadow: saved ? '0 0 40px #f59e0b0c, 0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.4)',
      }}>

      {/* Header */}
      <div style={{
        padding: '11px 14px', borderBottom: '1px solid #161619',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          fontSize: 9.5, fontFamily: 'monospace', color: '#f59e0b',
          background: '#f59e0b18', border: '1px solid #f59e0b33',
          padding: '1px 6px', borderRadius: 4,
        }}>04</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#dddde8', letterSpacing: '-0.01em' }}>
          Ship It
        </span>
        {saved && <span style={{ marginLeft: 'auto', fontSize: 10.5, color: '#22c55e' }}>✓ created</span>}
      </div>

      <div style={{ padding: 13, display: 'flex', flexDirection: 'column', gap: 11 }}>

        {/* Bot name input — only shown before saving */}
        {!saved && (
          <div>
            <label style={{
              fontSize: 9.5, color: '#3a3a48', display: 'block',
              marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Bot Name
            </label>
            <input
              value={botName}
              onChange={e => setBotName(e.target.value)}
              placeholder="Support Bot, Sales Assistant..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#101012', border: '1px solid #1c1c22',
                borderRadius: 7, padding: '7px 10px',
                color: '#dddde8', fontSize: 12, outline: 'none',
                fontFamily: 'system-ui',
              }}
            />
          </div>
        )}

        {/* Create bot button */}
        {!saved && (
          <button
            onClick={saveBot}
            disabled={saving}
            style={{
              padding: '9px 12px', borderRadius: 7, border: 'none',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff', fontSize: 12.5, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 12px #f59e0b22',
            }}
          >
            {saving ? 'Creating...' : '🚀 Create Bot'}
          </button>
        )}

        {/* Script tag — only shown after saving */}
        {saved && (
          <>
            <div style={{
              background: '#070709', border: '1px solid #161619',
              borderRadius: 8, padding: '11px 12px',
            }}>
              <pre style={{
                margin: 0, fontSize: 11,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                color: '#6a7aa8', whiteSpace: 'pre-wrap',
                wordBreak: 'break-all', lineHeight: 1.7,
              }}>
                {scriptTag}
              </pre>
            </div>

            <button
              onClick={copy}
              style={{
                padding: '9px 12px', borderRadius: 7,
                border: copied ? '1px solid #22c55e44' : '1px solid #f59e0b33',
                background: copied ? '#22c55e0e' : '#f59e0b0e',
                color: copied ? '#22c55e' : '#fbbf24',
                fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {copied ? '✓ Copied!' : '⎘ Copy Script Tag'}
            </button>

            {/* What changed in V2 */}
            <div style={{
              padding: '10px 12px', background: '#0a0a0c',
              border: '1px solid #161619', borderRadius: 8,
              fontSize: 10.5, lineHeight: 1.7, color: '#3a3a48',
            }}>
              <div style={{
                color: '#22c55e', fontWeight: 600, marginBottom: 5,
                fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                🔒 Secure by default
              </div>
              Your API key and system prompt are stored encrypted in the database.
              The script tag contains only a bot ID — nothing sensitive is exposed.
            </div>
          </>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#f59e0b', border: '2px solid #080809', width: 8, height: 8 }}
      />
    </div>
  )
}