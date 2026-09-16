# syntax=docker/dockerfile:1
#
# Dockerfile مخصوص هاشور — بر پایه‌ی گاید دیپلوی سیترین، با دو تفاوت مهم:
#   ۱. این پروژه هم better-sqlite3 هم sharp رو داره — هر دو native module‌ان،
#      پس ممکنه seam #2 (هدرهای Node) برای هردوشون لازم بشه، نه فقط یکی.
#   ۲. دیتابیس نهایی هم محلیه (نه Turso) — طبق تصمیمی که گرفتیم تا یه
#      وابستگی بین‌المللی دیگه از معادله حذف بشه.

# ─── پایه ────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN rm -f /etc/apt/sources.list.d/*.list /etc/apt/sources.list.d/*.sources
RUN echo "deb http://repo.iut.ac.ir/repo/debian bookworm main" > /etc/apt/sources.list \
    && echo "deb http://mirror.arvancloud.ir/debian-security bookworm-security main" >> /etc/apt/sources.list

RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ openssl ca-certificates sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# ─── seam #۱: باینری schema-engine پریزما ──────────────────────────
# یک‌بار بدون این بخش build بزن، از متن خطا URL دقیق رو کپی کن، از
# لپ‌تاپ دانلود کن، به build context منتقل کن، این ۴ خط رو از کامنت خارج کن:
#
# COPY schema-engine-bin /tmp/schema-engine
# RUN chmod +x /tmp/schema-engine
# ENV PRISMA_SCHEMA_ENGINE_BINARY=/tmp/schema-engine
# ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# ─── seam #۲: هدرهای Node.js ────────────────────────────────────────
# اگه build سر کامپایل better-sqlite3 *یا* sharp با خطای node-gyp که به
# nodejs.org اشاره می‌کنه گیر کرد: نسخه‌ی دقیق Node رو از متن خطا پیدا کن
# ("gyp info using node@X.Y.Z")، از لپ‌تاپ دانلودش کن:
#   https://nodejs.org/download/release/vX.Y.Z/node-vX.Y.Z-headers.tar.gz
# منتقلش کن (اسمش رو بذار node-headers.tar.gz)، این خطوط رو از کامنت خارج کن:
#
# COPY node-headers.tar.gz /tmp/
# RUN mkdir -p /tmp/node-headers \
#     && tar -xzf /tmp/node-headers.tar.gz -C /tmp/node-headers --strip-components=1
# ENV npm_config_nodedir=/tmp/node-headers

# ─── نصب وابستگی‌ها ─────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm config set registry https://package-mirror.liara.ir/repository/npm/
# ⚠️ بدون --ignore-scripts — هم better-sqlite3 هم sharp برای کامپایل/دانلود
# باینری‌شون به postinstall نیاز دارن.
RUN npm ci

# ─── بیلد ───────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

# هدر سایت (components/layout/header.tsx) هر صفحه رو با getCategories()
# رندر می‌کنه — یعنی «next build» موقع پیش‌رندر استاتیک، به یه دیتابیس
# واقعی (حتی خالی) نیاز داره. این کاملاً جدا از دیتابیس نهاییه که روی
# volume زمان اجرا استفاده می‌شه.
ENV DATABASE_URL="file:/app/prisma/build-time.db"
RUN npx prisma db push --accept-data-loss

RUN npm run build

# ─── اجرا ───────────────────────────────────────────────────────────
# عمداً node_modules کامل نگه داشته می‌شه (next.config.ts این پروژه
# output: "standalone" نداره) — چون db:push/db:seed/make-admin باید همین
# داخل کانتینر هم قابل‌اجرا بمونن.
FROM base AS runner
ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app ./
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
