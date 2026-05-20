# Uno-No-Mercy

Real-time multiplayer UNO card game with server-authoritative game engine and Socket.IO communication.

## Quick Start

Requires **Node.js 18+**.

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Start the servers

The app runs as 3 processes. The easiest way is using the provided script:

```bash
./run.sh
```

This starts all 3 processes in tmux panes (or background if tmux unavailable):
| Process | Port | Description |
|---|---|---|
| Reverse Proxy | 3000 | Entry point. Proxies Socket.IO to game server, HTTP to Next.js |
| Next.js | 3001 | Frontend (internal, not directly accessed) |
| Game Server | 3002 | Socket.IO game engine at `/api/socketio` |

Open `http://localhost:3000` to play.

### 3. Manual start (3 terminals)

```bash
# Terminal 1: Game server (Socket.IO)
cd server && npx tsx gameEntry.ts

# Terminal 2: Next.js frontend
npm run dev

# Terminal 3: Reverse proxy
cd server && npx tsx index.ts
```

Open `http://localhost:3000` in two+ browser windows to play.

### 4. Play

1. Open `http://localhost:3000` in two+ browser windows
2. Enter a name and the same room code (or create from one window and join with the code in the other)
3. Click **Start Game** once everyone has joined

### Stop the servers

```bash
./run.sh stop
```

Or manually:

```bash
pkill -f "tsx"
pkill -f "next dev"
```

## Architecture

```
Client (Next.js + Tailwind v4) -------- HTTPS -------> Reverse Proxy (:3000)
                                                            │
                                            ┌───────────────┼───────────────┐
                                            ▼                               ▼
                                     Game Server (:3002)              Next.js (:3001)
                                     Socket.IO /api/socketio          UI rendering
                                            │
                                      Game Engine (pure TS)
                                      - Authoritative validation
                                      - Card effects
                                      - Stack/smiley resolution
                                      - Elimination/win checks
```

- **Reverse Proxy** (port 3000, `http-proxy`): Entry point. Proxies Socket.IO paths to the game server and everything else to Next.js. Also handles WebSocket upgrades.
- **Game Server** (port 3002, Socket.IO): Owns all game state and validates every move.
- **Next.js** (port 3001, internal): Renders the frontend UI.
- **No database needed** — rooms are in-memory (ephemeral)

## Card Types

| Card | Effect |
|---|---|
| Number | Standard play |
| Reverse | Flip direction (2 players = skip) |
| +2 / +4 / +6 / +10 | Add to draw stack |
| Reverse4 | Flip direction + stack +4 |
| Skip Everyone | Current player goes again |
| Discard All | Remove all cards of chosen color |
| Smiley | Draw until chosen color appears |

## Stack Rules

- Same card type stacks (+4→+4, +6→+6, etc.)
- Smiley can be played during stack (adds 0, passes stack forward)
- Skip Everyone / Discard All cannot be played during stack
- If you can't stack → draw the full amount
- ≥25 cards = eliminated

## Project Structure

```
src/
  lib/game/       Game engine (pure TS, shared with server)
  hooks/          React hooks (useWebRTC, useGame)
  components/     UI components
  app/            Next.js pages (lobby + game)
server/
  index.ts        HTTP + Socket.IO server entry
  gameServer.ts   Authoritative game logic
```

## Current Status & Next Steps

- Status: Work in progress — an automated agent file `.agent.md` was added to help with fixes.
- Goal: reproduce runtime/build errors locally, fix root causes, then verify with tests or a dev run.

Recommended quick reproduction steps:

```bash
# From repo root
npm install
cd server && npm install

# Start server (terminal 1)
cd server && npx tsx index.ts

# Start client (terminal 2)
npm run dev
```

If you see errors while running, capture the full terminal output and share it with the agent.
