import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupGameServer } from './gameServer';

const PORT = parseInt(process.env.PORT || '3002', 10);
const SOCKET_IO_PATH = '/api/socketio';

// Create the HTTP server with an explicit request callback.
// IMPORTANT: Engine.IO's attach() saves ALL existing request listeners, removes them,
// and wraps them in a handler that ONLY calls them for paths that don't match
// the Socket.IO path. This means our callback below will never be invoked for
// Socket.IO paths that match — only for non-Socket.IO paths like /health.
//
// However, Engine.IO's path check adds a trailing slash (/api/socketio/).
// The polling transport sends URLs WITHOUT a trailing slash (/api/socketio?EIO=4...),
// which doesn't match. For those, our callback catches them and routes explicitly
// to io.engine.handleRequest(). This is safe because the callback is only invoked
// when Engine.IO's own check did NOT match — no double-handling risk.
const server = http.createServer((req, res) => {
  const url = req.url || '';

  // Health check endpoint
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Socket.IO paths that Engine.IO didn't match (e.g. polling without trailing slash).
  // Route them to Engine.IO's handler explicitly. This is safe because our callback
  // is only invoked when Engine.IO's own path check already determined this path
  // doesn't match — so there is no double-handling.
  if (url.startsWith(SOCKET_IO_PATH) && io.engine) {
    io.engine.handleRequest(req, res);
    return;
  }

  // Everything else is invalid
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end('Bad request — use a Socket.IO client or connect via nginx on port 3000.');
});

// Attach Socket.IO. Engine.IO will save our createServer callback and wrap it.
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
