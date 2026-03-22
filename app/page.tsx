'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Shield, Key, Layers, Cpu, Zap, GitBranch,
  Terminal, CheckCircle2, Bolt, Lock, Code2, Sparkles, Github, Star
} from 'lucide-react'



// ── Custom Hook for Scroll Animations ──
function useScrollReveal() {
  const [elements, setElements] = useState<Element[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            // Optional: stop observing once revealed
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [elements])

  const ref = (el: HTMLElement | null) => {
    if (el && !elements.includes(el)) {
      setElements((prev) => [...prev, el])
    }
  }

  return ref
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const revealRef = useScrollReveal()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ededed', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>

      {/* ── Global Styles & Animations ── */}
      <style>{`
        .reveal-hidden {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  opacity: 0;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        @keyframes float {
          0% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
        .typing-effect {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #3ecf8e;
          animation: typing 3s steps(40, end), blink 0.75s step-end infinite;
          max-width: fit-content;
        }

        .feature-card {
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4), 0 0 20px rgba(99, 102, 241, 0.1);
          transform: translateY(-2px);
        }
        .feature-card:hover .feature-icon {
          color: #6366f1 !important;
        }

        .dashed-line {
          background-image: linear-gradient(to right, #3f3f46 50%, rgba(255,255,255,0) 0%);
          background-position: top;
          background-size: 10px 1px;
          background-repeat: repeat-x;
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav
        style={{
          backgroundColor: scrolled ? 'rgba(12, 12, 12, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #1c1c1c' : '1px solid transparent',
          height: '64px',
        }}
        className="fixed top-0 w-full z-50 transition-all duration-300 flex items-center px-6"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#ededed' }}>
              <Bolt className="h-4 w-4" style={{ color: '#0a0a0a', fill: '#0a0a0a' }} />
            </div>
            <span className="font-bold tracking-tight text-lg">widgetforge</span>
          </div>

          {/* Center */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#71717a' }}>
            <Link href="#product" className="hover:text-white transition-colors">Product</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5 text-sm font-medium">
            {/* Landing Page GitHub Star Button */}
            <a 
              href="https://github.com/krishpinto/WidgetForge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[#ededed]"
              style={{ backgroundColor: '#141414', borderColor: '#27272a' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1c1c1c'; e.currentTarget.style.borderColor = '#3f3f46'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#141414'; e.currentTarget.style.borderColor = '#27272a'; }}
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
              <Star className="w-3.5 h-3.5" style={{ color: '#eab308', fill: '#eab308' }} />
            </a>

            <Link href="/login" style={{ color: '#71717a' }} className="hover:text-white transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link href="/signup" 
              style={{ backgroundColor: '#3ecf8e', color: '#0c0c0c' }} 
              className="px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 font-semibold"
            >
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Radial background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Hero Left Content */}
          <div className="flex flex-col items-start pt-10">
            <div className="reveal-hidden animate-[fadeUp_0.8s_forwards]" style={{ animationDelay: '0ms' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-8 border" style={{ borderColor: '#1c1c1c', backgroundColor: '#111111', color: '#ededed' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3ecf8e' }} />
                Free tier available — bring your own key
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl mb-6 reveal-hidden animate-[fadeUp_0.8s_forwards]" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, animationDelay: '100ms' }}>
              Your website deserves a <span style={{ color: '#3ecf8e' }}>smarter chatbot.</span>
            </h1>

            <p className="text-lg md:text-xl mb-10 max-w-xl reveal-hidden animate-[fadeUp_0.8s_forwards]" style={{ color: '#71717a', lineHeight: 1.6, animationDelay: '200ms' }}>
              Describe your site. Pick your AI provider. Get one script tag. Deploy anywhere in 60 seconds without writing backend code.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12 reveal-hidden animate-[fadeUp_0.8s_forwards]" style={{ animationDelay: '300ms' }}>
              <Link href="/signup" className="px-6 py-3 rounded-md font-semibold flex items-center gap-2 transition-transform hover:scale-105" style={{ backgroundColor: '#ededed', color: '#0a0a0a' }}>
                Build your bot free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/docs" className="px-6 py-3 rounded-md font-semibold border transition-colors hover:bg-white/5" style={{ borderColor: '#3f3f46', color: '#ededed' }}>
                View docs
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm font-mono reveal-hidden animate-[fadeUp_0.8s_forwards]" style={{ color: '#71717a', animationDelay: '400ms' }}>
              <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> AES-256 encrypted</span>
              <span className="flex items-center gap-2"><Key className="w-4 h-4" /> Bring your own key</span>
              <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Shadow DOM isolated</span>
            </div>
          </div>

          {/* Hero Right Code Block */}
          <div className="hidden lg:block relative reveal-hidden animate-[fadeUp_0.8s_forwards]" style={{ animationDelay: '300ms' }}>
            <div className="animate-float rounded-xl p-6 border shadow-2xl relative z-10 w-full max-w-[500px] ml-auto" style={{ backgroundColor: '#0d0d0d', borderColor: '#1c1c1c' }}>
              <div className="flex items-center gap-2 mb-4 border-b pb-4" style={{ borderColor: '#1c1c1c' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
                <span className="ml-2 text-xs font-mono" style={{ color: '#71717a' }}>index.html</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                <code style={{ color: '#71717a' }}>
                  <span style={{ color: '#6366f1' }}>&lt;!DOCTYPE</span> html<span style={{ color: '#6366f1' }}>&gt;</span>{'\n'}
                  <span style={{ color: '#6366f1' }}>&lt;html&gt;</span>{'\n'}
                  <span style={{ color: '#6366f1' }}>&lt;body&gt;</span>{'\n'}
                  {'  '}...{'\n\n'}
                  {'  '}
                  <span style={{ color: '#3f3f46' }}>&lt;!-- Widgetforge Embed --&gt;</span>{'\n'}
                  {'  '}<span style={{ color: '#6366f1' }}>&lt;script</span>{'\n'}
                  {'    '}<span style={{ color: '#3ecf8e' }}>src</span>=<span style={{ color: '#eab308' }}>"https://widgetforge.com/widget.js"</span>{'\n'}
                  {'    '}<span style={{ color: '#3ecf8e' }}>data-bot-id</span>=<span style={{ color: '#eab308' }}>"bot_a3f9b2c1"</span><span style={{ color: '#6366f1' }}>&gt;</span>{'\n'}
                  {'  '}<span style={{ color: '#6366f1' }}>&lt;/script&gt;</span>{'\n'}
                  <span style={{ color: '#6366f1' }}>&lt;/body&gt;</span>{'\n'}
                  <span style={{ color: '#6366f1' }}>&lt;/html&gt;</span>
                </code>
              </pre>
            </div>
            {/* Decorative background element behind code block */}
            <div className="absolute top-10 right-10 w-full h-full border rounded-xl" style={{ borderColor: '#1c1c1c', backgroundColor: '#111111', transform: 'rotate(-4deg)', zIndex: 0 }} />
          </div>

        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-32 border-t" style={{ borderColor: '#1c1c1c', backgroundColor: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 reveal-hidden" ref={revealRef}>
            <span className="text-xs font-bold uppercase tracking-widest block mb-4" style={{ color: '#71717a' }}>How it works</span>
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700, letterSpacing: '-0.04em', color: '#ededed' }}>
              From zero to deployed in 60 seconds
            </h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-12 text-center reveal-hidden" ref={revealRef}>
            {/* Connecting Dashed Line (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px dashed-line z-0" />

            {[
              {
                step: '1', title: 'Describe', icon: <Terminal className="w-6 h-6" />,
                desc: 'Paste your website URL or write a custom system prompt to give your bot its personality.'
              },
              {
                step: '2', title: 'Preview', icon: <Sparkles className="w-6 h-6" />,
                desc: 'Test your bot live in the builder. Bring your own Gemini, OpenAI, or Anthropic API key.'
              },
              {
                step: '3', title: 'Embed', icon: <Code2 className="w-6 h-6" />,
                desc: 'Copy the single script tag and paste it before the closing </body> tag on any website.'
              }
            ].map((s, i) => (
              <div key={s.step} className={`relative z-10 flex flex-col items-center delay-${(i + 1) * 100}`}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border-4" style={{ backgroundColor: '#111111', borderColor: '#0a0a0a', boxShadow: '0 0 0 1px #1c1c1c' }}>
                  <div style={{ color: '#ededed' }}>{s.icon}</div>
                </div>
                <div className="text-xs font-mono font-bold mb-3 px-2 py-1 rounded border inline-block" style={{ backgroundColor: '#1c1c1c', borderColor: '#3f3f46', color: '#ededed' }}>
                  STEP 0{s.step}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#ededed' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: '#71717a', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-32 border-t relative" style={{ borderColor: '#1c1c1c', backgroundColor: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 reveal-hidden" ref={revealRef}>
            <h2 className="text-3xl md:text-4xl" style={{ fontWeight: 700, letterSpacing: '-0.04em', color: '#ededed' }}>
              Everything you need.<br />Nothing you don't.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-hidden delay-100" ref={revealRef}>
            {[
              { title: 'BYOK Model', icon: <Key />, desc: 'Bring your own API key. You pay the AI provider directly. We charge zero markup on tokens.' },
              { title: 'AES-256 Encryption', icon: <Shield />, desc: 'Your API keys are encrypted at rest using AES-256-GCM. They are decrypted only in memory during requests.' },
              { title: 'Shadow DOM Isolated', icon: <Layers />, desc: 'The widget runs in an isolated Shadow DOM. Your website\'s CSS will never break the chat UI.' },
              { title: '3 Elite Providers', icon: <Cpu />, desc: 'Natively supports Google Gemini, OpenAI (GPT-4), and Anthropic (Claude 3.5). Switch anytime.' },
              { title: 'Dynamic Model Sync', icon: <Zap />, desc: 'We securely query your provider to fetch the exact AI models your specific key has access to in real-time.' },
              { title: 'React Flow Builder', icon: <GitBranch />, desc: 'Visualize your bot\'s logic visually before deploying. No black-box configuration.' },
            ].map((f) => (
              <div key={f.title} className="feature-card p-8 rounded-xl border flex flex-col" style={{ backgroundColor: '#111111', borderColor: '#1c1c1c' }}>
                <div className="feature-icon mb-6 transition-colors" style={{ color: '#71717a' }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#ededed' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#71717a', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Script Tag Showcase ── */}
      <section className="py-32 border-t overflow-hidden" style={{ borderColor: '#1c1c1c', backgroundColor: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div className="reveal-hidden" ref={revealRef}>
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', color: '#ededed' }}>
              One tag. Any website.
            </h2>
            <p className="text-lg mb-8" style={{ color: '#71717a', lineHeight: 1.7 }}>
              Whether you use WordPress, Shopify, Webflow, or a custom React app. Just drop the tag in your HTML and instantly get a beautifully designed, intelligent chat assistant.
            </p>
            <ul className="space-y-4 mb-10 text-sm font-medium" style={{ color: '#ededed' }}>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" style={{ color: '#3ecf8e' }} /> Loads asynchronously (zero impact on page speed)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" style={{ color: '#3ecf8e' }} /> Fully responsive mobile and desktop UI</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" style={{ color: '#3ecf8e' }} /> Customizable primary brand colors</li>
            </ul>
            <Link href="/signup" className="px-6 py-3 rounded-md font-semibold inline-block transition-transform hover:scale-105" style={{ backgroundColor: '#3ecf8e', color: '#0c0c0c' }}>
              Generate your tag →
            </Link>
          </div>

          <div className="rounded-xl border p-8 shadow-2xl reveal-hidden delay-200" ref={revealRef} style={{ backgroundColor: '#0d0d0d', borderColor: '#1c1c1c' }}>
            <div className="font-mono text-sm leading-loose">
              <span style={{ color: '#3f3f46' }}>// Paste before &lt;/body&gt;</span><br />
              <span style={{ color: '#6366f1' }}>&lt;script</span><br />
              &nbsp;&nbsp;<span style={{ color: '#3ecf8e' }}>src</span>=<span style={{ color: '#eab308' }}>"https://widgetforge.com/widget.js"</span><br />
              &nbsp;&nbsp;<span className="typing-effect">
                <span style={{ color: '#3ecf8e' }}>data-bot-id</span>=<span style={{ color: '#eab308' }}>"bot_a3f9b2c1"</span><span style={{ color: '#6366f1' }}>&gt;</span>
              </span><br />
              <span style={{ color: '#6366f1' }}>&lt;/script&gt;</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12" style={{ borderColor: '#1c1c1c', backgroundColor: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#3f3f46' }}>
              <Bolt className="h-3 w-3" style={{ color: '#0a0a0a', fill: '#0a0a0a' }} />
            </div>
            <span className="font-bold tracking-tight text-sm" style={{ color: '#71717a' }}>widgetforge</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium" style={{ color: '#71717a' }}>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>

          <div className="text-xs font-mono" style={{ color: '#3f3f46' }}>
            Built with Next.js + Supabase
          </div>
        </div>
      </footer>

    </div>
  )
}