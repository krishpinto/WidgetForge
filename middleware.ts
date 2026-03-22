// middleware.ts
// ─────────────────────────────────────────────────────────────
// Next.js middleware runs on EVERY request before it hits
// your pages or API routes. We use it for two things:
//
// 1. SESSION REFRESH — Supabase auth tokens expire. Middleware
//    silently refreshes them so users don't get randomly logged out.
//
// 2. ROUTE PROTECTION — if a user hits /dashboard without being
//    logged in, redirect them to /login automatically.
//
// The matcher at the bottom tells Next.js which routes to run
// this middleware on — we skip static files and images.
// ─────────────────────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // We need a mutable response so we can set cookies on it
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set cookies on both request and response
          // This keeps the session in sync across the request lifecycle
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This refreshes the session if it's expired — IMPORTANT
  // Don't remove this line even if it looks unused
  const { data: { user } } = await supabase.auth.getUser()

  // ── Route protection ──
  // If user is not logged in and tries to access /dashboard, redirect to /login
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/signup')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user IS logged in and tries to visit /login, redirect to /dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on all routes except static files, images, and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}