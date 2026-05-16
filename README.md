# Uno-No-Mercy

Real-time multiplayer UNO card game with server-authoritative game engine and Socket.IO communication.

## Quick Start

Requires **Node.js 18+**.

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Start the game server (Terminal 1)

```bash
cd server && npx tsx index.ts
```

Runs on `http://localhost:3001`.

### 3. Start the Next.js client (Terminal 2)

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### 4. Play

1. Open `http://localhost:3000` in two+ browser windows
2. Enter a name and the same room code (or create from one window and join with the code in the other)
3. Click **Start Game** once everyone has joined

## Run with script

To start the app with one command:

```bash
./run.sh
```

The script prefers `tmux` and will launch the server and client in separate tmux panes if available.
If `tmux` is not installed, it will start both processes in the background and write logs to `./.logs/server.log` and `./.logs/client.log`.

If the browser environment has trouble connecting to `localhost`, use the IPv4 server URL instead:

```bash
export NEXT_PUBLIC_SERVER_URL=http://127.0.0.1:3001
./run.sh
```

If the script is not executable, make it executable first:

```bash
chmod +x run.sh
```

### Stop the servers

If using `tmux`:

```bash
tmux kill-session -t uno-nomercy
```

If the script started background processes (no tmux), stop them by killing the logs' processes:

```bash
pkill -f "npx tsx index.ts"
pkill -f "next dev"
```

Or inspect the log PIDs with:

```bash
ps aux | grep -E "npx tsx index.ts|next dev"
```

## Architecture

```
Client (Next.js + Tailwind v4) --Socket.IO--> Server (Node.js + tsx)
                                                │
                                          Game Engine (pure TS)
                                          - Authoritative validation
                                          - Card effects
                                          - Stack/smiley resolution
                                          - Elimination/win checks
```

- **Server** owns all game state and validates every move
- **Client** renders UI and sends actions via Socket.IO
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
