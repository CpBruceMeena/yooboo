'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card as CardType, CardColor } from '@/lib/game';
import { useWebRTC } from '@/hooks/useWebRTC';

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

export function useGame(): UseGameReturn & ReturnType<typeof useWebRTC> {
  const rtc = useWebRTC();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showChangeColor, setShowChangeColor] = useState(false);
  const [showDiscardAll, setShowDiscardAll] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDiscardColor, setPendingDiscardColor] = useState<Exclude<CardColor, 'wild'> | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [selectedDiscardIds, setSelectedDiscardIds] = useState<string[]>([]);

  const gameState = rtc.gameState;
  const isMyTurn = gameState?.players[gameState.currentPlayerIndex]?.id === rtc.playerId;
  const isLoading = !gameState || gameState.status === 'lobby';
  const localPlayer = gameState?.players.find((p) => p.id === rtc.playerId);
  const discardHandCards = localPlayer?.hand ?? [];

  const handleCardClick = useCallback((cardId: string) => {
    if (!gameState) return;

    const localPlayer = gameState.players.find((p) => p.id === rtc.playerId);
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
        rtc.playCard(cardId);

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
      rtc.playCard(cardId);
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardId);
    }
  }, [gameState, rtc, selectedCardId]);

  const handleDraw = useCallback(() => {
    if (!isMyTurn) return;
    rtc.drawCard();
    setSelectedCardId(null);
  }, [isMyTurn, rtc]);

  const handleSkipTurn = useCallback(() => {
    if (!isMyTurn) return;
    rtc.skipTurn();
    setSelectedCardId(null);
  }, [isMyTurn, rtc]);

  const handleSayUno = useCallback(() => {
    rtc.sayUno();
  }, [rtc]);

  const handleColorSelect = useCallback((color: Exclude<CardColor, 'wild'>) => {
    if (pendingCardId) {
      rtc.playCard(pendingCardId, color);
    }
    setShowChangeColor(false);
    setPendingCardId(null);
  }, [pendingCardId, rtc]);

  const handleDiscardSelect = useCallback((color: Exclude<CardColor, 'wild'>, cardIds?: string[]) => {
    rtc.discardColor(color, cardIds);
    setShowDiscardAll(false);
    setPendingCardId(null);
    setPendingDiscardColor(null);
  }, [rtc]);

  const handleEmote = useCallback((emote: string) => {
    // Emojis are sent as chat messages so they appear in the chat window
    rtc.sendChat(emote);
  }, [rtc]);

  const handleSendChat = useCallback((message: string) => {
    rtc.sendChat(message);
  }, [rtc]);

  const handleLeave = useCallback(() => {
    rtc.leaveRoom();
  }, [rtc]);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const cancelColor = useCallback(() => {
    setShowChangeColor(false);
    setPendingCardId(null);
  }, []);

  return {
    ...rtc,
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