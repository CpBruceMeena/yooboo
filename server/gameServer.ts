import { Server as SocketIOServer, Socket } from 'socket.io';
import {
  GameState, Player, Card, PlayCardEvent,
  createDeck, validatePlay, applyCardEffect,
  resolveStack, resolveSmileyDraw, nextTurn,
  checkElimination, checkWinner, shuffle, recycleDiscardPile,
} from '../src/lib/game';

interface ClientInfo {
  playerId: string;
  playerName: string;
  roomId: string;
}

interface LobbyPlayer {
  id: string;
  name: string;
}

interface Room {
  state: GameState | null;
  clients: Map<string, string>;
  lobbyPlayers: LobbyPlayer[];
}

const rooms = new Map<string, Room>();

function createInitialState(roomId: string, players: { id: string; name: string }[]): GameState {
  const deck = createDeck();
  const hands: Card[][] = players.map(() => []);

  for (let i = 0; i < 7; i++) {
    for (const hand of hands) {
      const card = deck.pop();
      if (card) hand.push(card);
    }
  }

  let discardTop = deck.pop()!;
  while (discardTop.type !== 'number') {
    deck.push(discardTop);
    discardTop = deck.pop()!;
  }

  return {
    roomId,
    players: players.map((p, i) => ({
      id: p.id,
      name: p.name,
      hand: hands[i],
      isEliminated: false,
      saidUno: false,
      connected: true,
    })),
    drawPile: deck,
    discardPile: [discardTop],
    currentPlayerIndex: 0,
    direction: 1,
    activeColor: discardTop.color === 'wild' ? null : discardTop.color as any,
    pendingDraw: 0,
    pendingType: null,
    smileyActive: false,
    smileyColor: null,
    status: 'in_game',
    winnerId: null,
  };
}

export function setupGameServer(io: SocketIOServer) {
  const clientMap = new Map<string, ClientInfo>();

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);
    socket.on('join_room', ({ roomId, playerName }: { roomId: string; playerName: string }) => {
      if (!roomId || !playerName) {
        socket.emit('invalid_move', { reason: 'roomId and playerName required' });
        return;
      }

      let room = rooms.get(roomId);
      if (!room) {
        room = { state: null, clients: new Map(), lobbyPlayers: [] };
        rooms.set(roomId, room);
      }

      if (room.state && room.state.status === 'in_game') {
        // Allow reconnection: check if player name matches an existing player
        const existingPlayer = room.state.players.find(p => p.name === playerName);
        if (existingPlayer) {
          console.log('reconnect: player rejoining active game', playerName, roomId);
          existingPlayer.connected = true;

          // Clean up any stale socket mapping for this player
          for (const [existingSid, existingPid] of room.clients) {
            if (existingPid === existingPlayer.id) {
              room.clients.delete(existingSid);
              clientMap.delete(existingSid);
              break;
            }
          }

          // Remove from lobby if present
          room.lobbyPlayers = room.lobbyPlayers.filter((p) => p.id !== existingPlayer.id);

          // Assign new socket
          socket.join(roomId);
          room.clients.set(socket.id, existingPlayer.id);
          clientMap.set(socket.id, { playerId: existingPlayer.id, playerName, roomId });

          socket.emit('you_are', { playerId: existingPlayer.id, playerName });

          // Send current game state (with full hand for this player)
          const privateState = {
            ...room.state,
            players: room.state.players.map((p) => ({
              ...p,
              hand: p.id === existingPlayer.id ? p.hand : [],
              handSize: p.hand.length,
            })),
          };
          socket.emit('state_update', { state: privateState });

          // Notify other players that this player reconnected
          socket.to(roomId).emit('player_joined', { playerId: existingPlayer.id, playerName });

          return;
        }

        socket.emit('invalid_move', { reason: 'Game already in progress' });
        return;
      }

      // Before adding, clean up any stale entries for this player name
      // (handles page refresh/reconnect where the old socket is still in the room)
      const existingForName = room.lobbyPlayers.filter((p) => p.name === playerName);
      for (const dup of existingForName) {
        for (const [existingSid, existingPid] of room.clients) {
          if (existingPid === dup.id) {
            room.clients.delete(existingSid);
            clientMap.delete(existingSid);
            break;
          }
        }
        room.lobbyPlayers = room.lobbyPlayers.filter((p) => p.id !== dup.id);
      }

      const playerId = `${socket.id}_${Date.now()}`;
      socket.join(roomId);
      room.clients.set(socket.id, playerId);
      room.lobbyPlayers.push({ id: playerId, name: playerName });
      clientMap.set(socket.id, { playerId, playerName, roomId });

      socket.emit('you_are', { playerId, playerName });

      socket.emit('room_joined', {
        roomId,
        players: room.lobbyPlayers.map((p) => ({ id: p.id, name: p.name, hand: [] })),
      });

      console.log('room_joined emitted for', roomId, 'players', room.lobbyPlayers.map(p => p.name));

      socket.to(roomId).emit('player_joined', { playerId, playerName });
      console.log('player_joined broadcast for', playerName, 'in room', roomId);
    });

    socket.on('start_game', () => {
      const info = clientMap.get(socket.id);
      if (!info) {
        socket.emit('invalid_move', { reason: 'Session error: not registered. Please rejoin the room.' });
        return;
      }
      const room = rooms.get(info.roomId);
      if (!room) {
        socket.emit('invalid_move', { reason: 'Room not found. Please create a new room.' });
        return;
      }
      if (room.state && room.state.status === 'in_game') {
        socket.emit('invalid_move', { reason: 'Game already in progress.' });
        return;
      }

      const players = Array.from(room.clients.entries()).map(([sid, pid]) => {
        const cinfo = clientMap.get(sid);
        return { id: pid, name: cinfo?.playerName ?? 'Unknown' };
      });

      console.log('start_game requested by', socket.id, 'room', info.roomId, 'playersCount', players.length, 'players', players.map(p => p.name));

      try {
        if (players.length < 2) {
          socket.emit('invalid_move', { reason: 'Need at least 2 players' });
          return;
        }

        room.lobbyPlayers = [];
        room.state = createInitialState(info.roomId, players);
        console.log('start_game room.clients entries', Array.from(room.clients.entries()));

        // Track which sockets received the state update
        let sentCount = 0;
        for (const sid of room.clients.keys()) {
          const cInfo = clientMap.get(sid);
          console.log('start_game loop sid', sid, 'cInfo', cInfo);
          if (cInfo) {
            const player = room.state.players.find((p) => p.id === cInfo.playerId);
            console.log('start_game found player', player?.name, 'for', cInfo.playerId);
            if (player) {
              const privateState = {
                ...room.state,
                players: room.state.players.map((p) => ({
                  ...p,
                  hand: p.id === player.id ? p.hand : [],
                  handSize: p.hand.length,
                })),
              };
              console.log('start_game emitting state_update to', sid, 'for player', player.name);
              io.to(sid).emit('state_update', { state: privateState });
              sentCount++;
            } else {
              console.log('start_game could not find player for cInfo', cInfo);
            }
          } else {
            console.log('start_game missing client info for socket id', sid);
          }
        }

        // If no sockets received the update, something is wrong — report to the requester
        if (sentCount === 0) {
          socket.emit('invalid_move', { reason: 'Failed to start: no connected players found. Try again.' });
          rooms.delete(info.roomId);
        }
      } catch (err) {
        console.error('Error in start_game handler:', err);
        socket.emit('invalid_move', { reason: 'Server error starting game' });
      }
    });

    socket.on('play_card', ({ payload }: { payload: PlayCardEvent }) => {
      const info = clientMap.get(socket.id);
      if (!info) return;
      const room = rooms.get(info.roomId);
      if (!room || !room.state) return;

      const state = room.state;
      const error = validatePlay(state, payload.playerId, payload.cardId);
      if (error) {
        socket.emit('invalid_move', { reason: error });
        return;
      }

      const player = state.players.find((p) => p.id === payload.playerId)!;
      const cardIndex = player.hand.findIndex((c) => c.id === payload.cardId);
      const card = player.hand[cardIndex];
      player.hand.splice(cardIndex, 1);
      state.discardPile.push(card);

      const effects = applyCardEffect(state, card, payload.chosenColor);

      // Broadcast UNO call when player goes from 2 cards to 1
      if (player.hand.length === 1 && !player.saidUno) {
        player.saidUno = true;
        io.to(info.roomId).emit('uno_called', { 
          playerId: player.id, 
          playerName: player.name 
        });
      }

      if (effects.includes('smiley')) {
        const nextIdx = (state.currentPlayerIndex + state.direction + state.players.length) % state.players.length;
        const nextPlayer = state.players[nextIdx];
        const result = resolveSmileyDraw(state, nextIdx, payload.chosenColor ?? 'red');

        // Emit all drawn cards at once for the client to animate one-by-one
        io.to(info.roomId).emit('smiley_draw', {
          cards: result.drawn,
          playerId: nextPlayer.id,
          matched: result.matched,
          eliminated: result.eliminated,
        });

        // Broadcast elimination before state update if player was eliminated
        if (result.eliminated) {
          io.to(info.roomId).emit('player_eliminated', { playerId: nextPlayer.id });
        }

        nextTurn(state);
      } else if (effects.includes('stack')) {
        nextTurn(state);
      } else if (effects.includes('skip_everyone')) {
        // Turn stays
      } else if (effects.includes('discard_all')) {
        // Discard all handled via modal on client
      } else if (effects.includes('skip')) {
        nextTurn(state);
      } else {
        if (!effects.includes('reverse')) {
          nextTurn(state);
        }
      }

      if (!effects.includes('stack') && !effects.includes('smiley')) {
        const elimId = checkElimination(state);
        if (elimId) {
          io.to(info.roomId).emit('player_eliminated', { playerId: elimId });
        }
        const winner = checkWinner(state);
        if (winner) {
          io.to(info.roomId).emit('game_won', { winnerId: winner });
        }
      }

      broadcastState(room, io);
    });

    socket.on('draw_card', () => {
      const info = clientMap.get(socket.id);
      if (!info) return;
      const room = rooms.get(info.roomId);
      if (!room || !room.state) return;

      const state = room.state;
      const playerIdx = state.players.findIndex((p) => p.id === info.playerId);
      if (playerIdx === -1) return;
      const player = state.players[playerIdx];
      if (state.currentPlayerIndex !== playerIdx) return;

      if (state.pendingDraw > 0) {
        const drawn = resolveStack(state, playerIdx);
        for (const card of drawn) {
          io.to(info.roomId).emit('card_revealed', { card, playerId: player.id });
        }

        const elimId = checkElimination(state);
        if (elimId) {
          io.to(info.roomId).emit('player_eliminated', { playerId: elimId });
        }

        const winner = checkWinner(state);
        if (winner) {
          io.to(info.roomId).emit('game_won', { winnerId: winner });
        }

        // Stack resolved — advance turn (player couldn't respond)
        nextTurn(state);
      } else {
        // Normal draw: player draws 1 card and keeps their turn to play any card
        if (state.drawPile.length === 0) {
          const recycled = recycleDiscardPile(state.discardPile);
          state.drawPile.push(...recycled);
        }
        const card = state.drawPile.pop();
        if (card) {
          player.hand.push(card);
          io.to(info.roomId).emit('card_revealed', { card, playerId: player.id });
        }

        const elimId = checkElimination(state);
        if (elimId) {
          io.to(info.roomId).emit('player_eliminated', { playerId: elimId });
        }

        const winner = checkWinner(state);
        if (winner) {
          io.to(info.roomId).emit('game_won', { winnerId: winner });
        }

        // Turn stays — player can play any card after drawing
      }

      broadcastState(room, io);
    });

    socket.on('discard_color', ({ color, cardIds }: { color: Exclude<Card['color'], 'wild'>; cardIds?: string[] }) => {
      const info = clientMap.get(socket.id);
      if (!info) return;
      const room = rooms.get(info.roomId);
      if (!room || !room.state) return;

      const state = room.state;
      const player = state.players.find((p) => p.id === info.playerId);
      if (!player) return;

      // The discardAll card is already on the discard pile (played via play_card).
      // The card's color is the active color.
      // If specific card IDs provided, only discard those specific cards.
      // If cardIds is empty or undefined, the player just played the discard card alone — no cards discarded.
      if (cardIds && cardIds.length > 0) {
        player.hand = player.hand.filter((c) => !cardIds.includes(c.id));
      }
      // else: no cards to discard — just the discardAll card on top

      // Discarded cards are removed from the game (not added to discard pile)
      // The discardAll card remains on top of the discard pile

      const elimId = checkElimination(state);
      if (elimId) {
        io.to(info.roomId).emit('player_eliminated', { playerId: elimId });
      }

      const winner = checkWinner(state);
      if (winner) {
        io.to(info.roomId).emit('game_won', { winnerId: winner });
      }

      if (state.pendingDraw === 0) {
        nextTurn(state);
      }

      broadcastState(room, io);
    });

    socket.on('skip_turn', () => {
      const info = clientMap.get(socket.id);
      if (!info) return;
      const room = rooms.get(info.roomId);
      if (!room || !room.state) return;
      const state = room.state;
      const playerIdx = state.players.findIndex((p) => p.id === info.playerId);
      if (playerIdx === -1 || state.currentPlayerIndex !== playerIdx) return;

      // Player chose to skip after drawing — advance turn
      nextTurn(state);
      broadcastState(room, io);
    });

    socket.on('leave_room', () => {
      const info = clientMap.get(socket.id);
      if (!info) return;
      const room = rooms.get(info.roomId);
      if (room) {
        room.clients.delete(socket.id);
        room.lobbyPlayers = room.lobbyPlayers.filter((p) => p.id !== info.playerId);
        const player = room.state?.players.find((p) => p.id === info.playerId);
        if (player) player.connected = false;
        socket.to(info.roomId).emit('player_disconnected', { playerId: info.playerId });
        if (room.clients.size === 0) {
          rooms.delete(info.roomId);
        }
      }
      clientMap.delete(socket.id);
    });

    socket.on('say_uno', () => {
      const info = clientMap.get(socket.id);
      if (!info) return;
      const room = rooms.get(info.roomId);
      if (!room || !room.state) return;
      const player = room.state.players.find((p) => p.id === info.playerId);
      if (player) player.saidUno = true;
    });

    socket.on('disconnect', () => {
      const info = clientMap.get(socket.id);
      if (info) {
        const room = rooms.get(info.roomId);
        if (room) {
          room.clients.delete(socket.id);
          room.lobbyPlayers = room.lobbyPlayers.filter((p) => p.id !== info.playerId);
          const player = room.state?.players.find((p) => p.id === info.playerId);
          if (player) player.connected = false;
          socket.to(info.roomId).emit('player_disconnected', { playerId: info.playerId });
          // Don't delete room if a game is in progress — players may reconnect
          if (room.clients.size === 0 && (!room.state || room.state.status !== 'in_game')) {
            rooms.delete(info.roomId);
          }
        }
        clientMap.delete(socket.id);
      }
    });
  });

  return io;
}

function broadcastState(room: Room, io: SocketIOServer) {
  if (!room.state) return;
  for (const [sid, pid] of room.clients) {
    const player = room.state.players.find((p) => p.id === pid);
    if (player) {
      const privateState = {
        ...room.state,
        players: room.state.players.map((p) => ({
          ...p,
          hand: p.id === player.id ? p.hand : [],
          handSize: p.hand.length,
        })),
      };
      console.log('Emitting state_update to', sid, 'for player', player.name);
      io.to(sid).emit('state_update', { state: privateState });
    }
  }
}