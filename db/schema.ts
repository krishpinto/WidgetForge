// db/schema.ts
// ─────────────────────────────────────────────────────────────
// This file is the single source of truth for your database.
// Drizzle reads this and generates the actual SQL tables.
// If you want to add a column, you add it here first, then run
// a migration and Drizzle updates the real database to match.
//
// We have two tables:
//   - profiles: one row per user (extends Supabase's built-in auth.users)
//   - bots: one row per chatbot a user creates
// ─────────────────────────────────────────────────────────────

import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";

// ── Enum: which LLM provider a bot uses ──
// Storing as an enum means the DB will reject any value
// that isn't one of these three — no typos, no bad data.
export const providerEnum = pgEnum("provider", [
  "gemini",
  "openai",
  "anthropic",
]);

// ── Enum: user tier ──
// free = BYOK (bring your own key), max 3 bots
// paid = uses your key, unlimited bots
export const tierEnum = pgEnum("tier", ["free", "paid"]);

// ── profiles table ──
// Supabase Auth creates a row in auth.users when someone signs up.
// We can't add columns to that table, so we create our own profiles
// table that mirrors it. The id column links back to auth.users.
export const profiles = pgTable("profiles", {
  // Same UUID as auth.users — this is the link between auth and our data
  id: text("id").primaryKey(),

  email: text("email").notNull(),

  // free by default, manually upgraded to paid later
  // (Stripe integration comes in V3)
  tier: tierEnum("tier").default("free").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── bots table ──
// One row per chatbot. The botId here is what goes in the script tag.
// When a widget calls /api/chat, it sends this id, we look up the row,
// get the key + prompt, call the LLM, return the reply.
export const bots = pgTable("bots", {
  // This is what goes in the script tag: data-bot-id="bot_abc123"
  // We generate this ourselves (not a db auto-increment) so it looks
  // clean and doesn't leak how many bots exist in the system.
  id: text("id").primaryKey(),

  // Which user owns this bot — references profiles.id
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  // onDelete: cascade means if the user is deleted, all their bots go too

  // Human-readable name the user gives their bot ("Support Bot", "Sales Bot")
  name: text("name").notNull(),

  // The website they built this bot for — optional, just for reference
  websiteUrl: text("website_url"),

  provider: providerEnum("provider").notNull(),

  model: text("model").notNull(),

  // The API key is stored ENCRYPTED using the ENCRYPTION_KEY env var.
  // We never store plain text keys. When we need to call the LLM,
  // we decrypt it in the API route, use it, then discard it.
  encryptedApiKey: text("encrypted_api_key").notNull(),

  // The system prompt — what makes each bot unique
  systemPrompt: text("system_prompt").notNull(),

  // Hex color for the widget's primary color
  primaryColor: text("primary_color").default("#6366f1").notNull(),

  // How many messages this bot has handled — for the dashboard stats
  messageCount: integer("message_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TypeScript types inferred from the schema — use these in your API routes
// so TypeScript knows exactly what shape a bot or profile object is.
export type Profile = typeof profiles.$inferSelect;
export type Bot = typeof bots.$inferSelect;
export type NewBot = typeof bots.$inferInsert;