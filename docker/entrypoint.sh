#!/usr/bin/env bash
set -euo pipefail

echo "=== Uno-No-Mercy Docker Container ==="
echo ""

APP_DIR="/app"
SERVER_DIR="$APP_DIR/server"
NGINX_PID_FILE="/tmp/nginx.pid"

# ── Clean up function ──
cleanup() {
  echo ""
  echo "Shutting down..."
  # Stop nginx
  if [ -f "$NGINX_PID_FILE" ]; then
    nginx_pid=$(cat "$NGINX_PID_FILE" 2>/dev/null || true)
    if [ -n "$nginx_pid" ] && kill -0 "$nginx_pid" 2>/dev/null; then
      kill "$nginx_pid" 2>/dev/null || true
    fi
  fi
  nginx -s stop 2>/dev/null || true
  # Kill background processes
  kill $(jobs -p) 2>/dev/null || true
  wait 2>/dev/null
  echo "All processes stopped."
}
trap cleanup EXIT INT TERM

# ── 1. Validate nginx config ──
echo "[1/3] Validating nginx config..."
nginx -t 2>&1 || { echo "nginx config test failed!"; exit 1; }
echo "  nginx config OK"

# ── 2. Start nginx (daemon off → background with PID file) ──
echo "[2/3] Starting services..."
nginx -g "pid $NGINX_PID_FILE; daemon off;" &
echo "  ● nginx → port 3000 (reverse proxy)"

# ── 3. Start game server ──
cd "$SERVER_DIR"
npx tsx index.ts &
echo "  ● Game Server → port 3002 (Socket.IO)"

# ── 4. Start Next.js ──
cd "$APP_DIR"
npx next start -p 3001 &
echo "  ● Next.js → port 3001 (internal)"
echo ""

echo "All services running. Open http://localhost:3000"
echo ""

# Wait for any background process to exit
wait -n
