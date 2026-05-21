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

The app runs as 2 processes. The easiest way is using the provided script:

```bash
./run.sh
```

This starts both processes in tmux panes (or background if tmux unavailable):
| Process | Port | Description |
|---|---|---|
| Combined Server | 3000 | Reverse proxy + Socket.IO game engine |
| Next.js | 3001 | Frontend (internal, not directly accessed) |

Open `http://localhost:3000` to play.

### 3. Manual start (2 terminals)

```bash
# Terminal 1: Combined server (Socket.IO + reverse proxy)
cd server && npx tsx index.ts

# Terminal 2: Next.js frontend
npm run dev
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
Client (Next.js + Tailwind v4) -------- HTTPS -------> Combined Server (:3000)
                                                            │
                                            ┌───────────────┼───────────────┐
                                            ▼                               ▼
                                     Socket.IO (/api/socketio)        Next.js (:3001)
                                     Game engine (pure TS)            UI rendering
                                            │
                                      - Authoritative validation
                                      - Card effects
                                      - Stack/smiley resolution
                                      - Elimination/win checks
```

- **Combined Server** (port 3000, Socket.IO + `http-proxy`): Single entry point. Handles Socket.IO natively at `/api/socketio` and proxies all other traffic (including WebSocket upgrades for Next.js HMR) to port 3001.
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
  index.ts        Combined HTTP + Socket.IO server entry
  gameServer.ts   Authoritative game logic
scripts/
  smoke-test.mjs  Automated smoke test
```

## Rules

See [`RULES.md`](./RULES.md) for the complete game rules including card types, stacking mechanics, special cards (Smiley 😊, +4 Reverse, +6, +10), elimination, and winning conditions.
