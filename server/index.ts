import http from 'http';
import type { ServerResponse } from 'http';
import httpProxy from 'http-proxy';
import { Server as SocketIOServer } from 'socket.io';
import { setupGameServer } from './gameServer';

const PORT = parseInt(process.env.PORT || '3000', 10);
const NEXTJS_URL = process.env.NEXTJS_URL || 'http://localhost:3001';
const SOCKET_IO_PATH = '/api/socketio';

// Create proxy instance for forwarding HTTP and WebSocket to Next.js
const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

proxy.on('error', (err, req, res) => {
  console.error('[proxy] Error:', err.message);
  if (res && 'headersSent' in res && !res.headersSent) {
    const serverResponse = res as ServerResponse;
    serverResponse.writeHead(502, { 'Content-Type': 'text/plain' });
    serverResponse.end('Bad Gateway');
  }
});

const server = http.createServer((req, res) => {
  // Socket.IO handles /api/socketio paths natively — let it through
  if (req.url?.startsWith(SOCKET_IO_PATH)) {
    return;
  }
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  // Proxy everything else to Next.js
  proxy.web(req, res, { target: NEXTJS_URL });
});

// Handle WebSocket upgrades.
// Socket.IO handles its own upgrades internally (registers its own `upgrade` listener).
// We only need to proxy non-SocketIO upgrades (Next.js HMR) to port 3001.
server.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith(SOCKET_IO_PATH)) {
    // Socket.IO handles this — return early
    return;
  }
  // Proxy WebSocket upgrades (Next.js HMR) to port 3001
  proxy.ws(req, socket, head, { target: NEXTJS_URL });
});

// Attach Socket.IO directly to this server (handles /api/socketio natively)
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: SOCKET_IO_PATH,
});

// Set up game logic on the io instance
setupGameServer(io);

server.listen(PORT, () => {
  console.log(`🚀 Combined server running on :${PORT}`);
  console.log(`   Socket.IO natively at ${SOCKET_IO_PATH}`);
  console.log(`   Next.js proxied to ${NEXTJS_URL}`);
  console.log(`   (Start Next.js separately on port 3001)`);
});
