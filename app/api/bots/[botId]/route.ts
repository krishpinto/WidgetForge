// app/api/bots/[botId]/route.ts
// ─────────────────────────────────────────────────────────────
// GET    /api/bots/[botId]  → returns a single bot (for the edit page)
// DELETE /api/bots/[botId]  → deletes a bot
//
// [botId] is a dynamic route segment — Next.js passes it
// as params.botId in the function arguments.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { bots } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// ── GET /api/bots/[botId] ──
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { botId } = await params

  // and() chains multiple WHERE conditions
  // We check both id AND user_id so users can't read each other's bots
  const [bot] = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, user.id)))

  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

  return NextResponse.json({
    bot: { ...bot, encryptedApiKey: undefined, hasApiKey: true }
  })
}

// ── PATCH /api/bots/[botId] ──
// Updates name, systemPrompt, primaryColor
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { botId } = await params
  const { name, systemPrompt, primaryColor } = await req.json()

  await db
    .update(bots)
    .set({
      ...(name && { name }),
      ...(systemPrompt && { systemPrompt }),
      ...(primaryColor && { primaryColor }),
      updatedAt: new Date(),
    })
    .where(and(eq(bots.id, botId), eq(bots.userId, user.id)))

  return NextResponse.json({ success: true })
}

// ── DELETE /api/bots/[botId] ──
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { botId } = await params

  await db
    .delete(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, user.id)))

  return NextResponse.json({ success: true })
}