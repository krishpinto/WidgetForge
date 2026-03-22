// app/page.tsx
// ─────────────────────────────────────────────────────────────
// Landing page. Dark, sharp, developer-focused.
// Nav routes to /login and /dashboard.
// Hero has the main CTA — "Get Started Free" → /signup
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#07070a',
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      color: '#e8e8f0',
      overflowX: 'hidden',
    }}>

      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gridScroll {
          from { transform: translateY(0); }
          to   { transform: translateY(40px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        .fade-1 { animation: fadeUp 0.7s ease both; }
        .fade-2 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-3 { animation: fadeUp 0.7s ease 0.2s both; }
        .fade-4 { animation: fadeUp 0.7s ease 0.35s both; }
        .fade-5 { animation: fadeUp 0.7s ease 0.5s both; }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          background: #e8e8f0;
          color: #07070a;
          border: none;
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .cta-primary:hover {
          background: #fff;
          transform: translateY(-1px);
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          background: transparent;
          color: #6a6a7a;
          border: 1px solid #1e1e28;
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .cta-secondary:hover {
          color: #b0b0c0;
          border-color: #2e2e3a;
        }

        .nav-link {
          font-size: 12px;
          color: #4a4a5a;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.15s ease;
        }
        .nav-link:hover { color: #9090a0; }

        .code-tag {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #4a4a62;
          background: #0e0e14;
          border: 1px solid #1a1a24;
          border-radius: 4px;
          padding: 2px 6px;
        }

        .script-block {
          background: #0b0b10;
          border: 1px solid #1a1a26;
          border-radius: 10px;
          padding: 20px 24px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          line-height: 1.8;
          color: #3a3a52;
          position: relative;
        }
        .script-block .tag   { color: #5a5a7a; }
        .script-block .attr  { color: #6060a0; }
        .script-block .val   { color: #4a7a6a; }
        .script-block .bot   { color: #8080c0; }
        .script-block .close { color: #5a5a7a; }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.04em;
        }

        .stat-card {
          background: #0b0b10;
          border: 1px solid #161620;
          border-radius: 8px;
          padding: 16px 20px;
          flex: 1;
        }
      `}</style>

      {/* ── Grid background ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── Radial glow center ── */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 600,
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'glow 4s ease-in-out infinite',
      }} />

      {/* ── Nav ── */}
      <nav className="fade-1" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: 52,
        borderBottom: '1px solid #0f0f18',
        background: 'rgba(7,7,10,0.85)',
        backdropFilter: 'blur(16px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L9.5 9.5H2L8 13.5L5.5 21L12 17L18.5 21L16 13.5L22 9.5H14.5L12 2Z"/>
            </svg>
          </div>
          <span style={{
            fontSize: 14, fontWeight: 500,
            color: '#d0d0e0', letterSpacing: '-0.03em',
          }}>
            widget
          </span>
          <span className="pill" style={{ background: '#12121c', border: '1px solid #1e1e2c', color: '#404060' }}>
            v2
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link href="#how-it-works" className="nav-link">how it works</Link>
          <Link href="#pricing" className="nav-link">pricing</Link>
          <Link href="/dashboard" className="nav-link">dashboard</Link>
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" className="cta-secondary" style={{ padding: '6px 16px', fontSize: 12 }}>
            sign in
          </Link>
          <Link href="/signup" className="cta-primary" style={{ padding: '6px 16px', fontSize: 12 }}>
            get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        minHeight: 'calc(100vh - 52px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
        gap: 0,
      }}>

        {/* Badge */}
        <div className="fade-1 pill" style={{
          background: '#0e0e18',
          border: '1px solid #1e1e2e',
          color: '#6060a0',
          marginBottom: 32,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'glow 2s ease-in-out infinite' }} />
          bring your own key — pay nothing
        </div>

        {/* Headline */}
        <h1 className="fade-2" style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 300,
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          color: '#e8e8f0',
          maxWidth: 760,
          marginBottom: 20,
        }}>
          Describe your website.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Get an embeddable AI chatbot
          </span>
          {' '}in 60 seconds.
        </h1>

        {/* Subheadline */}
        <p className="fade-3" style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          color: '#3a3a50',
          maxWidth: 480,
          lineHeight: 1.65,
          marginBottom: 36,
          fontWeight: 300,
        }}>
          Bring your own Gemini, OpenAI, or Anthropic key.
          We generate the bot, encrypt your key, and give you
          a single script tag. Paste it anywhere.
        </p>

        {/* CTAs */}
        <div className="fade-4" style={{ display: 'flex', gap: 10, marginBottom: 60, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" className="cta-primary">
            Build your bot free →
          </Link>
          <Link href="/login" className="cta-secondary">
            sign in
          </Link>
        </div>

        {/* Script tag preview */}
        <div className="fade-5" style={{ width: '100%', maxWidth: 520 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
            justifyContent: 'flex-start',
          }}>
            <span className="code-tag">paste on any site</span>
          </div>
          <div className="script-block">
            <span className="tag">&lt;script</span>{'\n'}
            {'  '}<span className="attr">src</span>=<span className="val">"https://widget.vercel.app/widget.js"</span>{'\n'}
            {'  '}<span className="attr">data-bot-id</span>=<span className="bot">"bot_a3f9b2c1"</span><span className="tag">&gt;</span>{'\n'}
            <span className="close">&lt;/script&gt;</span>
            {/* Cursor blink */}
            <span style={{
              display: 'inline-block',
              width: 7, height: 14,
              background: '#6366f1',
              marginLeft: 2,
              verticalAlign: 'middle',
              animation: 'blink 1.2s ease-in-out infinite',
              borderRadius: 1,
            }} />
          </div>
          <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 12,
            justifyContent: 'flex-start',
          }}>
            {['no api key exposed', 'shadow dom isolated', 'byok — free forever'].map(t => (
              <span key={t} style={{ fontSize: 10, color: '#2e2e42', fontFamily: "'DM Mono', monospace" }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="fade-5" style={{
          display: 'flex',
          gap: 12,
          marginTop: 64,
          width: '100%',
          maxWidth: 520,
        }}>
          {[
            { num: '3',         label: 'providers supported' },
            { num: 'AES-256',   label: 'key encryption' },
            { num: '1',         label: 'script tag' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 20, fontWeight: 500, color: '#c0c0d8', letterSpacing: '-0.03em', marginBottom: 3 }}>
                {s.num}
              </div>
              <div style={{ fontSize: 10, color: '#2e2e42', letterSpacing: '0.04em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}