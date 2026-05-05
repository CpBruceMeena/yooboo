import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, ServerMessage, ClientMessage, Player, Card } from '@/lib/game';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

interface UseWebRTCReturn {
  connected: boolean;
  gameState: GameState | null;
  playerId: string | null;
  playerName: string | null;
  error: string | null;
  joinRoom: (roomId: string, playerName: string) => void;
  startGame: () => void;
  playCard: (cardId: string, chosenColor?: Exclude<Card['color'], 'wild'>) => void;
  drawCard: () => void;
  discardColor: (color: Exclude<Card['color'], 'wild'>) => void;
  sayUno: () => void;
  leaveRoom: () => void;
  revealedCards: { card: Card; playerId: string }[];
}

export function useWebRTC(): UseWebRTCReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<{ card: Card; playerId: string }[]>([]);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('you_are', (data: { playerId: string; playerName: string }) => {
      setPlayerId(data.playerId);
      setPlayerName(data.playerName);
    });

    socket.on('state_update', (data: { state: GameState }) => {
      setGameState(data.state);
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

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = useCallback((roomId: string, name: string) => {
    socketRef.current?.emit('join_room', { roomId, playerName: name });
  }, []);

  const startGame = useCallback(() => {
    socketRef.current?.emit('start_game');
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

  const discardColor = useCallback((color: Exclude<Card['color'], 'wild'>) => {
    socketRef.current?.emit('discard_color', { color });
  }, []);

  const sayUno = useCallback(() => {
    socketRef.current?.emit('say_uno');
  }, []);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit('leave_room');
    setGameState(null);
  }, []);

  return {
    connected,
    gameState,
    playerId,
    playerName,
    error,
    joinRoom,
    startGame,
    playCard,
    drawCard,
    discardColor,
    sayUno,
    leaveRoom,
    revealedCards,
  };
}