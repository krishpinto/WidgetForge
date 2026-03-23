"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AIPromptProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AI_Prompt({ 
  value, 
  onChange, 
  placeholder = "You are a helpful assistant..." 
}: AIPromptProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 120,
    maxHeight: 500,
  });

  return (
    <div className="w-full relative group">
      <div 
        className="rounded-xl border shadow-sm transition-colors focus-within:ring-1 overflow-hidden" 
        style={{ backgroundColor: '#0f0f0f', borderColor: '#1c1c1c' }}
        onFocus={(e) => e.currentTarget.style.borderColor = '#3ecf8e'}
        onBlur={(e) => e.currentTarget.style.borderColor = '#1c1c1c'}
      >
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#1c1c1c', backgroundColor: '#141414' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: '#3ecf8e' }} />
            <span className="text-xs font-medium uppercase tracking-widest font-mono" style={{ color: '#71717a' }}>System Prompt Instructions</span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: '#71717a' }}>
            {value?.length || 0} chars
          </span>
        </div>

        {/* Textarea Area */}
        <div className="relative">
          {/* Subtle glow effect behind textarea when focused */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3ecf8e]/5 blur-[80px] pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>

          <Textarea
            ref={textareaRef}
            id="system-prompt-input"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              adjustHeight();
            }}
            placeholder={placeholder}
            className={cn(
              "w-full resize-none border-none bg-transparent px-5 py-5 text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 relative z-10",
              "min-h-[120px]"
            )}
            style={{ color: '#ededed', outline: 'none', boxShadow: 'none' }}
          />
        </div>

        {/* Footer Decorative Line */}
        <div className="h-[2px] w-full opacity-30 transition-all duration-500 group-focus-within:opacity-100 group-focus-within:h-1" style={{ background: 'linear-gradient(90deg, #3ecf8e, #1c1c1c)' }} />
      </div>
    </div>
  );
}
