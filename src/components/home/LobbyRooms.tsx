'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';

interface RoomInfo {
  roomId: string;
  playerCount: number;
  players: { id: string; name: string }[];
}

interface LobbyRoomsProps {
  onJoinRoom: (roomId: string) => void;
}

export default function LobbyRooms({ onJoinRoom }: LobbyRoomsProps) {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(() => {
    const socket = io(undefined, {
      path: '/api/socketio',
      transports: ['polling', 'websocket'],
      timeout: 10000,
      reconnection: false,
      forceNew: true,
    });

    socket.on('connect', () => {
      socket.emit('lobby_rooms');
    });

    socket.on('lobby_rooms', (data: { rooms: RoomInfo[] }) => {
      setRooms(data.rooms.filter(r => r.playerCount >= 1));
      setLoading(false);
      socket.disconnect();
    });

    socket.on('connect_error', () => {
      setLoading(false);
      socket.disconnect();
    });

    setTimeout(() => {
      if (socket.connected) {
        socket.disconnect();
        setLoading(false);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 15000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  if (loading) return null;

  if (rooms.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-4" />
      <h3 className="text-[10px] font-mono text-creamMuted/40 uppercase tracking-[0.3em] mb-3 text-center">
        // Active Rooms ({rooms.length})
      </h3>
      <div className="space-y-2">
        <AnimatePresence>
          {rooms.map((room) => (
            <motion.div
              key={room.roomId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface/60 border border-gold/10 hover:border-gold/25 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {room.players.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="w-6 h-6 rounded-full bg-surface border border-gold/20 flex items-center justify-center text-[9px] font-mono text-gold/80"
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {room.players.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-surface border border-gold/20 flex items-center justify-center text-[8px] font-mono text-goldMuted">
                      +{room.players.length - 4}
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-mono text-sm text-cream tracking-wider">{room.roomId}</span>
                  <span className="text-[10px] font-mono text-creamMuted/40 ml-2">
                    {room.playerCount} {room.playerCount === 1 ? 'player' : 'players'}
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => onJoinRoom(room.roomId)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded-md bg-gold/10 text-goldGlow text-[10px] font-mono tracking-wider border border-gold/20 hover:bg-gold/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                JOIN
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
