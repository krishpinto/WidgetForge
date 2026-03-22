// db/index.ts
// ─────────────────────────────────────────────────────────────
// This file creates ONE database connection that every API route
// imports and reuses. You never create a new connection per request
// — that would be slow and eventually exhaust your connection pool.
//
// How it works:
//   1. Reads DATABASE_URL from .env.local
//   2. Creates a postgres client (low-level TCP connection)
//   3. Wraps it with Drizzle (gives us the type-safe query API)
//   4. Exports `db` — this is what you import in API routes
//
// Usage in an API route:
//   import { db } from "@/db"
//   import { bots } from "@/db/schema"
//   const allBots = await db.select().from(bots).where(eq(bots.userId, id))
// ─────────────────────────────────────────────────────────────

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Safety check — crash early with a clear message if the env var is missing
// rather than a cryptic postgres connection error later
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

// postgres-js creates the actual TCP connection to your Supabase database.
// max: 1 is important for serverless (Vercel) — each function invocation
// should use at most 1 connection, otherwise you'll exhaust the pool fast.
const client = postgres(process.env.DATABASE_URL, { max: 1 });

// Drizzle wraps the client and gives us the type-safe query builder.
// We pass the schema so Drizzle knows about our tables.
export const db = drizzle(client, { schema });