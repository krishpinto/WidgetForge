# widgetforge — UI Overhaul Brief

## What this project is
Embeddable AI chatbot generator. Users sign up, create bots (pick provider, paste API key, write/generate a system prompt), get a single script tag with only a botId. The script tag goes on any website — a chat widget appears. API key is stored AES-256 encrypted. Bot config lives in DB, never exposed client-side.

## Deployed at
https://widget-test-ebon.vercel.app

## Tech stack
- Next.js 14 App Router, TypeScript
- Tailwind CSS + shadcn/ui (zinc base color)
- Supabase auth + Postgres
- Drizzle ORM
- React Flow (builder canvas)
- widget.js in /public — vanilla JS, Shadow DOM

## DB schema
profiles: id (= supabase auth uid), email, tier (free | paid)
bots: id (botId), user_id, name, provider (gemini|openai|anthropic), model, encrypted_api_key, system_prompt, primary_color, message_count, created_at, updated_at

## Existing routes
/ → landing page
/login → login form
/signup → signup form
/dashboard → bot grid (main page)
/dashboard/new → React Flow builder canvas (4 nodes)
/dashboard/[botId] → view/edit single bot
/api/chat → LLM proxy (CORS enabled)
/api/models → dynamic model discovery
/api/scrape → URL → system prompt
/api/bots → GET all bots, POST create bot
/api/bots/[botId] → GET, PATCH, DELETE single bot
/api/auth/create-profile → creates profile row on signup

## CRITICAL RULE
This is a UI-only pass. Do NOT touch any logic, fetch calls, state variables, API routes, or data flow. Only change JSX structure, className, and component choices. All existing function names, useEffect hooks, useState variables, and fetch calls must remain exactly as they are.

## Target aesthetic
Supabase dashboard aesthetic. See supabase-ui-notes.md and reference screenshots supabase-1.png, supabase-2.png, supabase-3.png in this folder.

Key traits:
- shadcn/ui components everywhere
- No hardcoded hex colors — only Tailwind tokens and CSS variables
- Dark/light mode works automatically
- Geist Sans for UI text, Geist Mono for IDs/code/types
- Sidebar layout for dashboard pages
- Subtle borders, almost no shadows
- Small-caps section labels
- Pill badges for provider/tier/status

## Task: rebuild dashboard page only
File: app/dashboard/page.tsx

Requirements:
- Add a left sidebar with nav (Dashboard, Settings — placeholder for now)
- Top bar with breadcrumb: widgetforge → Dashboard
- Bot cards → convert to a clean table OR card grid (your call based on Supabase patterns)
- Provider shown as colored pill badge (gemini=blue, openai=green, anthropic=orange)
- Bot ID shown in monospace, muted
- Message count visible
- Delete action hidden in a dropdown (shadcn DropdownMenu + AlertDialog)
- Empty state: centered, clean, one CTA
- Loading state: shadcn Skeleton
- Bot count indicator: X/3 bots (free tier)
- "New Bot" button top right, shadcn Button

## shadcn components to install if missing
npx shadcn@latest add card badge skeleton alert-dialog dropdown-menu separator

## Do not touch
- All fetch('/api/bots') calls
- handleDelete function
- handleLogout function  
- Bot interface type
- All useEffect and useState hooks
- Link routing

## Tools available
- Stitch MCP is connected — use it to generate UI components
- Before writing any React/TSX manually, call Stitch with a detailed prompt
- After Stitch generates a component, adapt it to fit the existing logic
  (preserve all fetch calls, state, handlers — only swap the JSX)

## How to prompt Stitch effectively for this project
Tell Stitch:
- "Supabase dashboard aesthetic"
- "Dark theme, zinc color palette"  
- "shadcn/ui components"
- "No hardcoded colors — CSS variables only"
- Describe exactly what the component contains

