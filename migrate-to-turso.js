/**
 * Copies the full schema + data from a local SQLite file into Turso,
 * using the same @libsql/client the app already depends on — no
 * separate CLI install needed.
 *
 * Usage:
 *   node migrate-to-turso.js            # actually runs the migration
 *   node migrate-to-turso.js --dry-run  # only prints what it would do
 */
require("dotenv").config();
const Database = require("better-sqlite3");
const { createClient } = require("@libsql/client");

const DRY_RUN = process.argv.includes("--dry-run");
const LOCAL_DB_PATH = process.env.LOCAL_DB_PATH || "prisma/dev.db";

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  if (!tursoUrl || !tursoToken) {
    console.error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN را در .env تنظیم کنید.");
    process.exit(1);
  }

  const local = new Database(LOCAL_DB_PATH, { readonly: true });
  const turso = DRY_RUN ? null : createClient({ url: tursoUrl, authToken: tursoToken });

  console.log(DRY_RUN ? "=== حالت آزمایشی (چیزی نوشته نمی‌شود) ===" : "=== شروع انتقال ===");

  // 1) Recreate schema: sqlite_master holds the exact original CREATE
  // TABLE/INDEX statements, so replaying them reproduces the schema
  // exactly, foreign keys included.
  const schemaObjects = local
    .prepare(
      "SELECT name, sql FROM sqlite_master WHERE type IN ('table','index') AND sql IS NOT NULL AND name NOT LIKE 'sqlite_%'"
    )
    .all();

  if (!DRY_RUN) await turso.execute("PRAGMA foreign_keys = OFF");

  for (const { name, sql } of schemaObjects) {
    console.log(`ساخت ${name} ...`);
    if (!DRY_RUN) {
      try {
        await turso.execute(sql);
      } catch (e) {
        console.log(`  (رد شد — احتمالاً از قبل وجود دارد: ${e.message})`);
      }
    }
  }

  // 2) Copy data, table by table.
  const tables = local
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    .all();

  for (const { name } of tables) {
    const rows = local.prepare(`SELECT * FROM "${name}"`).all();
    if (rows.length === 0) {
      console.log(`${name}: خالی، رد شد`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const insertSql = `INSERT INTO "${name}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${columns
      .map(() => "?")
      .join(", ")})`;

    console.log(`${name}: ${rows.length} ردیف ${DRY_RUN ? "(آزمایشی)" : "در حال کپی..."}`);
    if (!DRY_RUN) {
      for (const row of rows) {
        await turso.execute({ sql: insertSql, args: columns.map((c) => row[c]) });
      }
    }
  }

  console.log(DRY_RUN ? "\nآزمایش تمام شد — چیزی تغییر نکرد." : "\n✓ انتقال کامل شد.");
  local.close();
}

main().catch((err) => {
  console.error("خطا:", err);
  process.exit(1);
});