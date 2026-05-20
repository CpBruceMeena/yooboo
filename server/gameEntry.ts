import http from 'http';
import { setupGameServer } from './gameServer';

const PORT = parseInt(process.env.GAME_PORT || '3002', 10);

const server = http.createServer();
setupGameServer(server);

server.listen(PORT, () => {
  console.log(`🎮 Game server running on :${PORT}`);
  console.log(`   Socket.IO path: /api/socketio`);
});
