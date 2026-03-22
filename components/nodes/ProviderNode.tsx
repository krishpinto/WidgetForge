// components/nodes/ProviderNode.tsx
// ─────────────────────────────────────────────────────────────
// Step 1 of the builder.
// User picks a provider, pastes their API key, hits Discover
// Models → we call /api/models and populate the dropdown live.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useBuilder } from "@/components/BuilderContext";

const PROVIDERS = [
  {
    id: "gemini",
    name: "Gemini",
    color: "#1a73e8",
    note: "Free tier available",
  },
  { id: "openai", name: "OpenAI", color: "#10a37f", note: "GPT-4o and beyond" },
  {
    id: "anthropic",
    name: "Anthropic",
    color: "#d97706",
    note: "Claude models",
  },
];

export default function ProviderNode({}: NodeProps) {
  const {
    provider,
    setProvider,
    key,
    setKey,
    model,
    setModel,
    models,
    setModels,
    step1Done,
    completeStep1,
  } = useBuilder();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  async function discoverModels() {
    if (!provider || !key) {
      setError("Pick a provider and paste your key first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/models?provider=${provider}&key=${encodeURIComponent(key)}`,
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setModels(data.models);
      if (data.models.length > 0) setModel(data.models[0]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const canContinue = provider && key && model && !step1Done;

  return (
    <div
      className="nodrag nopan"
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        width: 320,
        background: "#121419",
        border: step1Done ? "1px solid #7C3AED88" : "1px solid #282A36",
        borderRadius: 8,
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
        pointerEvents: "all",
        boxShadow: step1Done
          ? "0 4px 24px rgba(124, 58, 237, 0.15), 0 2px 8px rgba(0,0,0,0.4)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        transition: "border 0.3s ease, box-shadow 0.3s ease",
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
          1
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#E2E4E9",
            letterSpacing: "0.2px",
          }}
        >
          Provider
        </span>
        {step1Done && (
          <span
            style={{ marginLeft: "auto", color: "#10B981", fontSize: 11, fontWeight: 500 }}
          >
            ✓ Locked
          </span>
        )}
      </div>

      <div
        style={{
          padding: 13,
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {/* ── Provider Cards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProvider(p.id);
                setModels([]);
                setModel("");
              }}
              disabled={step1Done}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: 6,
                border:
                  provider === p.id
                    ? `1px solid ${p.color}88`
                    : "1px solid #282A36",
                background: provider === p.id ? `${p.color}11` : "#181A20",
                cursor: step1Done ? "not-allowed" : "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                width: "100%",
                boxShadow: provider === p.id ? `0 2px 8px ${p.color}22` : "none",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: p.color,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${p.color}`,
                }}
              />
              <div>
                <div
                  style={{ fontSize: 12.5, fontWeight: 600, color: "#E2E4E9" }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: "#8A8D98", marginTop: 2 }}>{p.note}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ── API Key ── */}
        <div>
          <label
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "#8A8D98",
              display: "block",
              marginBottom: 6,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            API Key
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={step1Done}
              placeholder="Paste your key here..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#181A20",
                border: "1px solid #282A36",
                borderRadius: 6,
                padding: "9px 34px 9px 12px",
                color: "#E2E4E9",
                fontSize: 12,
                outline: "none",
                fontFamily: "monospace",
                transition: "border 0.2s ease",
              }}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6E7281",
                fontSize: 12,
                padding: 4,
              }}
            >
              {showKey ? "👁" : "👁‍🗨"}
            </button>
          </div>
        </div>

        {/* ── Discover Models Button ── */}
        <button
          onClick={discoverModels}
          disabled={loading || !provider || !key || step1Done}
          style={{
            padding: "9px 12px",
            borderRadius: 6,
            border: "1px solid #3B82F6",
            background: loading || !provider || !key || step1Done ? "transparent" : "#3B82F615",
            color: loading || !provider || !key || step1Done ? "#6E7281" : "#3B82F6",
            borderColor: loading || !provider || !key || step1Done ? "#282A36" : "#3B82F655",
            fontSize: 12,
            fontWeight: 600,
            cursor:
              loading || !provider || !key || step1Done
                ? "not-allowed"
                : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Discovering..." : "⚡ Discover Models"}
        </button>

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

        {/* ── Model Dropdown (appears after discovery) ── */}
        {models.length > 0 && (
          <div>
            <label
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "#8A8D98",
                display: "block",
                marginBottom: 6,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Model · {models.length} available
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={step1Done}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#181A20",
                border: "1px solid #282A36",
                borderRadius: 6,
                padding: "9px 12px",
                color: "#E2E4E9",
                fontSize: 12.5,
                outline: "none",
                fontFamily: "monospace",
                transition: "border 0.2s ease",
              }}
            >
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── Lock In Button ── */}
        {canContinue && (
          <button
            onClick={completeStep1}
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

      {/* Connection handle on the right — links to Prompt node */}
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
