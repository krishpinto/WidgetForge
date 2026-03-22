// app/signup/page.tsx
// ─────────────────────────────────────────────────────────────
// Signup page. Creates a Supabase auth user, then creates a
// matching row in our profiles table via /api/auth/signup.
//
// Flow:
// 1. User fills email + password → clicks Sign up
// 2. Supabase creates the auth.users row
// 3. We call our own API to create the profiles row
// 4. Redirect to /dashboard
// ─────────────────────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup() {
    if (!email || !password) return
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')

    // Step 1 — create the Supabase auth user
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    // Step 2 — create our profiles row in the DB
    // We do this via an API route because Drizzle runs on the server
    if (data.user) {
      await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id, email }),
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080809',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui',
    }}>
      <div style={{
        width: 360,
        background: '#0c0c0e',
        border: '1px solid #1c1c22',
        borderRadius: 16,
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L9.5 9.5H2L8 13.5L5.5 21L12 17L18.5 21L16 13.5L22 9.5Z"/>
            </svg>
          </div>
          <span style={{ color: '#f0f0f2', fontSize: 15, fontWeight: 700, letterSpacing: '-0.03em' }}>
            widgetforge
          </span>
        </div>

        <div>
          <div style={{ color: '#dddde8', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Create your account
          </div>
          <div style={{ color: '#3a3a48', fontSize: 12.5, marginTop: 3 }}>
            Free tier — 3 bots, bring your own key
          </div>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, color: '#3a3a48', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
            placeholder="you@example.com"
            style={{
              background: '#101012', border: '1px solid #1c1c22',
              borderRadius: 8, padding: '9px 12px',
              color: '#dddde8', fontSize: 13, outline: 'none',
              fontFamily: 'system-ui',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, color: '#3a3a48', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
            placeholder="Min 6 characters"
            style={{
              background: '#101012', border: '1px solid #1c1c22',
              borderRadius: 8, padding: '9px 12px',
              color: '#dddde8', fontSize: 13, outline: 'none',
              fontFamily: 'system-ui',
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontSize: 11.5, color: '#f87171',
            background: '#ef444410', border: '1px solid #ef444420',
            borderRadius: 7, padding: '8px 12px',
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSignup}
          disabled={loading || !email || !password}
          style={{
            padding: '10px',
            borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: 13.5, fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            opacity: (!email || !password) ? 0.5 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {loading ? 'Creating account...' : 'Create account →'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: '#3a3a48' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#6366f1', textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}