'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { 
  User, ChevronDown, Plug, LogOut, Settings, Book, Bolt, Github, Star, Search, HelpCircle, Bell 
} from 'lucide-react'
import { ConnectModal } from './ConnectModal'

interface NavbarProps {
  userEmail?: string
  activePage?: string
  onLogout?: () => void
}

export default function Navbar({ userEmail, onLogout }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 h-[52px] flex items-center justify-between px-4 border-b border-[#1c1c1c] bg-[#0a0a0a] font-sans">
      
      {/* ── Left: Logo & Breadcrumbs ── */}
      <div className="flex items-center gap-3">
        
        {/* Logo / Org Selector */}
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-[#3ecf8e]">
            <Bolt className="w-4 h-4 text-[#0a0a0a] fill-[#0a0a0a]" />
          </div>
          <span className="text-[#ededed] font-semibold text-sm mr-1">WidgetForge</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-[#3f3f46] text-[#71717a] font-semibold tracking-wider">
            FREE
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717a] ml-1" />
        </Link>

        {/* Separator */}
        <span className="text-[#3f3f46] text-sm">/</span>

        {/* Project Breadcrumb */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-4 h-4 rounded bg-[#1c1c1c] flex items-center justify-center border border-[#3f3f46]">
            <div className="w-2 h-2 rounded-sm bg-[#ededed]" />
          </div>
          <span className="text-[#ededed] transition-colors group-hover:text-white text-sm font-medium">
            widget
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
        </div>

        {/* Separator */}
        <span className="text-[#3f3f46] text-sm">/</span>

        {/* Environment Breadcrumb */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <span className="text-[#ededed] transition-colors group-hover:text-white text-sm font-medium">
            main
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-[#ca8a04] text-[#eab308] bg-[#ca8a04]/10 font-semibold tracking-wider">
            PRODUCTION
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
        </div>

        {/* Connect Button */}
        <button 
          onClick={() => setIsConnectModalOpen(true)}
          className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded border border-[#3f3f46] bg-transparent hover:bg-[#1c1c1c] text-[#ededed] text-[13px] font-medium transition-colors"
        >
          <Plug className="w-3.5 h-3.5" />
          Connect
        </button>
      </div>

      {/* ── Right: Utilities & Profile ── */}
      <div className="flex items-center gap-4">
        
      

        

        {/* Utility Icons */}
        <div className="flex items-center gap-1 border-r border-[#1c1c1c] pr-4 mr-1">
          <button className="p-1.5 bg-transparent border-none text-[#71717a] rounded hover:text-[#ededed] hover:bg-[#1c1c1c] transition-all">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="p-1.5 bg-transparent border-none text-[#71717a] rounded hover:text-[#ededed] hover:bg-[#1c1c1c] transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#ef4444] rounded-full border border-[#0a0a0a]" />
          </button>
        </div>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-7 h-7 rounded-full bg-[#1c1c1c] border border-[#3f3f46] flex items-center justify-center cursor-pointer p-0 overflow-hidden hover:border-[#71717a] transition-colors"
          >
            <User className="w-4 h-4 text-[#71717a]" />
          </button>

          {isProfileOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[220px] bg-[#141414] border border-[#1c1c1c] rounded-lg shadow-2xl p-1 z-50">
              <div className="p-3 border-b border-[#1c1c1c] mb-1">
                <div className="text-[11px] text-[#71717a] font-semibold uppercase tracking-wider mb-1">Signed in as</div>
                <div className="text-[13px] text-[#ededed] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {userEmail || 'user@example.com'}
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <a 
                  href="https://github.com/krishpinto/WidgetForge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#ededed] no-underline rounded hover:bg-[#1c1c1c] transition-colors"
                >
                  <Github className="w-4 h-4 text-[#71717a]" />
                  Star on GitHub
                  <Star className="w-3.5 h-3.5 text-[#eab308] fill-[#eab308] ml-auto" />
                </a>
                <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#ededed] no-underline rounded hover:bg-[#1c1c1c] transition-colors">
                  <Settings className="w-4 h-4 text-[#71717a]" />
                  Account Settings
                </Link>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#f87171] bg-transparent border-none cursor-pointer rounded w-full text-left hover:bg-[#2a1414] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
      
      <ConnectModal 
        isOpen={isConnectModalOpen} 
        onClose={() => setIsConnectModalOpen(false)} 
      />
    </header>
  )
}