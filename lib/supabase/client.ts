// lib/supabase/client.ts
// ─────────────────────────────────────────────────────────────
// This is the Supabase client for the BROWSER (client components).
// It reads the user's session from cookies automatically.
//
// Use this in any file that has 'use client' at the top.
// Never use this in API routes or server components.
//
// Usage:
//   const supabase = createClient()
//   const { data: { user } } = await supabase.auth.getUser()
// ─────────────────────────────────────────────────────────────

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}