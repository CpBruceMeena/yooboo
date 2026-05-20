import http from 'http';
import type { ServerResponse } from 'http';
import httpProxy from 'http-proxy';
import { URL } from 'url';

const PORT = parseInt(process.env.PORT || '3000', 10);
const GAME_SERVER_URL = process.env.GAME_SERVER_URL || 'http://localhost:3002';
const NEXTJS_URL = process.env.NEXTJS_URL || 'http://localhost:3001';
const SOCKET_IO_PATH = '/api/socketio';

// Create proxy instance
const proxy = httpProxy.createProxyServer({
  ws: true, // Enable WebSocket proxying
  changeOrigin: true,
});

// Log proxy errors
proxy.on('error', (err, req, res) => {
  console.error('[proxy] Error:', err.message);
  // res can be ServerResponse (HTTP error) or Socket (WebSocket error)
  if (res && 'headersSent' in res && !res.headersSent) {
    const serverResponse = res as ServerResponse;
    serverResponse.writeHead(502, { 'Content-Type': 'text/plain' });
    serverResponse.end('Bad Gateway');
  }
});

// Log proxy requests
proxy.on('proxyReq', (proxyReq, req) => {
  console.log('[proxy]', req.method, req.url, '→', proxyReq.host + ':' + proxyReq.getHeader('host'));
});

const server = http.createServer((req, res) => {
  if (req.url?.startsWith(SOCKET_IO_PATH)) {
    // Proxy Socket.IO to game server
    console.log('[proxy] Socket.IO:', req.method, req.url);
    proxy.web(req, res, { target: GAME_SERVER_URL });
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    // Proxy everything else to Next.js
    console.log('[proxy] Next.js:', req.method, req.url);
    proxy.web(req, res, { target: NEXTJS_URL });
  }
});

// Handle WebSocket upgrades for Socket.IO
server.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith(SOCKET_IO_PATH)) {
    console.log('[proxy] WebSocket upgrade:', req.url);
    proxy.ws(req, socket, head, { target: GAME_SERVER_URL });
  } else {
    console.log('[proxy] WebSocket upgrade (Next.js HMR?):', req.url);
    proxy.ws(req, socket, head, { target: NEXTJS_URL });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Reverse proxy running on :${PORT}`);
  console.log(`   Socket.IO → ${GAME_SERVER_URL}${SOCKET_IO_PATH}`);
  console.log(`   Next.js   → ${NEXTJS_URL}`);
  console.log(`   (Start the game server and Next.js separately)`);
});
