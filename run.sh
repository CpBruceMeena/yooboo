#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
LOG_DIR="$ROOT_DIR/.logs"
PID_FILE="$ROOT_DIR/.run.pid"

# ─── Colors ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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

# ─── Stop ─────────────────────────────────────────────────────────
stop_servers() {
  echo -e "${YELLOW}Stopping servers...${NC}"

  # Kill from PID file first (background mode)
  if [ -f "$PID_FILE" ]; then
    while IFS= read -r pid; do
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null && echo -e "  ${RED}✕${NC} killed PID $pid"
      fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi

  # Also kill any lingering processes (catches orphaned ones)
  local killed=0
  if pkill -f "tsx index.ts" 2>/dev/null; then killed=1; fi
  if pkill -f "next dev" 2>/dev/null; then killed=1; fi

  # Kill tmux session if it exists
  if tmux has-session -t uno-nomercy 2>/dev/null; then
    tmux kill-session -t uno-nomercy
    echo -e "  ${RED}✕${NC} killed tmux session 'uno-nomercy'"
    killed=1
  fi

  if [ "$killed" -eq 0 ]; then
    echo -e "  ${YELLOW}No running servers found.${NC}"
  else
    echo -e "${GREEN}✓ Servers stopped.${NC}"
  fi
}

# ─── Status ───────────────────────────────────────────────────────
status_servers() {
  local server_pid
  local client_pid
  local any=0

  server_pid=$(pgrep -f "tsx index.ts" | head -1 || true)
  client_pid=$(pgrep -f "next dev" | head -1 || true)

  echo -e "${CYAN}Server Status:${NC}"
  if [ -n "$server_pid" ]; then
    echo -e "  ${GREEN}●${NC} Game Server (port 3001) — PID $server_pid"
    any=1
  else
    echo -e "  ${RED}○${NC} Game Server (port 3001) — not running"
  fi

  if [ -n "$client_pid" ]; then
    echo -e "  ${GREEN}●${NC} Next.js Client (port 3000) — PID $client_pid"
    any=1
  else
    echo -e "  ${RED}○${NC} Next.js Client (port 3000) — not running"
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

# ─── Start (tmux) ────────────────────────────────────────────────
start_tmux() {
  echo -e "${CYAN}Starting in tmux...${NC}"

  # Kill any existing session first
  tmux kill-session -t uno-nomercy 2>/dev/null || true

  tmux new-session -d -s uno-nomercy -n "uno-nomercy"
  tmux send-keys -t uno-nomercy "cd $SERVER_DIR && npx tsx index.ts" Enter

  tmux split-window -h -t uno-nomercy
  tmux send-keys -t uno-nomercy "cd $ROOT_DIR && npm run dev" Enter

  tmux select-pane -t uno-nomercy:0.0

  echo -e "${GREEN}✓${NC} Servers started in tmux session '${CYAN}uno-nomercy${NC}'"
  echo ""
  echo -e "  ${GREEN}●${NC} Game Server → port ${CYAN}3001${NC}"
  echo -e "  ${GREEN}●${NC} Next.js App → port ${CYAN}3000${NC}"
  echo ""
  echo -e "  ${YELLOW}Commands:${NC}"
  echo -e "    ./run.sh stop    — Stop servers"
  echo -e "    tmux attach -t uno-nomercy  — See live output"
  echo -e "    Ctrl+B then D    — Detach from tmux (keeps servers running)"
  echo ""

  # Attach so user sees output; on exit/Ctrl+C, kill the session
  tmux attach-session -t uno-nomercy
}

# ─── Start (background) ──────────────────────────────────────────
start_background() {
  echo -e "${CYAN}Starting in background mode...${NC}"

  mkdir -p "$LOG_DIR"
  > "$PID_FILE"

  # Start game server
  cd "$SERVER_DIR"
  nohup npx tsx index.ts > "$LOG_DIR/server.log" 2>&1 &
  local server_pid=$!
  echo "$server_pid" >> "$PID_FILE"
  echo -e "  ${GREEN}●${NC} Game Server (PID $server_pid) → port ${CYAN}3001${NC}"

  # Start Next.js client
  cd "$ROOT_DIR"
  nohup npm run dev > "$LOG_DIR/client.log" 2>&1 &
  local client_pid=$!
  echo "$client_pid" >> "$PID_FILE"
  echo -e "  ${GREEN}●${NC} Next.js App (PID $client_pid) → port ${CYAN}3000${NC}"

  cd "$ROOT_DIR"

  # Trap Ctrl+C to cleanly stop
  trap 'echo ""; stop_servers; exit 0' INT TERM

  echo ""
  echo -e "  ${YELLOW}Commands:${NC}"
  echo -e "    ./run.sh stop    — Stop servers"
  echo -e "    ./run.sh logs    — See live output"
  echo -e "    ./run.sh status  — Check if running"
  echo ""
  echo -e "  ${YELLOW}Press Ctrl+C to stop both servers${NC}"
  echo ""

  # Wait for either process to exit, or Ctrl+C
  wait $server_pid $client_pid 2>/dev/null
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

      if command -v tmux &>/dev/null; then
        start_tmux
      else
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
