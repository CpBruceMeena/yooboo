'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card as CardType, CardColor } from '@/lib/game';
import { useSocket } from '@/hooks/useSocket';

interface UseGameReturn {
  selectedCardId: string | null;
  showChangeColor: boolean;
  showDiscardAll: boolean;
  pendingCardId: string | null;
  pendingDiscardColor: Exclude<CardColor, 'wild'> | null;
  toast: { message: string; type: 'info' | 'success' | 'error' } | null;
  handleCardClick: (cardId: string) => void;
  handleDraw: () => void;
  handleSkipTurn: () => void;
  handleSayUno: () => void;
  handleColorSelect: (color: Exclude<CardColor, 'wild'>) => void;
  handleDiscardSelect: (color: Exclude<CardColor, 'wild'>) => void;
  handleEmote: (emote: string) => void;
  handleSendChat: (message: string) => void;
  handleLeave: () => void;
  clearToast: () => void;
  cancelColor: () => void;
  isMyTurn: boolean;
  isLoading: boolean;
  discardHandCards: CardType[];
  selectedDiscardIds: string[];
  setSelectedDiscardIds: (ids: string[]) => void;
}

export function useGame(): UseGameReturn & ReturnType<typeof useSocket> {
  const socket = useSocket();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showChangeColor, setShowChangeColor] = useState(false);
  const [showDiscardAll, setShowDiscardAll] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDiscardColor, setPendingDiscardColor] = useState<Exclude<CardColor, 'wild'> | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [selectedDiscardIds, setSelectedDiscardIds] = useState<string[]>([]);

  const gameState = socket.gameState;
  const isMyTurn = gameState?.players[gameState.currentPlayerIndex]?.id === socket.playerId;
  const isLoading = !gameState || gameState.status === 'lobby';
  const localPlayer = gameState?.players.find((p) => p.id === socket.playerId);
  const discardHandCards = localPlayer?.hand ?? [];

  const handleCardClick = useCallback((cardId: string) => {
    if (!gameState) return;

    const localPlayer = gameState.players.find((p) => p.id === socket.playerId);
    if (!localPlayer) return;

    const card = localPlayer.hand.find((c) => c.id === cardId);
    if (!card) return;

    // If smiley is active, only smiley cards can be interacted with
    if (gameState.smileyActive && card.type !== 'smiley') return;

    if (selectedCardId === cardId) {
      if (card.type === 'smiley' || card.color === 'wild') {
        setPendingCardId(cardId);
        setShowChangeColor(true);
        setSelectedCardId(null);
        return;
      }
      if (card.type === 'discardAll') {
        socket.playCard(cardId);

        // Only show discard modal if this is the FIRST discardAll in a chain.
        // Playing discardAll over discardAll = just play the card, no extra discard.
        const prevTop = gameState.discardPile[gameState.discardPile.length - 1];
        if (!prevTop || prevTop.type !== 'discardAll') {
          setPendingCardId(cardId);
          setPendingDiscardColor(card.color as Exclude<CardColor, 'wild'>);
          setShowDiscardAll(true);
        }
        // else: previous card is also discardAll — no modal, turn advances server-side

        setSelectedCardId(null);
        return;
      }
      socket.playCard(cardId);
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardId);
    }
  }, [gameState, socket, selectedCardId]);

  const handleDraw = useCallback(() => {
    if (!isMyTurn) return;
    socket.drawCard();
    setSelectedCardId(null);
  }, [isMyTurn, socket]);

  const handleSkipTurn = useCallback(() => {
    if (!isMyTurn) return;
    socket.skipTurn();
    setSelectedCardId(null);
  }, [isMyTurn, socket]);

  const handleSayUno = useCallback(() => {
    socket.sayUno();
  }, [socket]);

  const handleColorSelect = useCallback((color: Exclude<CardColor, 'wild'>) => {
    if (pendingCardId) {
      socket.playCard(pendingCardId, color);
    }
    setShowChangeColor(false);
    setPendingCardId(null);
  }, [pendingCardId, socket]);

  const handleDiscardSelect = useCallback((color: Exclude<CardColor, 'wild'>, cardIds?: string[]) => {
    socket.discardColor(color, cardIds);
    setShowDiscardAll(false);
    setPendingCardId(null);
    setPendingDiscardColor(null);
  }, [socket]);

  const handleEmote = useCallback((emote: string) => {
    // Emojis are sent as chat messages so they appear in the chat window
    socket.sendChat(emote);
  }, [socket]);

  const handleSendChat = useCallback((message: string) => {
    socket.sendChat(message);
  }, [socket]);

  const handleLeave = useCallback(() => {
    socket.leaveRoom();
  }, [socket]);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const cancelColor = useCallback(() => {
    setShowChangeColor(false);
    setPendingCardId(null);
  }, []);

  return {
    ...socket,
    selectedCardId,
    showChangeColor,
    showDiscardAll,
    pendingCardId,
    pendingDiscardColor,
    toast,
    handleCardClick,
    handleDraw,
    handleSkipTurn,
    handleSayUno,
    handleColorSelect,
    handleDiscardSelect,
    handleEmote,
    handleSendChat,
    handleLeave,
    clearToast,
    cancelColor,
    isMyTurn,
    isLoading,
    discardHandCards,
    selectedDiscardIds,
    setSelectedDiscardIds,
  };
}