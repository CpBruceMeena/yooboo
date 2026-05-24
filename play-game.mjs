import { io } from "socket.io-client";

// Connect through nginx on port 3000 (reverse proxy handles /api/socketio)
const SERVER_URL = "http://localhost:3000";
const ROOM = "AUTO1";

// Track state for both players
const players = {
  p1: { id: null, name: "Alice", socket: null, state: null, turn: 0 },
  p2: { id: null, name: "Bob", socket: null, state: null, turn: 0 },
};

function createPlayer(key, name) {
  const socket = io(SERVER_URL, {
    path: '/api/socketio',
    transports: ["websocket", "polling"],
    timeout: 10000,
  });

  socket.on("connect", () => {
    console.log(`[${name}] Connected: ${socket.id}`);
    socket.emit("join_room", { roomId: ROOM, playerName: name });
  });

  socket.on("you_are", (data) => {
    players[key].id = data.playerId;
    console.log(`[${name}] You are: ${data.playerId}`);
  });

  socket.on("room_joined", (data) => {
    console.log(`[${name}] Room joined: ${data.roomId}, players:`, data.players.map(p => p.name));
    players[key].id = data.players.find(p => p.name === name)?.id || players[key].id;
  });

  socket.on("player_joined", (data) => {
    console.log(`[${name}] Player joined: ${data.playerName}`);
  });

  socket.on("state_update", (data) => {
    players[key].state = data.state;
    const me = data.state.players.find(p => p.id === players[key].id);
    if (me) {
      console.log(`[${name}] Turn: ${data.state.currentPlayerIndex}, My hand: ${me.hand.length} cards`);
    }
  });

  socket.on("invalid_move", (data) => {
    console.log(`[${name}] Invalid move: ${data.reason}`);
  });

  socket.on("player_eliminated", (data) => {
    console.log(`[${name}] Player eliminated: ${data.playerId}`);
  });

  socket.on("game_won", (data) => {
    const winner = players[key].state?.players.find(p => p.id === data.winnerId);
    console.log(`[${name}] GAME WON by: ${winner?.name || data.winnerId}!`);
  });

  socket.on("card_revealed", (data) => {
    const cardOwner = data.playerId === players[key].id ? name : "opponent";
    console.log(`[${name}] Card revealed for ${cardOwner}: ${data.card.color} ${data.card.type}${data.card.value !== undefined ? ' ' + data.card.value : ''}`);
  });

  socket.on("disconnect", () => {
    console.log(`[${name}] Disconnected`);
  });

  return socket;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getPlayableCards(hand, state) {
  const discardTop = state.discardPile[state.discardPile.length - 1];
  if (!discardTop) return [];

  const activeColor = state.activeColor;
  const pendingDraw = state.pendingDraw;
  const pendingType = state.pendingType;
  const stackable = ["plus2", "plus4", "plus6", "plus10", "reverse4", "smiley"];

  return hand.filter(card => {
    if (card.type === "smiley") return true;
    
    const isWild = card.color === "wild";
    const matchesColor = activeColor !== null && card.color === activeColor;
    const matchesType = discardTop.type === card.type;
    
    if (pendingDraw > 0 && pendingType) {
      if (!stackable.includes(card.type)) return false;
      if (card.type !== pendingType) return false;
      return true;
    }
    
    if (isWild) return true;
    if (matchesColor) return true;
    if (matchesType) return true;
    
    return false;
  });
}

function chooseColor(card) {
  // Count colors in hand and pick the most common
  return "red"; // simple default
}

async function takeTurn(playerKey, name) {
  const p = players[playerKey];
  if (!p.state || !p.id) return false;

  const me = p.state.players.find(pl => pl.id === p.id);
  if (!me) return false;

  const isMyTurn = p.state.players[p.state.currentPlayerIndex]?.id === p.id;
  if (!isMyTurn) return false;

  const playable = getPlayableCards(me.hand, p.state);
  
  if (playable.length > 0) {
    const cardToPlay = playable[0];
    const card = me.hand.find(c => c.id === cardToPlay);
    console.log(`[${name}] Playing: ${card.color} ${card.type}${card.value !== undefined ? ' ' + card.value : ''}`);
    
    if (card.color === "wild" || card.type === "smiley") {
      p.socket.emit("play_card", {
        payload: { playerId: p.id, cardId: cardToPlay, chosenColor: "red" }
      });
    } else if (card.type === "discardAll") {
      p.socket.emit("play_card", {
        payload: { playerId: p.id, cardId: cardToPlay }
      });
      await sleep(500);
      p.socket.emit("discard_color", { color: "red" });
    } else {
      p.socket.emit("play_card", {
        payload: { playerId: p.id, cardId: cardToPlay }
      });
    }
  } else {
    console.log(`[${name}] No playable cards, drawing...`);
    p.socket.emit("draw_card");
  }

  return true;
}

async function main() {
  console.log("=== YOOBOO Auto-Play Script ===\n");

  // Create both player connections
  players.p1.socket = createPlayer("p1", "Alice");
  players.p2.socket = createPlayer("p2", "Bob");

  // Wait for connections and room setup
  await sleep(3000);

  // Start the game from Player 1
  console.log("\n--- Starting game ---");
  players.p1.socket.emit("start_game");
  
  await sleep(2000);

  let gameOver = false;
  let turnCount = 0;
  const MAX_TURNS = 200;

  while (!gameOver && turnCount < MAX_TURNS) {
    turnCount++;
    await sleep(1500);

    // Check if game is over
    for (const [key, p] of Object.entries(players)) {
      if (p.state?.status === "finished") {
        const winner = p.state.players.find(pl => pl.id === p.state.winnerId);
        console.log(`\n=== GAME OVER ===`);
        console.log(`Winner: ${winner?.name || p.state.winnerId}`);
        
        // Show final hands
        for (const pl of p.state.players) {
          console.log(`${pl.name}: ${pl.hand.length} cards${pl.isEliminated ? ' (ELIMINATED)' : ''}`);
        }
        gameOver = true;
        break;
      }
    }
    if (gameOver) break;

    // Check if any player is eliminated
    for (const [key, p] of Object.entries(players)) {
      if (p.state) {
        for (const pl of p.state.players) {
          if (pl.isEliminated) {
            console.log(`   ${pl.name} has been eliminated!`);
          }
        }
      }
    }

    // Take turns for active player
    for (const [key, p] of Object.entries(players)) {
      if (p.state && p.id) {
        const isMyTurn = p.state.players[p.state.currentPlayerIndex]?.id === p.id;
        if (isMyTurn) {
          const name = key === "p1" ? "Alice" : "Bob";
          await takeTurn(key, name);
          await sleep(1000);
        }
      }
    }
  }

  if (turnCount >= MAX_TURNS) {
    console.log("\nReached max turns without finishing.");
  }

  // Show final state
  console.log("\n--- Final State ---");
  for (const [key, p] of Object.entries(players)) {
    if (p.state) {
      for (const pl of p.state.players) {
        console.log(`${pl.name}: ${pl.hand.length} cards${pl.isEliminated ? ' (ELIMINATED)' : ''}`);
      }
    }
  }

  // Cleanup
  for (const p of Object.values(players)) {
    if (p.socket) p.socket.close();
  }
  
  console.log("\nDone!");
}

main().catch(console.error);
