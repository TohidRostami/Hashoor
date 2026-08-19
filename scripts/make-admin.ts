/**
 * Promotes an already-registered user to ADMIN.
 * Usage: npm run make-admin -- you@example.com
 *
 * Register normally through /register first (so Better Auth creates the
 * password/account records correctly), then run this to flip their role —
 * it only ever touches the `role` field, never passwords or sessions.
 */
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("استفاده: npm run make-admin -- you@example.com");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`کاربری با ایمیل ${email} پیدا نشد. اول از /register ثبت‌نام کنید.`);
    process.exit(1);
  }

  await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
  console.log(`✓ ${email} حالا دسترسی ادمین دارد.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
