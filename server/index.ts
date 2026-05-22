import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupGameServer } from './gameServer';

const PORT = parseInt(process.env.PORT || '3002', 10);
const SOCKET_IO_PATH = '/api/socketio';

// Create a bare HTTP server for Socket.IO
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  // All other paths are handled by Socket.IO middleware
  res.writeHead(404);
  res.end('Not found — this is the game server. Connect via nginx on port 3000.');
});

// Attach Socket.IO (nginx proxies /api/socketio to this server)
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: SOCKET_IO_PATH,
  // Increase timeouts for ngrok tunnel latency
  pingTimeout: 30000,
  pingInterval: 12000,
});

// Set up game logic on the io instance
setupGameServer(io);

server.listen(PORT, () => {
  console.log(`🎮 Game server running on :${PORT}`);
  console.log(`   Socket.IO at ${SOCKET_IO_PATH}`);
  console.log(`   (nginx on port 3000 proxies to this server)`);
});
