import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Local dev (no TURSO_DATABASE_URL set) → plain SQLite file via
 * better-sqlite3, zero setup.
 * Production on Vercel (TURSO_DATABASE_URL set) → the same schema over
 * Turso/libSQL. Nothing else in the app changes between the two.
 */
function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  const adapter = tursoUrl
    ? new PrismaLibSql({
        url: tursoUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })
    : new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
      });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
