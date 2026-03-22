// app/api/bots/route.ts
// ─────────────────────────────────────────────────────────────
// GET  /api/bots        → returns all bots for the logged-in user
// POST /api/bots        → creates a new bot, returns the botId
//
// Both routes are protected — if the user isn't logged in,
// they get a 401. We check this using the Supabase server client
// which reads the session from cookies.
//
// This is the first real example of the full V2 pattern:
// Auth check → Drizzle query → response
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { bots } from '@/db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'
import { encrypt } from '@/lib/encryption'

// ── GET /api/bots ──
// Returns all bots belonging to the logged-in user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Drizzle query — select all bots where user_id matches
  // eq() is Drizzle's equals operator — like WHERE user_id = 'xxx'
  const userBots = await db
    .select()
    .from(bots)
    .where(eq(bots.userId, user.id))

  // Don't send encrypted API keys to the frontend
  // The frontend only needs to know the key exists, not its value
  const safeBots = userBots.map(bot => ({
    ...bot,
    encryptedApiKey: undefined,
    hasApiKey: true,
  }))

  return NextResponse.json({ bots: safeBots })
}

// ── POST /api/bots ──
// Creates a new bot, returns the full bot object including botId
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, provider, model, apiKey, systemPrompt, websiteUrl, primaryColor } = body

  if (!name || !provider || !model || !apiKey || !systemPrompt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Check free tier bot limit (max 3 bots)
  const existingBots = await db
    .select()
    .from(bots)
    .where(eq(bots.userId, user.id))

  // TODO: check user tier from profiles table for paid users
  if (existingBots.length >= 3) {
    return NextResponse.json(
      { error: 'Free tier limit reached. Max 3 bots.' },
      { status: 403 }
    )
  }

  // Generate a clean bot ID — this goes in the script tag
  // Format: bot_<8 random hex chars> e.g. bot_a3f9b2c1
  const botId = `bot_${crypto.randomBytes(4).toString('hex')}`

  // Encrypt the API key before storing
  const encryptedApiKey = encrypt(apiKey)

  // Drizzle insert — fully type-safe, TypeScript will error if
  // you pass a wrong field name or wrong type
  const [newBot] = await db.insert(bots).values({
    id: botId,
    userId: user.id,
    name,
    provider,
    model,
    encryptedApiKey,
    systemPrompt,
    websiteUrl: websiteUrl || null,
    primaryColor: primaryColor || '#6366f1',
  }).returning() // .returning() gives us back the inserted row

  return NextResponse.json({
    bot: {
      ...newBot,
      encryptedApiKey: undefined, // never send this to frontend
      hasApiKey: true,
    }
  })
}