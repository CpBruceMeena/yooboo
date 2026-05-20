import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, ServerMessage, ClientMessage, Player, Card } from '@/lib/game';

interface LobbyPlayerInfo {
  id: string;
  name: string;
}

interface WebRTCReturn {
  connected: boolean;
  gameState: GameState | null;
  playerId: string | null;
  playerName: string | null;
  error: string | null;
  lobbyPlayers: LobbyPlayerInfo[];
  roomId: string | null;
  joinRoom: (roomId: string, playerName: string) => void;
  startGame: () => void;
  playCard: (cardId: string, chosenColor?: Exclude<Card['color'], 'wild'>) => void;
  drawCard: () => void;
  skipTurn: () => void;
  discardColor: (color: Exclude<Card['color'], 'wild'>, cardIds?: string[]) => void;
  sayUno: () => void;
  leaveRoom: () => void;
  revealedCards: { card: Card; playerId: string }[];
  smileyReveal: { cards: Card[]; playerId: string; matched: boolean; eliminated: boolean } | null;
  clearSmileyReveal: () => void;
  unoCall: { playerId: string; playerName: string } | null;
  clearUnoCall: () => void;
}

interface SmileyDrawEvent {
  cards: Card[];
  playerId: string;
  matched: boolean;
  eliminated: boolean;
}

export function useWebRTC(): WebRTCReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<{ card: Card; playerId: string }[]>([]);
  const [smileyReveal, setSmileyReveal] = useState<{
    cards: Card[];
    playerId: string;
    matched: boolean;
    eliminated: boolean;
  } | null>(null);
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayerInfo[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [unoCall, setUnoCall] = useState<{ playerId: string; playerName: string } | null>(null);
  const pendingJoinRef = useRef<{ roomId: string; playerName: string } | null>(null);
  const joinedRoomRef = useRef<{ roomId: string; playerName: string } | null>(null);
  const startGameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStartedRef = useRef(false);

  useEffect(() => {
    // Connect same-origin — the reverse proxy (port 3000) handles Socket.IO at /api/socketio
    // and proxies everything else to Next.js (port 3001). Works for localhost and ngrok.
    const explicitUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const socket = io(explicitUrl || undefined, {
      path: '/api/socketio',
      // Use polling-first, then upgrade to WebSocket once connected.
      // http-proxy on the combined server handles WebSocket upgrades for Socket.IO paths.
      transports: ['polling', 'websocket'],
      timeout: 20000,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnection: true,
      // Force new connection to avoid stale sessions
      forceNew: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('socket connected', socket.id);
      setConnected(true);
      setError(null);
      // Priority 1: pending join (first-time connect, room not yet joined)
      if (pendingJoinRef.current) {
        const { roomId, playerName } = pendingJoinRef.current;
        console.log('emitting pending join_room after connect', roomId, playerName);
        socket.emit('join_room', { roomId, playerName });
        pendingJoinRef.current = null;
        return;
      }
      // Priority 2: re-join after reconnect (socket reconnected but server cleaned us up)
      if (joinedRoomRef.current) {
        const { roomId, playerName } = joinedRoomRef.current;
        console.log('re-joining room after reconnect', roomId, playerName);
        socket.emit('join_room', { roomId, playerName });
      }
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err: Error & { message?: string }) => {
      console.error('connect_error:', err);
      setError(`Socket error: ${err.message || 'unknown error'}`);
    });
    socket.on('connect_timeout', () => {
      setError('Socket connection timed out');
    });
    socket.on('reconnect_failed', () => {
      setError('Socket reconnect failed');
    });

    socket.on('you_are', (data: { playerId: string; playerName: string }) => {
      console.log('you_are', data);
      setPlayerId(data.playerId);
      setPlayerName(data.playerName);
    });

    socket.on('room_joined', (data: { roomId: string; players: LobbyPlayerInfo[] }) => {
      console.log('room_joined', data.roomId, data.players.map(p => p.name));
      setRoomId(data.roomId);
      setLobbyPlayers(data.players);
      pendingJoinRef.current = null;
    });

    socket.on('player_joined', (data: { playerId: string; playerName: string }) => {
      console.log('player_joined', data);
      setLobbyPlayers((prev) => {
        if (prev.find((p) => p.id === data.playerId)) return prev;
        return [...prev, { id: data.playerId, name: data.playerName }];
      });
    });

    socket.on('player_disconnected', (data: { playerId: string }) => {
      setLobbyPlayers((prev) => prev.filter((p) => p.id !== data.playerId));
    });

    socket.on('state_update', (data: { state: GameState }) => {
      console.log('state_update received: status=', data.state.status, 'players=', data.state.players.map(p=>({id:p.id,name:p.name,hand:p.hand.length}))); 
      setGameState(data.state);
      // Game started — clear the start_game timeout
      if (data.state.status === 'in_game') {
        gameStartedRef.current = true;
        if (startGameTimeoutRef.current) {
          clearTimeout(startGameTimeoutRef.current);
          startGameTimeoutRef.current = null;
        }
      }
    });

    socket.on('invalid_move', (data: { reason: string }) => {
      setError(data.reason);
      setTimeout(() => setError(null), 3000);
    });

    socket.on('player_eliminated', (data: { playerId: string }) => {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map((p) =>
            p.id === data.playerId ? { ...p, isEliminated: true } : p
          ),
        };
      });
    });

    socket.on('game_won', (data: { winnerId: string }) => {
      setGameState((prev) => {
        if (!prev) return prev;
        return { ...prev, status: 'finished', winnerId: data.winnerId };
      });
    });

    socket.on('card_revealed', (data: { card: Card; playerId: string }) => {
      setRevealedCards((prev) => [...prev, data]);
    });

    socket.on('smiley_draw', (data: SmileyDrawEvent) => {
      setSmileyReveal(data);
    });

    socket.on('uno_called', (data: { playerId: string; playerName: string }) => {
      setUnoCall(data);
      // Auto-clear after 3 seconds
      setTimeout(() => setUnoCall(null), 3000);
    });

    return () => {
      if (startGameTimeoutRef.current) {
        clearTimeout(startGameTimeoutRef.current);
        startGameTimeoutRef.current = null;
      }
      gameStartedRef.current = false;
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const joinRoom = useCallback((roomId: string, name: string) => {
    const socket = socketRef.current;
    console.log('joinRoom called', roomId, name, 'connected=', socket?.connected);
    const joinData = { roomId, playerName: name };
    joinedRoomRef.current = joinData;
    if (socket?.connected) {
      socket.emit('join_room', joinData);
    } else {
      pendingJoinRef.current = joinData;
    }
  }, []);

  const startGame = useCallback(() => {
    console.log('emit start_game');
    setError(null); // Clear any previous errors on retry
    socketRef.current?.emit('start_game');
    gameStartedRef.current = false;
    // Timeout: if no state_update with status='in_game' arrives within 8s, show error
    if (startGameTimeoutRef.current) {
      clearTimeout(startGameTimeoutRef.current);
    }
    startGameTimeoutRef.current = setTimeout(() => {
      if (!gameStartedRef.current) {
        console.log('start_game timed out — no response from server');
        setError('Game start timed out. Please try again.');
        // Auto-clear the error after 5 seconds so the user can retry
        setTimeout(() => setError(prev => prev === 'Game start timed out. Please try again.' ? null : prev), 5000);
      }
      startGameTimeoutRef.current = null;
    }, 8000);
  }, []);

  const playCard = useCallback((cardId: string, chosenColor?: Exclude<Card['color'], 'wild'>) => {
    if (!playerId) return;
    socketRef.current?.emit('play_card', {
      payload: { playerId, cardId, chosenColor },
    });
  }, [playerId]);

  const drawCard = useCallback(() => {
    socketRef.current?.emit('draw_card');
  }, []);

  const skipTurn = useCallback(() => {
    socketRef.current?.emit('skip_turn');
  }, []);

  const discardColor = useCallback((color: Exclude<Card['color'], 'wild'>, cardIds?: string[]) => {
    socketRef.current?.emit('discard_color', { color, cardIds });
  }, []);

  const sayUno = useCallback(() => {
    socketRef.current?.emit('say_uno');
  }, []);

  const clearUnoCall = useCallback(() => {
    setUnoCall(null);
  }, []);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit('leave_room');
    pendingJoinRef.current = null;
    joinedRoomRef.current = null;
    setGameState(null);
    setLobbyPlayers([]);
    setRoomId(null);
    setSmileyReveal(null);
  }, []);

  const clearSmileyReveal = useCallback(() => {
    setSmileyReveal(null);
  }, []);

  return {
    connected,
    gameState,
    playerId,
    playerName,
    error,
    lobbyPlayers,
    roomId,
    joinRoom,
    startGame,
    playCard,
    drawCard,
    skipTurn,
    discardColor,
    sayUno,
    leaveRoom,
    revealedCards,
    smileyReveal,
    clearSmileyReveal,
    unoCall,
    clearUnoCall,
  };
}