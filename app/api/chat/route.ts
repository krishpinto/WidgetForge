// app/api/chat/route.ts
// ─────────────────────────────────────────────────────────────
// POST /api/chat
//
// V2 version — accepts EITHER:
//   1. { botId, messages }          ← production mode (widget on external site)
//      Looks up provider/key/prompt from DB using botId
//
//   2. { provider, key, model, systemPrompt, messages }  ← preview mode
//      Used by the builder's live preview node
//      Key comes directly from the request (never stored)
//
// This dual mode means the same endpoint serves both the
// builder preview AND the real embedded widget.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { bots } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { decrypt } from '@/lib/encryption'

export async function POST(req: NextRequest) {
  const body = await req.json()

  let provider: string
  let key: string
  let model: string
  let systemPrompt: string
  const { messages } = body

  if (body.botId) {
    // ── Production mode — look up config from DB ──
    const [bot] = await db
      .select()
      .from(bots)
      .where(eq(bots.id, body.botId))

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    provider = bot.provider
    model = bot.model
    systemPrompt = bot.systemPrompt
    key = decrypt(bot.encryptedApiKey) // decrypt the stored key

    // Increment message count (fire and forget — don't await)
    db.update(bots)
      .set({ messageCount: bot.messageCount + 1 })
      .where(eq(bots.id, body.botId))
      .catch(() => {}) // ignore errors here

  } else {
    // ── Preview mode — config comes directly from request ──
    provider = body.provider
    key = body.key
    model = body.model
    systemPrompt = body.systemPrompt
  }

  if (!provider || !key || !model || !messages) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    if (provider === 'gemini') return await chatGemini({ key, model, systemPrompt, messages })
    if (provider === 'openai') return await chatOpenAI({ key, model, systemPrompt, messages })
    if (provider === 'anthropic') return await chatAnthropic({ key, model, systemPrompt, messages })

    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chat failed' }, { status: 500 })
  }
}

async function chatGemini({ key, model, systemPrompt, messages }: any) {
  const contents = messages.map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `Gemini ${res.status}`)
  }

  const data = await res.json()
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!reply) throw new Error('Gemini returned empty response')
  return NextResponse.json({ reply })
}

async function chatOpenAI({ key, model, systemPrompt, messages }: any) {
  const openAIMessages = [
    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
    ...messages,
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages: openAIMessages, temperature: 0.7, max_tokens: 1024 }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `OpenAI ${res.status}`)
  }

  const data = await res.json()
  const reply = data.choices?.[0]?.message?.content
  if (!reply) throw new Error('OpenAI returned empty response')
  return NextResponse.json({ reply })
}

async function chatAnthropic({ key, model, systemPrompt, messages }: any) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, system: systemPrompt || undefined, messages, max_tokens: 1024 }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `Anthropic ${res.status}`)
  }

  const data = await res.json()
  const reply = data.content?.find((b: any) => b.type === 'text')?.text
  if (!reply) throw new Error('Anthropic returned empty response')
  return NextResponse.json({ reply })
}