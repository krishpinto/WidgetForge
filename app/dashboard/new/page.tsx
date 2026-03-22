// app/dashboard/new/page.tsx
// ─────────────────────────────────────────────────────────────
// The bot builder — same React Flow canvas aesthetic as V1.
// 4 nodes connected by animated edges, left to right.
// On completion, bot is saved to DB and user gets a script tag
// with only the botId — no keys or prompts exposed.
// ─────────────────────────────────────────────────────────────
'use client'

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  ConnectionMode,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Link from 'next/link'

import { BuilderProvider } from '@/components/BuilderContext'
import ProviderNode from '@/components/nodes/ProviderNode'
import PromptNode from '@/components/nodes/PromptNode'
import PreviewNode from '@/components/nodes/PreviewNode'
import ScriptNode from '@/components/nodes/ScriptNode'

const nodeTypes = {
  provider: ProviderNode,
  prompt: PromptNode,
  preview: PreviewNode,
  script: ScriptNode,
}

const NODES: Node[] = [
  { id: '1', type: 'provider', position: { x: 60,   y: 80 }, data: {} },
  { id: '2', type: 'prompt',   position: { x: 440,  y: 60 }, data: {} },
  { id: '3', type: 'preview',  position: { x: 860,  y: 40 }, data: {} },
  { id: '4', type: 'script',   position: { x: 1300, y: 80 }, data: {} },
]

const EDGES: Edge[] = [
  {
    id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true,
    style: { stroke: '#6366f1', strokeWidth: 1.5, opacity: 0.5 },
  },
  {
    id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 1.5, opacity: 0.5 },
  },
  {
    id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true,
    style: { stroke: '#10b981', strokeWidth: 1.5, opacity: 0.5 },
  },
]

export default function NewBotPage() {
  return (
    <BuilderProvider>
      <div style={{ width: '100vw', height: '100vh', background: '#080809', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{
          height: 52, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 20px',
          borderBottom: '1px solid #111115', background: '#080809',
          flexShrink: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <span style={{ color: '#3a3a48', fontSize: 12, cursor: 'pointer' }}>← Dashboard</span>
            </Link>
            <span style={{ color: '#1c1c22' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L9.5 9.5H2L8 13.5L5.5 21L12 17L18.5 21L16 13.5L22 9.5H14.5L12 2Z"/>
                </svg>
              </div>
              <span style={{ color: '#dddde8', fontSize: 13, fontWeight: 600, letterSpacing: '-0.02em' }}>
                New Bot
              </span>
            </div>
          </div>

          <span style={{ color: '#2a2a38', fontSize: 11 }}>
            Describe your website. Get an embeddable AI chatbot in 60 seconds.
          </span>

          <div style={{ width: 120 }} />
        </div>

        {/* Canvas */}
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={NODES}
            edges={EDGES}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.3, minZoom: 0.4, maxZoom: 1 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnScroll
            zoomOnScroll
            minZoom={0.2}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
            style={{ background: '#080809' }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#141418" />
          </ReactFlow>
        </div>
      </div>
    </BuilderProvider>
  )
}