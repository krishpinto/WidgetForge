// drizzle.config.ts
// ─────────────────────────────────────────────────────────────
// This file is only used by drizzle-kit (the CLI tool).
// It tells drizzle-kit:
//   - where your schema file is
//   - which database to connect to when running migrations
//   - where to output the generated SQL migration files
//
// You run drizzle-kit commands like:
//   npx drizzle-kit generate   → reads schema.ts, generates SQL migration files
//   npx drizzle-kit migrate    → runs those SQL files against your real database
//   npx drizzle-kit studio     → opens a browser UI to browse your DB
// ─────────────────────────────────────────────────────────────

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// drizzle-kit runs outside of Next.js so it doesn't auto-load .env.local
// We load it manually here
dotenv.config({ path: ".env.local" });

export default defineConfig({
  // Where your table definitions live
  schema: "./db/schema.ts",

  // Where generated SQL migration files will be saved
  // Commit these to git — they're the history of your DB changes
  out: "./drizzle",

  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});