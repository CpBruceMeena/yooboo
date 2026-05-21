# ==============================================================
# Stage 1 — Build Next.js frontend
# ==============================================================
FROM node:22-slim AS frontend-builder

WORKDIR /app

# Install dependencies (separate from source for layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY next.config.ts tsconfig.json ./
COPY public/ public/
COPY src/ src/
RUN npm run build

# ==============================================================
# Stage 2 — Install server production dependencies
# ==============================================================
FROM node:22-slim AS server-deps

WORKDIR /app/server
COPY server/package.json ./
RUN npm install --omit=dev

# ==============================================================
# Stage 3 — Runtime image
# ==============================================================
FROM node:22-slim AS runner

# Install nginx + curl (for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends nginx curl && \
    rm -rf /var/lib/apt/lists/* && \
    # Remove default nginx site config
    rm -f /etc/nginx/sites-enabled/default

WORKDIR /app

# ── Copy Next.js build ──
COPY --from=frontend-builder /app/package.json ./
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/next.config.ts ./

# ── Copy server code ──
COPY server/ server/

# ── Copy shared game engine (imported by the server) ──
COPY src/lib/game/ src/lib/game/

# ── Copy server node_modules ──
COPY --from=server-deps /app/server/node_modules ./server/node_modules

# ── Copy Docker nginx config & entrypoint ──
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -s http://localhost:3000 > /dev/null || exit 1

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
