# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN rm -f /etc/apt/sources.list.d/*.list /etc/apt/sources.list.d/*.sources
RUN echo "deb http://repo.iut.ac.ir/repo/debian bookworm main" > /etc/apt/sources.list \
    && echo "deb http://mirror.arvancloud.ir/debian-security bookworm-security main" >> /etc/apt/sources.list

RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ openssl ca-certificates sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# seam #1 (only if the build fails downloading the Prisma schema-engine):
# COPY schema-engine-bin /tmp/schema-engine
# RUN chmod +x /tmp/schema-engine
# ENV PRISMA_SCHEMA_ENGINE_BINARY=/tmp/schema-engine
# ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# seam #2 (only if node-gyp fails downloading Node headers for better-sqlite3/sharp):
# COPY node-headers.tar.gz /tmp/
# RUN mkdir -p /tmp/node-headers \
#     && tar -xzf /tmp/node-headers.tar.gz -C /tmp/node-headers --strip-components=1
# ENV npm_config_nodedir=/tmp/node-headers

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm config set registry https://package-mirror.liara.ir/repository/npm/
ENV DATABASE_URL="file:/app/prisma/build-time.db"
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="file:/app/prisma/build-time.db"
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app ./
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]