/**
 * One-off bootstrap: creates an admin account (admin@gmail.com) without
 * going through /register, and prints a random password once.
 *
 * Uses Better Auth's own hashPassword, so the account can log in normally.
 * If the user already exists, it only sets the role to ADMIN and leaves
 * the current password untouched.
 *
 * Run inside the app container:
 *   docker compose exec app npx tsx scripts/create-admin.ts
 */
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { randomBytes } from "crypto";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const EMAIL = "admin@gmail.com";
const NAME = "admin";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (existing) {
    await prisma.user.update({
      where: { email: EMAIL },
      data: { role: "ADMIN" },
    });
    console.log("User already exists - role set to ADMIN. Password unchanged.");
    return;
  }

  const password = randomBytes(12).toString("base64url");
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name: NAME, email: EMAIL, emailVerified: true, role: "ADMIN" },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashedPassword,
    },
  });

  console.log("Admin created");
  console.log("Email:    " + EMAIL);
  console.log("Password: " + password);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
