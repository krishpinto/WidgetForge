// app/api/auth/create-profile/route.ts
// ─────────────────────────────────────────────────────────────
// Called immediately after Supabase creates a new auth user.
// Creates the matching row in our profiles table.
//
// Why a separate API route for this?
// Drizzle only runs on the server. The signup page is a client
// component. So we need an API route to bridge the gap —
// the client calls this route, this route uses Drizzle to
// insert into the DB.
//
// This is the pattern you'll use everywhere:
// Client component → fetch('/api/something') → Drizzle → Supabase DB
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'

export async function POST(req: NextRequest) {
  const { userId, email } = await req.json()

  if (!userId || !email) {
    return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 })
  }

  try {
    // Insert a new row into profiles table
    // This is Drizzle ORM in action — no raw SQL, fully type-safe
    await db.insert(profiles).values({
      id: userId,      // same UUID as auth.users
      email,
      tier: 'free',    // everyone starts on free tier
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    // If profile already exists (e.g. double submit), just ignore
    if (err.code === '23505') {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}