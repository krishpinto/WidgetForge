'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Settings, Book, HelpCircle } from 'lucide-react'

interface SidebarProps {
  userEmail?: string
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  // Helper to check if a route is active
  const isActive = (path: string) => pathname === path

  // Supabase uses slightly thinner, 20px (w-5 h-5) icons for a clean, premium look
  const iconProps = { strokeWidth: 1.5, className: "w-5 h-5 shrink-0" }

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden md:flex flex-col z-40 shrink-0 transition-all duration-300 ease-in-out border-r border-[#1c1c1c] bg-[#0a0a0a] overflow-hidden" 
      style={{ 
        width: isHovered ? '220px' : '56px',
        height: 'calc(100vh - 52px)', 
        position: 'sticky', 
        top: '52px'
      }}
    >
      {/* Inner container keeps a fixed 220px width to prevent text from wrapping/jumping */}
      <div className="flex flex-col h-full w-[220px] p-2">
        
        {/* Project Label (Fades out when collapsed) */}
        <div 
          className="text-[11px] font-semibold mb-2 mt-2 tracking-widest uppercase px-3 transition-opacity duration-200 whitespace-nowrap" 
          style={{ color: '#71717a', opacity: isHovered ? 1 : 0 }}
        >
          Project
        </div>
        
        {/* Top Navigation */}
        <nav className="flex-1 space-y-1">
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors duration-200 ${isActive('/dashboard') ? 'bg-[#1c1c1c] text-[#ededed]' : 'text-[#71717a] hover:bg-white/5 hover:text-[#ededed]'}`}
          >
            <Home {...iconProps} />
            <span className="transition-opacity duration-200 whitespace-nowrap text-[13px] font-medium" style={{ opacity: isHovered ? 1 : 0 }}>
              Project Overview
            </span>
          </Link>
          
          <Link 
            href="/docs" 
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors duration-200 ${isActive('/docs') ? 'bg-[#1c1c1c] text-[#ededed]' : 'text-[#71717a] hover:bg-white/5 hover:text-[#ededed]'}`}
          >
            <Book {...iconProps} />
            <span className="transition-opacity duration-200 whitespace-nowrap text-[13px] font-medium" style={{ opacity: isHovered ? 1 : 0 }}>
              Documentation
            </span>
          </Link>
        </nav>
        
        {/* Bottom Section (Settings & Status Box) */}
        <div className="mt-auto space-y-2 pt-4">
          
          <Link 
            href="/dashboard/settings" 
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors duration-200 ${isActive('/dashboard/settings') ? 'bg-[#1c1c1c] text-[#ededed]' : 'text-[#71717a] hover:bg-white/5 hover:text-[#ededed]'}`}
          >
            <Settings {...iconProps} />
            <span className="transition-opacity duration-200 whitespace-nowrap text-[13px] font-medium" style={{ opacity: isHovered ? 1 : 0 }}>
              Project Settings
            </span>
          </Link>

          {/* Expanding Status Box */}
          <div 
            className={`rounded-lg transition-colors overflow-hidden flex flex-col justify-center ${isHovered ? 'bg-[#141414] border border-[#1c1c1c] p-3' : 'bg-transparent border border-transparent p-0'}`} 
            style={{ height: isHovered ? 'auto' : '40px' }}
          >
            {/* The 16px left padding perfectly centers the dot under the icons when collapsed */}
            <div className="flex items-center" style={{ paddingLeft: isHovered ? 0 : '16px' }}>
              
              {/* The Green Dot */}
              <div className="w-2 h-2 rounded-full bg-[#3ecf8e] shrink-0" style={{ boxShadow: '0 0 8px rgba(62, 207, 142, 0.4)' }}></div>
              
              {/* Status Text (Fades in) */}
              <div className="ml-3 flex flex-col transition-opacity whitespace-nowrap" style={{ opacity: isHovered ? 1 : 0 }}>
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#71717a] mb-0.5">Status</span>
                <span className="text-[10px] font-mono uppercase text-[#ededed] bg-[#1c1c1c] px-1.5 py-0.5 rounded w-fit border border-[#3f3f46]">Free Tier</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </aside>
  )
}