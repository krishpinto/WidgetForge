'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  ArrowRight, Key, Terminal, CheckCircle2, Bolt, Lock, Code2, Sparkles, Github, Star, User
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Adjust this import path based on where you save the component
import { LightRays } from '@/components/ui/light-rays'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  // -- Framer Motion Scroll & Parallax Setup --
  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, { damping: 20, stiffness: 100 })

  // Parallax layers for Hero elements
  const heroTextY = useTransform(smoothScrollY, [0, 800], [0, 150])
  const heroOpacity = useTransform(smoothScrollY, [0, 400], [1, 0])
  const codeBlockY = useTransform(smoothScrollY, [0, 800], [0, -80])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email)
        if (user.user_metadata?.avatar_url) {
          setUserAvatar(user.user_metadata.avatar_url)
        } else if (user.user_metadata?.picture) {
          setUserAvatar(user.user_metadata.picture)
        }
      }
      setIsAuthChecking(false)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 flex items-center px-6 h-16 border-b ${
          scrolled 
            ? 'bg-zinc-950/70 backdrop-blur-xl border-zinc-800/50 shadow-lg shadow-black/20' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shadow-sm">
              <Bolt className="h-4 w-4 text-zinc-950 fill-zinc-950" />
            </div>
            <span className="font-bold tracking-tight text-lg z-10">widgetforge</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#product" className="hover:text-zinc-50 transition-colors">Product</Link>
            <Link href="/dashboard" className="hover:text-zinc-50 transition-colors">Dashboard</Link>
            <Link href="/docs" className="hover:text-zinc-50 transition-colors">Docs</Link>
          </div>

          <div className="flex items-center gap-5 text-sm font-medium z-10">
            <a
              href="https://github.com/krishpinto/WidgetForge"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </a>

            {isAuthChecking ? (
              <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 animate-pulse" />
            ) : userEmail ? (
              <Link href="/dashboard" className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-500 transition-colors flex items-center justify-center">
                {userAvatar ? (
                  <img src={userAvatar} alt="Dashboard" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-zinc-400" />
                )}
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
                  Sign in
                </Link>
                <Link href="/signup"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-all font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2"
                >
                  Start for free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-zinc-950">
        
        {/* Magic UI Light Rays restricted strictly to Hero */}
        <LightRays 
          color="rgba(16, 185, 129, 0.15)" 
          count={8} 
          speed={12} 
          blur={40} 
        />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Hero Left Content */}
          <motion.div 
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="flex flex-col items-start pt-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium mb-8 bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm text-zinc-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Free tier available — bring your own key
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-6xl md:text-7xl mb-6 font-bold tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500"
            >
              Your website deserves a <span className="text-emerald-400 bg-none">smarter chatbot.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl mb-10 max-w-xl text-zinc-400 leading-relaxed"
            >
              Describe your site. Pick your AI provider. Get one script tag. Deploy anywhere in 60 seconds without writing backend code.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <Link href="/signup" className="group px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all bg-zinc-100 text-zinc-950 hover:bg-white hover:scale-105 active:scale-95 shadow-lg">
                Build your bot free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/docs" className="px-6 py-3 rounded-lg font-semibold border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition-colors backdrop-blur-sm">
                View docs
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 text-sm font-mono text-zinc-500"
            >
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-zinc-400" /> AES-256 encrypted</span>
              <span className="flex items-center gap-2"><Key className="w-4 h-4 text-zinc-400" /> Bring your own key</span>
            </motion.div>
          </motion.div>

          {/* Hero Right Code Block */}
          <motion.div 
            style={{ y: codeBlockY }}
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="hidden lg:block relative"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 blur-3xl rounded-full" />
            
            <div className="rounded-xl p-6 border border-zinc-800/80 shadow-2xl relative z-10 w-full max-w-[520px] ml-auto bg-zinc-950/90 backdrop-blur-xl ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800/50 pb-4">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <span className="ml-2 text-xs font-mono text-zinc-500">index.html</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed overflow-x-auto text-zinc-300">
                <code>
                  <span className="text-indigo-400">&lt;!DOCTYPE</span> html<span className="text-indigo-400">&gt;</span>{'\n'}
                  <span className="text-indigo-400">&lt;html&gt;</span>{'\n'}
                  <span className="text-indigo-400">&lt;body&gt;</span>{'\n'}
                  {'  '}<span className="text-zinc-600">...</span>{'\n\n'}
                  {'  '}
                  <span className="text-zinc-500 italic">&lt;!-- Widgetforge Embed --&gt;</span>{'\n'}
                  {'  '}<span className="text-emerald-400">&lt;script</span>{'\n'}
                  {'    '}<span className="text-zinc-200">src</span>=<span className="text-amber-200">"https://widgetforge.com/widget.js"</span>{'\n'}
                  {'    '}<span className="text-zinc-200">data-bot-id</span>=<span className="text-amber-200">"bot_a3f9b2c1"</span><span className="text-emerald-400">&gt;</span>{'\n'}
                  {'  '}<span className="text-emerald-400">&lt;/script&gt;</span>{'\n'}
                  <span className="text-indigo-400">&lt;/body&gt;</span>{'\n'}
                  <span className="text-indigo-400">&lt;/html&gt;</span>
                </code>
              </pre>
            </div>
            <div className="absolute top-8 right-8 w-full h-full border border-zinc-800/50 rounded-xl bg-zinc-900/30 rotate-3 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ── 3D "How It Works" Section (Structured borders back) ── */}
      <section className="py-32 relative z-10 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-24"
          >
            <span className="text-xs font-bold uppercase tracking-widest block mb-4 text-emerald-500">Deployment Pipeline</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100">
              From zero to live in 60 seconds
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-y-1/2 z-0" />

            {[
              {
                step: '01', title: 'Describe', icon: <Terminal className="w-7 h-7" />, rotation: '-rotate-3',
                desc: 'Paste your website URL or drop a custom system prompt to immediately give your bot its personality and knowledge base.'
              },
              {
                step: '02', title: 'Preview & Connect', icon: <Sparkles className="w-7 h-7" />, rotation: 'rotate-2',
                desc: 'Test your bot live in the visual builder. Plug in your own Gemini, OpenAI, or Anthropic API key with zero markup.'
              },
              {
                step: '03', title: 'Embed Anywhere', icon: <Code2 className="w-7 h-7" />, rotation: '-rotate-2',
                desc: 'Copy the generated script tag and paste it right before the closing </body> tag. It just works, everywhere.'
              }
            ].map((s, i) => (
              <motion.div 
                key={s.step} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.2, type: "spring", bounce: 0.4 }}
                className="relative z-10 group"
              >
                <div className="relative h-full w-full max-w-[400px] mx-auto">
                  <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 blur-xl rounded-3xl transition-colors duration-500 z-0" />
                  
                  <div className={`absolute inset-0 border border-zinc-800/50 rounded-2xl bg-zinc-900/40 ${s.rotation} scale-105 group-hover:rotate-6 transition-transform duration-500 ease-out -z-10`} />
                  
                  <div className="relative h-full bg-zinc-950 border border-zinc-800/80 p-8 rounded-2xl shadow-xl flex flex-col items-start ring-1 ring-white/5 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                    <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-700/50 flex items-center justify-center mb-8 shadow-inner text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300">
                      {s.icon}
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-900 text-emerald-400 border border-emerald-500/20">
                        {s.step}
                      </span>
                      <h3 className="text-2xl font-bold text-zinc-100">{s.title}</h3>
                    </div>
                    
                    <p className="text-zinc-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Script Tag Showcase ── */}
      <section className="py-32 relative z-10 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl mb-6 font-bold tracking-tight text-zinc-100">
              One tag. <span className="text-zinc-500">Any website.</span>
            </h2>
            <p className="text-lg mb-8 text-zinc-400 leading-relaxed">
              Whether you use WordPress, Shopify, Webflow, or a custom React app. Just drop the tag in your HTML and instantly get a beautifully designed, intelligent chat assistant.
            </p>
            <ul className="space-y-4 mb-10 text-sm font-medium text-zinc-300">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Loads asynchronously (zero impact on page speed)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Fully responsive mobile and desktop UI</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Customizable primary brand colors</li>
            </ul>
            <Link href="/signup" className="group px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-all bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              Generate your tag <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-zinc-800/80 p-8 shadow-2xl bg-zinc-900/50 backdrop-blur-md relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="font-mono text-sm leading-loose relative z-10 text-zinc-300">
              <span className="text-zinc-500 italic">// Paste before &lt;/body&gt;</span><br />
              <span className="text-emerald-400">&lt;script</span><br />
              &nbsp;&nbsp;<span className="text-zinc-200">src</span>=<span className="text-amber-200">"https://widgetforge.com/widget.js"</span><br />
              &nbsp;&nbsp;<span className="text-zinc-200">data-bot-id</span>=<span className="text-amber-200">"bot_a3f9b2c1"</span><span className="text-emerald-400">&gt;</span><br />
              <span className="text-emerald-400">&lt;/script&gt;</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
              <Bolt className="h-3.5 w-3.5 text-zinc-400 fill-zinc-400" />
            </div>
            <span className="font-bold tracking-tight text-sm text-zinc-400">widgetforge</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-zinc-500">
            <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          </div>

          <div className="text-xs font-mono text-zinc-600">
            Built with Next.js + Supabase
          </div>
        </div>
      </footer>

    </div>
  )
}