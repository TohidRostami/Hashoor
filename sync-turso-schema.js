/**
 * Applies the schema changes from the last update (isActive, isArchived,
 * version, the Account constraint, and the new indexes) directly to
 * Turso — `prisma db push` can't be used here because it always targets
 * DATABASE_URL, never TURSO_DATABASE_URL (see prisma.config.ts).
 *
 * Safe to run more than once: anything already applied is detected and
 * skipped rather than failing.
 *
 * Usage: node sync-turso-schema.js
 */
require("dotenv").config();
const { createClient } = require("@libsql/client");

const statements = [
  { label: "hero_image.isActive", sql: "ALTER TABLE hero_image ADD COLUMN isActive INTEGER NOT NULL DEFAULT 1" },
  { label: "product.isArchived", sql: "ALTER TABLE product ADD COLUMN isArchived INTEGER NOT NULL DEFAULT 0" },
  {
    label: "product_variant.version",
    sql: "ALTER TABLE product_variant ADD COLUMN version INTEGER NOT NULL DEFAULT 0",
  },
  {
    label: "account (providerId, accountId) unique index",
    sql: "CREATE UNIQUE INDEX IF NOT EXISTS account_providerId_accountId_key ON account(providerId, accountId)",
  },
  { label: "user.role index", sql: "CREATE INDEX IF NOT EXISTS user_role_idx ON user(role)" },
];

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN را در .env تنظیم کنید.");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  for (const { label, sql } of statements) {
    try {
      await client.execute(sql);
      console.log(`✓ ${label}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("duplicate column") || msg.includes("already exists")) {
        console.log(`- ${label} (از قبل اعمال شده بود، رد شد)`);
      } else {
        console.error(`✗ ${label}: ${msg}`);
      }
    }
  }

  console.log("\nتمام شد.");
}

main().catch((err) => {
  console.error("خطا:", err);
  process.exit(1);
});
