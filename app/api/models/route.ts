// app/api/models/route.ts
// ─────────────────────────────────────────────────────────────
// GET /api/models?provider=gemini&key=YOUR_KEY
//
// Returns { models: ["gemini-1.5-pro", "gemini-1.5-flash", ...] }
// or      { error: "..." } if the key is bad / request fails
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Pull provider and key from the URL query string
  const provider = req.nextUrl.searchParams.get("provider");
  const key = req.nextUrl.searchParams.get("key");

  // Basic sanity check — both params must be present
  if (!provider || !key) {
    return NextResponse.json(
      { error: "Missing provider or key" },
      { status: 400 }
    );
  }

  try {
    // Route to the right handler based on provider
    if (provider === "openai") return await getOpenAIModels(key);
    if (provider === "anthropic") return getAnthropicModels();
    if (provider === "gemini") return await getGeminiModels(key);

    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  } catch (err: any) {
    // If the key is wrong, the fetch inside will throw or return 401
    // We surface that as a clean error message
    return NextResponse.json(
      { error: err.message || "Failed to fetch models" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// OPENAI
// Hits GET /v1/models with the key as a Bearer token
// Then filters to only chat-capable models (gpt-* prefix)
// ─────────────────────────────────────────────────────────────
async function getOpenAIModels(key: string) {
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!res.ok) {
    // 401 = bad key, 403 = no access, etc.
    const err = await res.json();
    throw new Error(err.error?.message || `OpenAI returned ${res.status}`);
  }

  const data = await res.json();

  // data.data is an array of model objects like { id: "gpt-4o", ... }
  // We only want the chat models — filter by id starting with "gpt-"
  const models = data.data
    .map((m: any) => m.id)
    .filter((id: string) => id.startsWith("gpt-"))
    .sort(); // alphabetical

  return NextResponse.json({ models });
}

// ─────────────────────────────────────────────────────────────
// ANTHROPIC
// No public models list endpoint exists, so we hardcode.
// These are the current Claude models as of 2025.
// ─────────────────────────────────────────────────────────────
function getAnthropicModels() {
  const models = [
    "claude-opus-4-5",
    "claude-sonnet-4-5",
    "claude-haiku-4-5",
    "claude-3-opus-20240229",
    "claude-3-5-sonnet-20241022",
    "claude-3-haiku-20240307",
  ];
  return NextResponse.json({ models });
}

// ─────────────────────────────────────────────────────────────
// GEMINI
// Hits GET /v1beta/models?key=xxx
// Filters to models that support "generateContent" (= chat capable)
// ─────────────────────────────────────────────────────────────
async function getGeminiModels(key: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Gemini returned ${res.status}`);
  }

  const data = await res.json();

  // data.models is an array like:
  // { name: "models/gemini-1.5-pro", supportedGenerationMethods: ["generateContent"] }
  // We only want models that can do chat (generateContent)
  const models = data.models
    .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m: any) => m.name.replace("models/", "")) // strip the "models/" prefix
    .sort();

  return NextResponse.json({ models });
}