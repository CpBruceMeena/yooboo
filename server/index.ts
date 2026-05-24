import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupGameServer } from './gameServer';

const PORT = parseInt(process.env.PORT || '3002', 10);
const SOCKET_IO_PATH = '/api/socketio';

// Create the HTTP server.
const server = http.createServer();

// Attach Socket.IO. Its Engine.IO middleware uses prependListener internally,
// but Node.js 25 may handle listener ordering differently. To be safe, we
// explicitly route Socket.IO paths to engine.handleRequest() in our handler.
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: SOCKET_IO_PATH,
  // Increase timeouts for ngrok tunnel latency
  pingTimeout: 30000,
  pingInterval: 12000,
});

// Set up game logic on the io instance
setupGameServer(io);

// Request handler. Only handles /health and routes Socket.IO paths to Engine.IO.
// All other paths return a 400.
server.on('request', (req, res) => {
  const url = req.url || '';

  // Health check
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Route Socket.IO paths to Engine.IO's request handler explicitly.
  // We do this because Engine.IO's prependListener may not work reliably
  // with Node.js 25's event emitter behavior.
  if (url.startsWith(SOCKET_IO_PATH) && io.engine) {
    io.engine.handleRequest(req, res);
    return;
  }

  // Everything else is invalid
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end('Bad request — use a Socket.IO client or connect via nginx on port 3000.');
});

server.listen(PORT, () => {
  console.log(`🎮 Game server running on :${PORT}`);
  console.log(`   Socket.IO at ${SOCKET_IO_PATH}`);
  console.log(`   (nginx on port 3000 proxies to this server)`);
});
