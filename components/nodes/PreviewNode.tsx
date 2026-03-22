// components/nodes/PreviewNode.tsx
// ─────────────────────────────────────────────────────────────
// Step 3 of the builder.
// A real embedded chat interface — calls /api/chat with the
// user's actual config. What they see here is exactly what
// their users will see in the widget.
// Grayed out until Step 2 is locked in.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useBuilder, ChatMessage } from "@/components/BuilderContext";

export default function PreviewNode({}: NodeProps) {
  const {
    provider,
    key,
    model,
    systemPrompt,
    step2Done,
    previewMessages,
    addPreviewMessage,
  } = useBuilder();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const locked = !step2Done;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [previewMessages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading || locked) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    addPreviewMessage(userMsg);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          key,
          model,
          systemPrompt,
          // Pass full history so bot has memory of the conversation
          messages: [...previewMessages, userMsg],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      addPreviewMessage({ role: "assistant", content: data.reply });
    } catch (e: any) {
      addPreviewMessage({ role: "assistant", content: `⚠ ${e.message}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="nodrag nopan"
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        width: 360,
        height: 480,
        background: "#121419",
        border: "1px solid #282A36",
        borderRadius: 8,
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
        opacity: locked ? 0.4 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: locked ? "none" : "all",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "10px 14px",
          background: "linear-gradient(to right, #1A1C24, #121419)",
          borderBottom: "1px solid #282A36",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            background: "#7C3AED",
            borderRadius: 6,
            color: "white",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          3
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#E2E4E9",
            letterSpacing: "0.2px",
          }}
        >
          Live Preview
        </span>
        {!locked && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              fontFamily: "monospace",
              color: "#6E7281",
              background: "#181A20",
              border: "1px solid #282A36",
              padding: "2px 6px",
              borderRadius: 4,
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {model}
          </span>
        )}
      </div>

      {/* ── System Prompt Preview Bar ── */}
      {systemPrompt && (
        <div
          style={{
            margin: "12px 14px 0",
            padding: "8px 10px",
            background: "#0B0C0F",
            border: "1px solid #242630",
            borderRadius: 6,
            fontSize: 11,
            color: "#6E7281",
            lineHeight: 1.5,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "#A0A2AB",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            system ·{" "}
          </span>
          {systemPrompt.slice(0, 90)}
          {systemPrompt.length > 90 ? "..." : ""}
        </div>
      )}

      {/* ── Messages Area ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 13px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Empty state */}
        {previewMessages.length === 0 && !locked && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
              color: "#6E7281",
              fontSize: 12.5,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, opacity: 0.5 }}>⬡</div>
            <div>Send a message to test your bot</div>
          </div>
        )}

        {/* Messages */}
        {previewMessages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "84%",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.5,
                background: m.role === "user" ? "#3B82F6" : "#1A1C24",
                color: m.role === "user" ? "#FFFFFF" : "#E2E4E9",
                border: m.role === "assistant" ? "1px solid #282A36" : "none",
                borderBottomRightRadius: m.role === "user" ? 2 : 8,
                borderBottomLeftRadius: m.role === "assistant" ? 2 : 8,
                boxShadow: m.role === "user" ? "0 2px 6px rgba(59, 130, 246, 0.2)" : "none",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: "6px 4px",
              alignItems: "center",
            }}
          >
            {[0, 0.15, 0.3].map((delay, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#6E7281",
                  animation: `typingBounce 1.2s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Row ── */}
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid #282A36",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexShrink: 0,
          background: "#0B0C0F",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          disabled={locked || loading}
          placeholder={
            locked ? "Complete steps 1 & 2 first..." : "Test your bot..."
          }
          style={{
            flex: 1,
            background: "#121419",
            border: "1px solid #282A36",
            borderRadius: 6,
            padding: "8px 12px",
            color: "#E2E4E9",
            fontSize: 13,
            outline: "none",
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: "border 0.2s ease",
          }}
        />
        <button
          onClick={send}
          disabled={locked || loading || !input.trim()}
          style={{
            width: 34,
            height: 34,
            borderRadius: 6,
            border: "none",
            background: "#3B82F6",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: locked || loading || !input.trim() ? 0.4 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#FFFFFF",
          border: "2px solid #7C3AED",
          width: 12,
          height: 12,
          left: -6,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#FFFFFF",
          border: "2px solid #7C3AED",
          width: 12,
          height: 12,
          right: -6,
        }}
      />
    </div>
  );
}