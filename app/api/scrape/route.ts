// app/api/scrape/route.ts
// ─────────────────────────────────────────────────────────────
// POST /api/scrape
//
// Takes a website URL, scrapes the readable text content,
// then uses the LLM to generate a system prompt for it.
//
// Request body:
// {
//   url: "https://acmecorp.com"
//   provider: "gemini"
//   key: "their api key"
//   model: "gemini-2.5-flash"
// }
//
// Response:
// { systemPrompt: "You are a helpful assistant for Acme Corp..." }
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, provider, key, model } = body;

  if (!url || !provider || !key || !model) {
    return NextResponse.json(
      { error: "Missing required fields: url, provider, key, model" },
      { status: 400 }
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 1: FETCH THE RAW HTML
  // We pretend to be a browser so sites don't block us
  // ─────────────────────────────────────────────────────────────
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        // Some sites block requests that don't look like a browser
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) throw new Error(`Site returned ${res.status}`);
    html = await res.text();
  } catch (err: any) {
    return NextResponse.json(
      { error: `Could not fetch URL: ${err.message}` },
      { status: 400 }
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 2: CLEAN THE HTML WITH CHEERIO
  // Cheerio is like jQuery for the server — we load the HTML,
  // strip all the noise, and extract only meaningful text.
  // ─────────────────────────────────────────────────────────────
  const $ = cheerio.load(html);

  // Remove everything that isn't content
  $(
    "script, style, noscript, iframe, img, svg, nav, footer, header, aside, [aria-hidden='true']"
  ).remove();

  // Extract text from what's left, collapse whitespace
  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  // Cap at 3000 chars — enough context for the LLM, not too expensive
  const trimmedText = rawText.slice(0, 3000);

  if (!trimmedText) {
    return NextResponse.json(
      { error: "Could not extract any text from that URL" },
      { status: 400 }
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 3: ASK THE LLM TO GENERATE A SYSTEM PROMPT
  // We send the scraped text and ask for a ready-to-use system
  // prompt. The output goes directly into the chat widget.
  // ─────────────────────────────────────────────────────────────
  const generationPrompt = `
You are an expert at writing AI chatbot system prompts.

Below is the text content scraped from a website. Based on this content, write a helpful, friendly, and specific system prompt for an AI chatbot that will be embedded on this website.

The system prompt should:
- Clearly define the bot's role (e.g. "You are a customer support assistant for Acme Corp")
- Mention the company/product name if found
- List 2-3 things the bot should help with (based on the site content)
- Set a friendly, professional tone
- Be 3-5 sentences max — concise and ready to use

Website content:
${trimmedText}

Return ONLY the system prompt text. No explanation, no preamble, no quotes around it.
`.trim();

  try {
    const systemPrompt = await generateWithProvider({
      provider,
      key,
      model,
      prompt: generationPrompt,
    });

    return NextResponse.json({ systemPrompt, scrapedText: trimmedText });
  } catch (err: any) {
    return NextResponse.json(
      { error: `LLM generation failed: ${err.message}` },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// LLM CALL — reuses same pattern as /api/chat but simpler
// (single turn, no history, just prompt → response)
// ─────────────────────────────────────────────────────────────
async function generateWithProvider({ provider, key, model, prompt }: any) {
  if (provider === "gemini") {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `Gemini ${res.status}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `OpenAI ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  }

  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `Anthropic ${res.status}`);
    }
    const data = await res.json();
    return data.content?.find((b: any) => b.type === "text")?.text;
  }

  throw new Error("Unknown provider");
}