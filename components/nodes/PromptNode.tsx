// components/nodes/PromptNode.tsx
// ─────────────────────────────────────────────────────────────
// Step 2 of the builder.
// Two modes: write the system prompt manually, or paste a URL
// and let the LLM scrape + generate it automatically.
// Grayed out until Step 1 is locked in.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useBuilder } from "@/components/BuilderContext";

export default function PromptNode({}: NodeProps) {
  const {
    provider,
    key,
    model,
    step1Done,
    systemPrompt,
    setSystemPrompt,
    scrapedText,
    setScrapedText,
    step2Done,
    completeStep2,
  } = useBuilder();

  const [tab, setTab] = useState<"write" | "scrape" | "data">("write");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locked = !step1Done; // Node is disabled until step 1 is complete

  async function scrapeUrl() {
    if (!url || !provider || !key || !model) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, provider, key, model }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSystemPrompt(data.systemPrompt);
      if (data.scrapedText) setScrapedText(data.scrapedText);
      setTab("write"); // Switch to write tab to show the generated result
    } catch (e: any) {
      setError(e.message);
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
        background: "#121419",
        border: step2Done ? "1px solid #7C3AED88" : "1px solid #282A36",
        borderRadius: 8,
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
        opacity: locked ? 0.4 : 1,
        transition: "opacity 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
        pointerEvents: locked ? "none" : "all",
        boxShadow: step2Done
          ? "0 4px 24px rgba(124, 58, 237, 0.15), 0 2px 8px rgba(0,0,0,0.4)"
          : "0 4px 12px rgba(0,0,0,0.3)",
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
          2
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#E2E4E9",
            letterSpacing: "0.2px",
          }}
        >
          System Prompt
        </span>
        {step2Done && (
          <span
            style={{ marginLeft: "auto", color: "#10B981", fontSize: 11, fontWeight: 500 }}
          >
            ✓ Locked
          </span>
        )}
      </div>

      <div
        style={{
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* ── Tabs: Write vs Scrape vs Data ── */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#0B0C0F",
            borderRadius: 6,
            padding: 4,
            border: "1px solid #242630",
          }}
        >
          {[
            { id: "write", label: "✏ Write" },
            { id: "scrape", label: "⬡ URL" },
            ...(scrapedText ? [{ id: "data", label: "📄 Data" }] : []),
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 4,
                border: "none",
                background: tab === t.id ? "#282A36" : "transparent",
                color: tab === t.id ? "#E2E4E9" : "#6E7281",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Write Tab ── */}
        {tab === "write" && (
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            disabled={step2Done}
            placeholder="You are a helpful assistant for Acme Corp..."
            rows={8}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#181A20",
              border: "1px solid #282A36",
              borderRadius: 6,
              padding: "10px 12px",
              color: "#E2E4E9",
              fontSize: 13,
              outline: "none",
              resize: "vertical",
              fontFamily: "'Inter', system-ui, sans-serif",
              lineHeight: 1.5,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        )}

        {/* ── Scrape Tab ── */}
        {tab === "scrape" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={step2Done}
              placeholder="https://yourwebsite.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#181A20",
                border: "1px solid #282A36",
                borderRadius: 6,
                padding: "9px 12px",
                color: "#E2E4E9",
                fontSize: 13,
                outline: "none",
                transition: "border 0.2s ease",
              }}
            />
            <button
              onClick={scrapeUrl}
              disabled={loading || !url || step2Done}
              style={{
                padding: "9px 12px",
                borderRadius: 6,
                border: "1px solid #7C3AED",
                background: "#7C3AED",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 600,
                cursor: loading || !url || step2Done ? "not-allowed" : "pointer",
                opacity: loading || !url || step2Done ? 0.6 : 1,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 6px rgba(124, 58, 237, 0.4)",
              }}
            >
              {loading ? "Scraping & generating..." : "✨ Generate from URL"}
            </button>
          </div>
        )}

        {/* ── Data Tab ── */}
        {tab === "data" && (
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#08090C",
              border: "1px solid #282A36",
              borderRadius: 6,
              padding: "10px 12px",
              color: "#A0A2AB",
              fontSize: 11,
              fontFamily: "monospace",
              lineHeight: 1.6,
              height: 155,
              overflowY: "auto",
            }}
          >
            {scrapedText}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div
            style={{
              fontSize: 11,
              color: "#EF4444",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: 6,
              padding: "8px 10px",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Lock In Button ── */}
        {systemPrompt && !step2Done && (
          <button
            onClick={completeStep2}
            style={{
              padding: "9px 12px",
              borderRadius: 6,
              border: "none",
              background: "#3B82F6",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
              transition: "background 0.2s",
            }}
          >
            Execute Workflow →
          </button>
        )}
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