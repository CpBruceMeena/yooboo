#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
LOG_DIR="$ROOT_DIR/.logs"
PID_FILE="$ROOT_DIR/.run.pid"
NGINX_CONF="$ROOT_DIR/nginx.conf"
NGINX_PID_FILE="/tmp/nginx-uno-nomercy.pid"
NEXT_BUILD_ID_FILE="$ROOT_DIR/.next/BUILD_ID"

# ─── Colors ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ─── Determine Next.js mode ─────────────────────────────────────
next_cmd() {
  # Only use production mode when PRODUCTION=1 is explicitly set.
  # Otherwise always use dev mode — this ensures source code changes
  # are reflected instantly without needing a rebuild.
  if [ "${PRODUCTION:-0}" = "1" ]; then
    # If .next doesn't exist, auto-build
    if [ ! -d "$ROOT_DIR/.next" ]; then
      echo "  ${YELLOW}Building Next.js for production...${NC}" >&2
      (cd "$ROOT_DIR" && npx next build) || {
        echo -e "  ${RED}✕${NC} Production build failed" >&2
        return 1
      }
    fi
    echo "npx next start -p 3001"
  else
    echo "npx next dev -p 3001"
  fi
}

next_mode_label() {
  if [ "${PRODUCTION:-0}" = "1" ]; then
    echo "production"
  else
    echo "dev"
  fi
}

# ─── Check if the .next build is stale ──────────────────────────
check_stale_build() {
  if [ ! -f "$NEXT_BUILD_ID_FILE" ]; then
    return 1  # No build exists
  fi

  # Find the newest source file (TS/TSX)
  local newest_source
  newest_source=$(find "$ROOT_DIR/src" "$ROOT_DIR/server" -name '*.ts' -o -name '*.tsx' 2>/dev/null | xargs ls -t 2>/dev/null | head -1)
  if [ -z "$newest_source" ]; then
    return 1
  fi

  local build_time
  build_time=$(stat -f "%m" "$NEXT_BUILD_ID_FILE" 2>/dev/null || echo "0")
  local source_time
  source_time=$(stat -f "%m" "$newest_source" 2>/dev/null || echo "1")

  if [ "$source_time" -gt "$build_time" ]; then
    return 0  # Build is stale
  fi
  return 1  # Build is fresh
}

# ─── Help ─────────────────────────────────────────────────────────
usage() {
  echo "Usage: ./run.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start       Start all servers (default)"
  echo "  stop        Stop all servers"
  echo "  restart     Stop then start"
  echo "  status      Show server status"
  echo "  logs        Tail logs from all servers"
  echo "  help        Show this help"
  echo ""
  echo "Environment:"
  echo "  PRODUCTION=1    Run Next.js in production mode (requires 'npx next build' first)"
  echo "  ALLOWED_ORIGINS  Comma-separated origins for dev HMR (ngrok/custom domains)"
  exit 0
}

# ─── Kill port helper ─────────────────────────────────────────────
kill_port() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids=$(lsof -ti ":$port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
      echo -e "  ${RED}✕${NC} Killing process(es) $pids using port $port"
      echo "$pids" | xargs kill -9 2>/dev/null || true
    fi
  fi
}

# ─── Stop nginx ───────────────────────────────────────────────────
stop_nginx() {
  local nginx_pid=""

  # Try PID file from our own tracking
  if [ -f "$NGINX_PID_FILE" ]; then
    nginx_pid=$(cat "$NGINX_PID_FILE" 2>/dev/null || true)
    rm -f "$NGINX_PID_FILE"
  fi

  # If PID file didn't yield a live PID, find nginx on port 3000 via lsof
  if [ -z "$nginx_pid" ] || ! kill -0 "$nginx_pid" 2>/dev/null; then
    nginx_pid=$(lsof -ti ":3000" 2>/dev/null | head -1 || true)
  fi

  # If we found a PID and it's nginx, kill it
  if [ -n "$nginx_pid" ] && kill -0 "$nginx_pid" 2>/dev/null; then
    local comm
    comm=$(ps -p "$nginx_pid" -o comm= 2>/dev/null || true)
    if [[ "$comm" == *nginx* ]]; then
      echo -e "  ${RED}✕${NC} Stopping nginx (PID $nginx_pid)"
      kill "$nginx_pid" 2>/dev/null || true
      for i in 1 2 3; do
        if ! kill -0 "$nginx_pid" 2>/dev/null; then break; fi
        sleep 1
      done
      kill -9 "$nginx_pid" 2>/dev/null || true
    fi
  fi

  # Fallback: try nginx -s stop (relies on PID from nginx.conf: /tmp/nginx.pid)
  nginx -s stop 2>/dev/null || true

  # Final aggressive fallback: kill any nginx master/worker on port 3000
  local port_pids
  port_pids=$(lsof -ti ":3000" 2>/dev/null || true)
  if [ -n "$port_pids" ]; then
    echo -e "  ${RED}✕${NC} Force killing stale nginx on port 3000"
    echo "$port_pids" | xargs kill -9 2>/dev/null || true
  fi
}

# ─── Start nginx ──────────────────────────────────────────────────
start_nginx() {
  if command -v nginx &>/dev/null; then
    # Test the config first
    nginx -t -c "$NGINX_CONF" 2>&1 || {
      echo -e "  ${RED}✕${NC} nginx config test failed"
      return 1
    }
    # Start nginx with our custom config
    nginx -c "$NGINX_CONF" -p "$ROOT_DIR" -g "pid $NGINX_PID_FILE; daemon off;" &
    local nginx_pid=$!
    echo "$nginx_pid" > "$NGINX_PID_FILE"
    echo -e "  ${GREEN}●${NC} nginx (PID $nginx_pid) → port ${CYAN}3000${NC} (reverse proxy)"
    return 0
  else
    echo -e "  ${RED}✕${NC} nginx not found. Install with: brew install nginx"
    return 1
  fi
}

# ─── Stop ─────────────────────────────────────────────────────────
stop_servers() {
  echo -e "${YELLOW}Stopping servers...${NC}"

  # Kill from PID file (background mode)
  if [ -f "$PID_FILE" ]; then
    while IFS= read -r pid; do
      if kill -0 "$pid" 2>/dev/null; then
        kill -9 "$pid" 2>/dev/null && echo -e "  ${RED}✕${NC} killed PID $pid (SIGKILL)" || true
      fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi

  # Kill by process name (catches any orphans)
  pkill -9 -f "tsx index.ts" 2>/dev/null || true
  pkill -9 -f "next start" 2>/dev/null || true
  pkill -9 -f "next dev" 2>/dev/null || true

  # Kill any lingering processes on our ports
  kill_port 3001
  kill_port 3002

  # Stop nginx
  stop_nginx

  # Kill tmux session
  if tmux has-session -t uno-nomercy 2>/dev/null; then
    tmux kill-session -t uno-nomercy
    echo -e "  ${RED}✕${NC} killed tmux session 'uno-nomercy'"
  fi

  # Clean up stale artifacts
  rm -rf "$LOG_DIR"
  rm -f "$PID_FILE"

  echo -e "${GREEN}✓ Servers stopped and state cleaned.${NC}"
}

# ─── Status ───────────────────────────────────────────────────────
status_servers() {
  local any=0
  local game_pid client_pid

  game_pid=$(pgrep -f "tsx.*index.ts" | head -1 || true)
  client_pid=$(pgrep -f "next start" 2>/dev/null || pgrep -f "next dev" 2>/dev/null || pgrep -f "next-server" 2>/dev/null || true | head -1 || true)

  echo -e "${CYAN}Server Status:${NC}"

  if [ -f "$NGINX_PID_FILE" ]; then
    local nginx_pid
    nginx_pid=$(cat "$NGINX_PID_FILE" 2>/dev/null || true)
    if [ -n "$nginx_pid" ] && kill -0 "$nginx_pid" 2>/dev/null; then
      echo -e "  ${GREEN}●${NC} nginx (port 3000, reverse proxy) — PID $nginx_pid"
      any=1
    else
      echo -e "  ${RED}○${NC} nginx (port 3000) — not running"
    fi
  else
    # Fallback: check if nginx is listening on port 3000
    if lsof -ti ":3000" 2>/dev/null | head -1 | xargs -I{} ps -p {} -o comm= 2>/dev/null | grep -q nginx; then
      echo -e "  ${GREEN}●${NC} nginx (port 3000, reverse proxy)"
      any=1
    else
      echo -e "  ${RED}○${NC} nginx (port 3000) — not running"
    fi
  fi

  if [ -n "$game_pid" ]; then
    echo -e "  ${GREEN}●${NC} Game Server (port 3002, Socket.IO) — PID $game_pid"
    any=1
  else
    echo -e "  ${RED}○${NC} Game Server (port 3002) — not running"
  fi

  if [ -n "$client_pid" ]; then
    echo -e "  ${GREEN}●${NC} Next.js (port 3001) — PID $client_pid"
    any=1
  else
    echo -e "  ${RED}○${NC} Next.js (port 3001) — not running"
  fi

  if tmux has-session -t uno-nomercy 2>/dev/null; then
    echo -e "  ${CYAN}📺${NC} tmux session 'uno-nomercy' is active"
    any=1
  fi

  if [ "$any" -eq 0 ]; then
    echo -e "  ${YELLOW}Nothing running. Use ./run.sh start${NC}"
    return 1
  fi
  return 0
}

# ─── Logs ─────────────────────────────────────────────────────────
tail_logs() {
  if [ ! -d "$LOG_DIR" ]; then
    echo -e "${YELLOW}No logs directory found. Start the servers first.${NC}"
    exit 1
  fi
  echo -e "${CYAN}Tailing logs (Ctrl+C to stop)...${NC}"
  local log_files=()
  [ -f "$LOG_DIR/nginx.log" ] && log_files+=("$LOG_DIR/nginx.log")
  [ -f "$LOG_DIR/game.log" ] && log_files+=("$LOG_DIR/game.log")
  [ -f "$LOG_DIR/client.log" ] && log_files+=("$LOG_DIR/client.log")
  if [ ${#log_files[@]} -eq 0 ]; then
    echo -e "${YELLOW}No log files found.${NC}"
    exit 1
  fi
  tail -f "${log_files[@]}"
}

# ─── Install dependencies ─────────────────────────────────────────
install_deps() {
  if [ ! -d "$ROOT_DIR/node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
  fi
  if [ ! -d "$SERVER_DIR/node_modules" ]; then
    echo "Installing server dependencies..."
    (cd "$SERVER_DIR" && npm install)
  fi
}

# ─── Wait for a port to be listening ─────────────────────────────
wait_for_port() {
  local port=$1
  local label=$2
  local timeout=${3:-15}
  local waited=0
  while [ $waited -lt $timeout ]; do
    if lsof -i ":$port" -P 2>/dev/null | grep -q LISTEN; then
      echo -e "  ${GREEN}✓${NC} $label is ready on port $port"
      return 0
    fi
    sleep 1
    waited=$((waited + 1))
  done
  echo -e "  ${RED}✕${NC} $label did not start on port $port within ${timeout}s"
  return 1
}

# ─── Start (tmux) ────────────────────────────────────────────────
start_tmux() {
  echo -e "${CYAN}Starting in tmux...${NC}"

  # Kill any previous session
  tmux kill-session -t uno-nomercy 2>/dev/null || true

  # Give ports a moment to free
  sleep 1

  # Validate nginx config BEFORE starting anything
  echo "  Validating nginx config..."
  if ! nginx -t -c "$NGINX_CONF" 2>&1; then
    echo -e "  ${RED}✕${NC} nginx config test failed. Check nginx.conf"
    return 1
  fi
  echo -e "  ${GREEN}✓${NC} nginx config OK"

  # Create a 3-pane tmux session
  tmux new-session -d -s uno-nomercy -n "uno-nomercy"

  # Pane 0: nginx (top-left) — start first
  tmux send-keys -t uno-nomercy "cd $ROOT_DIR && nginx -c '$NGINX_CONF' -p '$ROOT_DIR' -g 'daemon off;'" Enter

  # Wait for nginx to be listening on port 3000
  wait_for_port 3000 "nginx" 10

  # Pane 1: Game server (top-right)
  tmux split-window -h -t uno-nomercy
  tmux send-keys -t uno-nomercy "cd $SERVER_DIR && npx tsx index.ts" Enter

  # Wait for game server to be listening on port 3002
  wait_for_port 3002 "Game Server" 15

  # Pane 2: Next.js (bottom, full width)
  local next_cmd_val
  next_cmd_val=$(next_cmd) || return 1  # Will auto-build if PRODUCTION=1 and no .next
  local next_mode
  next_mode=$(next_mode_label)
  tmux split-window -v -t uno-nomercy
  if [ "$next_mode" = "dev" ] && [ -n "${ALLOWED_ORIGINS:-}" ]; then
    tmux send-keys -t uno-nomercy "cd $ROOT_DIR && ALLOWED_ORIGINS='$ALLOWED_ORIGINS' $next_cmd_val" Enter
  else
    tmux send-keys -t uno-nomercy "cd $ROOT_DIR && $next_cmd_val" Enter
  fi

  # Layout: two panes on top, one on bottom
  tmux select-layout -t uno-nomercy even-horizontal 2>/dev/null || true

  echo ""
  echo -e "  ${GREEN}●${NC} nginx → port ${CYAN}3000${NC} (reverse proxy)"
  echo -e "  ${GREEN}●${NC} Game Server → port ${CYAN}3002${NC} (Socket.IO)"
  echo -e "  ${GREEN}●${NC} Next.js → port ${CYAN}3001${NC} ($next_mode)"
  echo ""
  echo -e "  ${YELLOW}Attaching to session...${NC}"
  echo -e "  ${YELLOW}Press Ctrl+C to stop servers${NC}"
  echo -e "  Or detach with Ctrl+B then D (servers keep running)"
  echo ""

  # ATTACH
  tmux attach-session -t uno-nomercy
}

# ─── Start (background) ──────────────────────────────────────────
start_background() {
  echo -e "${CYAN}Starting in background mode...${NC}"

  mkdir -p "$LOG_DIR"
  > "$PID_FILE"

  # Start nginx
  echo "Starting nginx..."
  nginx -c "$NGINX_CONF" -p "$ROOT_DIR" -g "pid $NGINX_PID_FILE; daemon off;" > "$LOG_DIR/nginx.log" 2>&1 &
  local nginx_pid=$!
  echo "$nginx_pid" >> "$PID_FILE"
  echo -e "  ${GREEN}●${NC} nginx (PID $nginx_pid) → port ${CYAN}3000${NC} (reverse proxy)"

  # Start Next.js client on port 3001
  cd "$ROOT_DIR"
  local next_cmd_val
  next_cmd_val=$(next_cmd) || return 1  # Will auto-build if PRODUCTION=1 and no .next
  local next_mode
  next_mode=$(next_mode_label)
  if [ "$next_mode" = "dev" ] && [ -n "${ALLOWED_ORIGINS:-}" ]; then
    ALLOWED_ORIGINS="$ALLOWED_ORIGINS" nohup $next_cmd_val > "$LOG_DIR/client.log" 2>&1 &
  else
    nohup $next_cmd_val > "$LOG_DIR/client.log" 2>&1 &
  fi
  local client_pid=$!
  echo "$client_pid" >> "$PID_FILE"
  echo -e "  ${GREEN}●${NC} Next.js → port ${CYAN}3001${NC} ($next_mode)"

  # Start game server on port 3002
  cd "$SERVER_DIR"
  nohup npx tsx index.ts > "$LOG_DIR/game.log" 2>&1 &
  local game_pid=$!
  echo "$game_pid" >> "$PID_FILE"
  echo -e "  ${GREEN}●${NC} Game Server (PID $game_pid) → port ${CYAN}3002${NC} (Socket.IO)"

  cd "$ROOT_DIR"

  # Trap Ctrl+C to cleanly stop
  trap 'echo ""; stop_servers; exit 0' INT TERM

  echo ""
  echo -e "  ${YELLOW}Commands:${NC}"
  echo -e "    ./run.sh stop    — Stop servers"
  echo -e "    ./run.sh logs    — See live output"
  echo -e "    ./run.sh status  — Check if running"
  echo ""
  echo -e "  ${YELLOW}Press Ctrl+C to stop all servers${NC}"
  echo ""

  wait $game_pid $client_pid $nginx_pid 2>/dev/null
  echo -e "${YELLOW}A server process exited. Stopping...${NC}"
  stop_servers
}

# ─── Main ─────────────────────────────────────────────────────────
main() {
  case "${1:-start}" in
    start)
      # Check if already running
      if status_servers > /dev/null 2>&1; then
        echo -e "${YELLOW}Servers are already running. Use './run.sh restart' first.${NC}"
        exit 1
      fi

      echo "Uno-No-Mercy startup script (3-process nginx architecture)"
      local mode
      mode=$(next_mode_label)
      echo "  Mode: $mode"

      # Check for stale build
      if [ "$mode" = "production" ]; then
        if check_stale_build; then
          echo -e "  ${YELLOW}⚠ Stale production build detected! Source files are newer than .next/${NC}"
          echo -e "  ${YELLOW}  Run 'npx next build' to rebuild, or use dev mode (unset PRODUCTION)${NC}"
        fi
      else
        if [ -d "$ROOT_DIR/.next" ]; then
          if check_stale_build; then
            echo -e "  ${YELLOW}⚠ Stale .next/ build ignored — using dev mode (source changes reflected instantly)${NC}"
          fi
        fi
        if [ -n "${ALLOWED_ORIGINS:-}" ]; then
          echo -e "  ${CYAN}ALLOWED_ORIGINS=${ALLOWED_ORIGINS}${NC}"
        fi
      fi
      echo ""

      # Free ports
      echo "Checking and freeing ports 3000, 3001, 3002..."
      kill_port 3000
      kill_port 3001
      kill_port 3002
      sleep 1

      echo ""
      install_deps

      if command -v tmux &>/dev/null; then
        start_tmux
      else
        echo "tmux unavailable: starting processes in background and writing logs."
        start_background
      fi
      ;;
    stop)
      stop_servers
      ;;
    restart)
      stop_servers
      # Wait up to 5s for all processes to fully die
      for i in 1 2 3 4 5; do
        if ! status_servers > /dev/null 2>&1; then
          break
        fi
        sleep 1
      done
      # Last resort: force-free ports if anything is still clinging on
      if status_servers > /dev/null 2>&1; then
        kill_port 3000
        kill_port 3001
        kill_port 3002
        sleep 1
      fi
      exec "$0" start
      ;;
    status)
      status_servers
      ;;
    logs)
      tail_logs
      ;;
    help|--help|-h)
      usage
      ;;
    build)
      echo -e "${CYAN}Building Next.js for production...${NC}"
      (cd "$ROOT_DIR" && npx next build)
      ;;
    *)
      echo -e "${RED}Unknown command: $1${NC}"
      usage
      ;;
  esac
}

main "$@"
