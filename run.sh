#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
LOG_DIR="$ROOT_DIR/.logs"
PID_FILE="$ROOT_DIR/.run.pid"

# ─── Colors ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ─── Help ─────────────────────────────────────────────────────────
usage() {
  echo "Usage: ./run.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start       Start both servers (default)"
  echo "  stop        Stop both servers"
  echo "  restart     Stop then start"
  echo "  status      Show server status"
  echo "  logs        Tail logs from both servers"
  echo "  help        Show this help"
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

  # Kill by process name (catches any orphans) — SIGKILL for thoroughness
  pkill -9 -f "tsx index.ts" 2>/dev/null || true
  pkill -9 -f "next dev" 2>/dev/null || true
  pkill -9 -f "node.*http-proxy" 2>/dev/null || true

  # Kill any lingering process on ports 3000 and 3001
  kill_port 3000
  kill_port 3001

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
  local combined_pid client_pid

  combined_pid=$(pgrep -f "tsx index.ts" | head -1 || true)
  client_pid=$(pgrep -f "next dev" | head -1 || true)

  echo -e "${CYAN}Server Status:${NC}"
  if [ -n "$combined_pid" ]; then
    echo -e "  ${GREEN}●${NC} Combined Server (port 3000, Socket.IO + Next.js proxy) — PID $combined_pid"
    any=1
  else
    echo -e "  ${RED}○${NC} Combined Server (port 3000) — not running"
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
  tail -f "$LOG_DIR/server.log" "$LOG_DIR/client.log" 2>/dev/null || \
    echo -e "${YELLOW}No log files found.${NC}"
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

# ─── Start (tmux) ────────────────────────────────────────────────
start_tmux() {
  echo -e "${CYAN}Starting in tmux...${NC}"

  # Kill any previous session
  tmux kill-session -t uno-nomercy 2>/dev/null || true

  # Give ports a moment to free
  sleep 1

  tmux new-session -d -s uno-nomercy -n "uno-nomercy"
  tmux send-keys -t uno-nomercy "cd $ROOT_DIR && npx next dev -p 3001" Enter

  tmux split-window -h -t uno-nomercy
  tmux send-keys -t uno-nomercy "cd $SERVER_DIR && npx tsx index.ts" Enter

  tmux select-pane -t uno-nomercy:0.1

  echo ""
  echo -e "  ${GREEN}●${NC} Combined Server → port ${CYAN}3000${NC} (Socket.IO + proxy to Next.js)"
  echo -e "  ${GREEN}●${NC} Next.js → port ${CYAN}3001${NC} (internal)"
  echo ""
  echo -e "  ${YELLOW}Attaching to session...${NC}"
  echo -e "  ${YELLOW}Press Ctrl+C to stop servers${NC}"
  echo -e "  Or detach with Ctrl+B then D (servers keep running)"
  echo ""

  # ATTACH — this is the key fix. User sees live output and Ctrl+C kills it.
  tmux attach-session -t uno-nomercy
}

# ─── Start (background) ──────────────────────────────────────────
start_background() {
  echo -e "${CYAN}Starting in background mode...${NC}"

  mkdir -p "$LOG_DIR"
  > "$PID_FILE"

  # Start Next.js client on port 3001 (proxied through combined server)
  cd "$ROOT_DIR"
  nohup npx next dev -p 3001 > "$LOG_DIR/client.log" 2>&1 &
  local client_pid=$!
  echo "$client_pid" >> "$PID_FILE"
  echo -e "  ${GREEN}●${NC} Next.js (PID $client_pid) → port ${CYAN}3001${NC} (internal)"

  # Start combined server on port 3000 (proxies to game:3002 and next:3001)
  cd "$SERVER_DIR"
  nohup npx tsx index.ts > "$LOG_DIR/server.log" 2>&1 &
  local combined_pid=$!
  echo "$combined_pid" >> "$PID_FILE"
  echo -e "  ${GREEN}●${NC} Combined Server (PID $combined_pid) → port ${CYAN}3000${NC} (Socket.IO + proxy to Next.js)"

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

  wait $combined_pid $client_pid 2>/dev/null
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

      echo "Uno-No-Mercy startup script"
      echo ""

      # Free ports
      echo "Checking and freeing ports 3000, 3001..."
      kill_port 3001
      kill_port 3000

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
      sleep 1
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
    *)
      echo -e "${RED}Unknown command: $1${NC}"
      usage
      ;;
  esac
}

main "$@"
