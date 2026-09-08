/**
 * Adds Product.inStock (denormalized availability flag) and backfills it
 * for every existing product from current variant stock levels.
 *
 * As always: applied directly via SQL because `prisma db push` only ever
 * targets DATABASE_URL (local), never TURSO_DATABASE_URL.
 *
 * Safe to run more than once.
 *
 * Usage: node migrate-product-instock.js [--dry-run]
 */
require("dotenv").config();
const { createClient } = require("@libsql/client");

const DRY_RUN = process.argv.includes("--dry-run");

const schemaStatements = [
  { label: "product.inStock", sql: "ALTER TABLE product ADD COLUMN inStock INTEGER NOT NULL DEFAULT 1" },
  {
    label: "product (isPublished, inStock) index",
    sql: "CREATE INDEX IF NOT EXISTS product_isPublished_inStock_idx ON product(isPublished, inStock)",
  },
];

async function applySchema(client) {
  for (const { label, sql } of schemaStatements) {
    if (DRY_RUN) {
      console.log(`(dry-run) would run: ${label}`);
      continue;
    }
    try {
      await client.execute(sql);
      console.log(`✓ ${label}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("duplicate column") || msg.includes("already exists")) {
        console.log(`- ${label} (از قبل اعمال شده بود، رد شد)`);
      } else {
        throw e;
      }
    }
  }
}

async function backfill(client) {
  const products = await client.execute("SELECT id FROM product");
  console.log(`\n${products.rows.length} محصول برای محاسبه‌ی موجودی پیدا شد.`);

  let changed = 0;
  for (const { id } of products.rows) {
    const variants = await client.execute({
      sql: "SELECT stock FROM product_variant WHERE productId = ?",
      args: [id],
    });
    const inStock = variants.rows.length === 0 || variants.rows.some((v) => Number(v.stock) > 0);

    if (DRY_RUN) {
      console.log(`(dry-run) product ${id} -> inStock=${inStock}`);
      continue;
    }
    await client.execute({
      sql: "UPDATE product SET inStock = ? WHERE id = ?",
      args: [inStock ? 1 : 0, id],
    });
    changed++;
  }
  if (!DRY_RUN) console.log(`✓ ${changed} محصول به‌روزرسانی شد.`);
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN را در .env تنظیم کنید.");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  console.log(DRY_RUN ? "=== حالت آزمایشی ===" : "=== اعمال تغییرات ===");
  await applySchema(client);
  await backfill(client);
  console.log("\nتمام شد.");
}

main().catch((err) => {
  console.error("خطا:", err);
  process.exit(1);
});
