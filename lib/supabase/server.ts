// lib/supabase/server.ts
// ─────────────────────────────────────────────────────────────
// This is the Supabase client for the SERVER (API routes, server components).
// It reads the user's session from cookies on the server side.
//
// Why a separate client for server vs browser?
// On the server, Next.js needs to read cookies differently than
// the browser does. @supabase/ssr handles this for us — we just
// need to tell it how to get/set cookies in the Next.js way.
//
// Use this in:
//   - app/api/*/route.ts files
//   - Server components (no 'use client' at top)
//   - middleware.ts
//
// Usage:
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
// ─────────────────────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Next.js cookies() is async in App Router
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // How Supabase reads cookies from the request
        getAll() {
          return cookieStore.getAll()
        },
        // How Supabase sets cookies on the response
        // (e.g. when refreshing a session token)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll can fail in Server Components (read-only context)
            // This is fine — middleware handles the actual cookie refresh
          }
        },
      },
    }
  )
}