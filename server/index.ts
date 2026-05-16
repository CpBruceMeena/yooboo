import http from 'http';
import { setupGameServer } from './gameServer';

const PORT = parseInt(process.env.PORT || '3001', 10);

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404);
  res.end();
});

setupGameServer(server);

server.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
});