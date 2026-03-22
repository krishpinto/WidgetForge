// components/BuilderContext.tsx
// ─────────────────────────────────────────────────────────────
// Shared state for the bot builder flow.
// All 4 nodes read and write from here.
//
// V2 difference from V1: when the user hits "Create Bot" in
// step 4, we POST to /api/bots which saves everything to the
// DB and gives back a real botId. The script tag then uses
// only that botId — no keys or prompts exposed.
// ─────────────────────────────────────────────────────────────
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface BuilderCtx {
  // Step 1
  provider: string
  key: string
  model: string
  models: string[]
  step1Done: boolean

  // Step 2
  systemPrompt: string
  scrapedText: string
  websiteUrl: string
  step2Done: boolean

  // Step 3 — preview messages
  previewMessages: ChatMessage[]

  // Step 4 — result after saving to DB
  botId: string
  botName: string
  saving: boolean
  saved: boolean

  // Setters
  setProvider: (v: string) => void
  setKey: (v: string) => void
  setModel: (v: string) => void
  setModels: (v: string[]) => void
  setSystemPrompt: (v: string) => void
  setScrapedText: (v: string) => void
  setWebsiteUrl: (v: string) => void
  setBotName: (v: string) => void
  addPreviewMessage: (m: ChatMessage) => void
  completeStep1: () => void
  completeStep2: () => void
  saveBot: () => Promise<void>
}

const BuilderContext = createContext<BuilderCtx | null>(null)

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState('')
  const [key, setKey] = useState('')
  const [model, setModel] = useState('')
  const [models, setModels] = useState<string[]>([])
  const [systemPrompt, setSystemPrompt] = useState('')
  const [scrapedText, setScrapedText] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [botName, setBotName] = useState('')
  const [previewMessages, setPreviewMessages] = useState<ChatMessage[]>([])
  const [step1Done, setStep1Done] = useState(false)
  const [step2Done, setStep2Done] = useState(false)
  const [botId, setBotId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveBot() {
    const finalBotName = botName.trim() || 'My Bot'
    if (!provider || !key || !model || !systemPrompt) return
    setSaving(true)

    try {
      const res = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalBotName,
          provider,
          model,
          apiKey: key,         // server will encrypt this
          systemPrompt,
          websiteUrl: websiteUrl || null,
          primaryColor: '#6366f1',
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setBotId(data.bot.id)
      setSaved(true)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <BuilderContext.Provider value={{
      provider, key, model, models, step1Done,
      systemPrompt, scrapedText, websiteUrl, step2Done,
      previewMessages, botId, botName, saving, saved,
      setProvider, setKey, setModel, setModels,
      setSystemPrompt, setScrapedText, setWebsiteUrl, setBotName,
      addPreviewMessage: m => setPreviewMessages(p => [...p, m]),
      completeStep1: () => setStep1Done(true),
      completeStep2: () => setStep2Done(true),
      saveBot,
    }}>
      {children}
    </BuilderContext.Provider>
  )
}

export const useBuilder = () => {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider')
  return ctx
}