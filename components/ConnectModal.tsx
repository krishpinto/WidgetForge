'use client'

import { useState } from 'react'
import { Check, Copy, Zap, Code, LayoutTemplate } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [copiedScript, setCopiedScript] = useState(false)
  const scriptTag = `<script src="https://widgetforge.com/script.js" data-project="widget-123"></script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a] border-[#1c1c1c] text-[#ededed]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#3ecf8e]" />
            Connect WidgetForge
          </DialogTitle>
          <DialogDescription className="text-[#71717a]">
            Follow these simple steps to integrate the widget into your application.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-2 relative">
          
          {/* Connecting line between steps */}
          <div className="absolute left-[15px] top-6 bottom-10 w-[1px] bg-[#1c1c1c]" />

          {/* Step 1 */}
          <div className="flex gap-4 group relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#3f3f46] flex items-center justify-center text-sm font-medium group-hover:border-[#3ecf8e] group-hover:text-[#3ecf8e] transition-colors bg-opacity-100">
                1
              </div>
            </div>
            <div className="flex-1 pb-2">
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#71717a]" /> 
                Add the Script
              </h3>
              <p className="text-xs text-[#71717a] mb-3">
                Paste this script tag just before the closing <code className="text-[#3ecf8e] bg-[#141414] px-1 py-0.5 rounded">&lt;/body&gt;</code> tag of your HTML.
              </p>
              <div className="relative rounded-md border border-[#1c1c1c] bg-[#141414] p-3 font-mono text-[11px] overflow-hidden group/code">
                <code className="text-[#ededed] whitespace-pre-wrap break-all pr-8 block">{scriptTag}</code>
                <button 
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1.5 rounded bg-[#1c1c1c] border border-[#3f3f46] hover:bg-[#2a2a2a] text-[#ededed] transition-colors"
                  title="Copy snippet"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#3ecf8e]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 group relative z-10 mt-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#3f3f46] flex items-center justify-center text-sm font-medium group-hover:border-[#3ecf8e] group-hover:text-[#3ecf8e] transition-colors">
                2
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-[#71717a]" />
                Initialize the App
              </h3>
              <p className="text-xs text-[#71717a] mb-3 leading-relaxed">
                The widget will automatically attach itself to elements with the <code className="text-[#3ecf8e] bg-[#141414] px-1 py-[2px] rounded border border-[#1c1c1c] font-mono text-[10px]">data-widgetforge</code> attribute. Click it to see it in action!
              </p>
              
              {/* Visual Demo Box */}
              <div className="w-full h-[140px] rounded-md border border-[#1c1c1c] bg-[#141414] p-3 relative flex flex-col overflow-hidden">
                 
                 {/* Fake UI Background */}
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/60" />
                    </div>
                    <div className="h-4 w-24 bg-[#1c1c1c] rounded" />
                 </div>

                 <div className="flex flex-col gap-2 opacity-50">
                    <div className="w-[80%] h-2.5 bg-[#1c1c1c] rounded" />
                    <div className="w-[60%] h-2.5 bg-[#1c1c1c] rounded" />
                    <div className="w-[40%] h-2.5 bg-[#1c1c1c] rounded mt-2" />
                 </div>
                 
                 {/* The Fake Widget Button */}
                 <div className="absolute right-4 bottom-4 w-28 h-9 bg-gradient-to-r from-[#2ebd7d] to-[#3ecf8e] rounded shadow-lg shadow-[#3ecf8e]/20 flex items-center justify-center gap-2 border border-[#4ade80]/50 animate-pulse text-[#0a0a0a] font-medium text-xs font-sans group/btn cursor-pointer">
                    <Zap className="w-3.5 h-3.5 fill-[#0a0a0a]" />
                    Feedback
                 </div>

              </div>

            </div>
          </div>

        </div>
        
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#1c1c1c]">
          <Button variant="ghost" onClick={onClose} className="text-[#a1a1aa] hover:text-white hover:bg-[#1c1c1c]">
            Cancel
          </Button>
          <Button onClick={onClose} className="bg-[#ededed] text-[#0a0a0a] hover:bg-white text-sm px-6 font-medium">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
