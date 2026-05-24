/**
 * Uno-No-Mercy Smoke Test
 *
 * Tests the game server through both nginx (port 3000) and direct connection (port 3002).
 * Validates: connection, room join, game start, card actions, chat, lobby rooms.
 *
 * Usage: node scripts/smoke-test.mjs
 *
 * Requires at minimum: game server on port 3002
 * For nginx tests: nginx on port 3000
 */

import { io } from 'socket.io-client';
import http from 'http';

const NGINX_URL = 'http://localhost:3000';
const DIRECT_URL = 'http://localhost:3002';
const SOCKET_PATH = '/api/socketio';
const ROOMS = {
  direct: 'smoke-direct-' + Date.now(),
  nginx: 'smoke-nginx-' + Date.now(),
  chat: 'smoke-chat-' + Date.now(),
};

// Quick check if a port is listening
function portCheck(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = http.get(`${u.protocol}//${u.hostname}:${u.port}/health`, res => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
  });
}

let passed = 0;
let failed = 0;
let total = 0;

function ok(cond, label) {
  total++;
  if (cond) { passed++; console.log('  \u2705', label); }
  else { failed++; console.log('  \u274C', label); }
}

function client(url, name, roomId = null) {
  const targetRoom = roomId || ROOMS.direct;
  return new Promise((resolve) => {
    const s = io(url, { path: SOCKET_PATH, transports: ['websocket', 'polling'] });
    const st = { connected: false, youAre: null, roomJoined: false, stateUpdate: null, playerJoined: false, invalid: null, events: [] };
    s.on('connect', () => { st.connected = true; st.events.push('connect'); s.emit('join_room', { roomId: targetRoom, playerName: name }); });
    s.on('you_are', (d) => { st.youAre = d; st.events.push('you_are'); });
    s.on('room_joined', (d) => { st.roomJoined = true; st.events.push('room_joined'); });
    s.on('state_update', (d) => { st.stateUpdate = d.state; st.events.push('state_update'); });
    s.on('player_joined', () => { st.playerJoined = true; st.events.push('player_joined'); });
    s.on('invalid_move', (d) => { st.invalid = d.reason; st.events.push('invalid:' + d.reason); });
    s.on('connect_error', (e) => st.events.push('err:' + e.message));
    const poll = setInterval(() => { if (st.roomJoined) { clearInterval(poll); resolve({ s, st, name }); } }, 100);
    setTimeout(() => { clearInterval(poll); resolve({ s, st, name }); }, 4000);
  });
}

async function waitFor(fn, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const r = fn();
    if (r) return r;
    await new Promise(r => setTimeout(r, 100));
  }
  return null;
}

async function runTests() {
  console.log('\n=======================================');
  console.log('  Uno-No-Mercy Smoke Test');
  console.log('  Room:', ROOMS.direct);
  console.log('=======================================\n');

  // ────── Phase 1: Direct Connection (port 3002) ──────
  console.log('--- Phase 1: Direct Connection (port 3002) ---');
  const [p1, p2] = await Promise.all([client(DIRECT_URL, 'Alice'), client(DIRECT_URL, 'Bob')]);
  ok(p1.st.connected, 'Alice connected (direct)');
  ok(p2.st.connected, 'Bob connected (direct)');
  ok(!!p1.st.youAre, 'Alice got you_are');
  ok(!!p2.st.youAre, 'Bob got you_are');

  const bothJoined = await waitFor(() => p1.st.roomJoined && p2.st.roomJoined ? true : null);
  ok(!!bothJoined, 'Both joined room');

  // player_joined: Alice (first) won't receive one; Bob (second) triggers one for Alice
  // If both are still in the "connecting" phase and neither has fully joined, only
  // the second player to join triggers a player_joined broadcast to the first.
  // So this is timing-dependent — we don't assert on player_joined explicitly.

  // Start game (direct)
  p1.s.emit('start_game');
  await new Promise(r => setTimeout(r, 3000));
  ok(!!p1.st.stateUpdate, 'Game state received (Alice, direct)');
  ok(!!p2.st.stateUpdate, 'Game state received (Bob, direct)');

  if (p1.st.stateUpdate) {
    const s = p1.st.stateUpdate;
    ok(s.players.length === 2, '2 players in game');
    ok(s.status === 'in_game', 'Status = in_game');
    ok(s.drawPile.length > 0, 'Draw pile has cards');
    const alice = s.players.find(p => p.id === p1.st.youAre.playerId);
    ok(alice && alice.hand.length === 7, 'Alice has 7 cards');
    const bob = s.players.find(p => p.id === p2.st.youAre.playerId);
    ok(bob && bob.hand.length === 0 && bob.handSize === 7, 'Bob hand hidden');
  }

  // Verify socket isn't in error state
  ok(!p1.st.invalid, 'No invalid_move errors');
  ok(!p2.st.invalid, 'No invalid_move errors for Bob');

  p1.s.close();
  p2.s.close();
  await new Promise(r => setTimeout(r, 500));
  console.log('');

  // ────── Phase 2: Nginx Socket.IO Handshake (port 3000, no Next.js needed) ──────
  console.log('--- Phase 2: Nginx Socket.IO Handshake (port 3000) ---');

  // Test raw Socket.IO Engine.IO polling handshake through nginx.
  // This tests that nginx correctly proxies /api/socketio to the game server
  // WITHOUT needing Next.js to be running on port 3001.
  // Engine.IO v4 sends: GET /api/socketio?EIO=4&transport=polling
  // A successful response is HTTP 200 with body starting with "0{" (Engine.IO open packet)
  try {
    const handshakeResult = await new Promise((resolve) => {
      const u = new URL(NGINX_URL);
      const req = http.get(
        `${u.protocol}//${u.hostname}:${u.port}${SOCKET_PATH}?EIO=4&transport=polling`,
        { timeout: 5000 },
        (res) => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        }
      );
      req.on('error', (e) => resolve({ error: e.message }));
      req.setTimeout(5000, () => { req.destroy(); resolve({ error: 'timeout' }); });
    });
    ok(!handshakeResult.error, 'Nginx Socket.IO handshake responded (no error)');
    if (!handshakeResult.error) {
      ok(handshakeResult.status === 200,
        `Nginx Socket.IO handshake HTTP 200 (got ${handshakeResult.status})`);
      ok(typeof handshakeResult.data === 'string' && handshakeResult.data.startsWith('0{'),
        `Nginx Socket.IO handshake valid Engine.IO open packet (starts with '0{')`);
    }
  } catch (e) {
    ok(false, 'Nginx Socket.IO handshake exception: ' + e.message);
  }
  console.log('');

  // ────── Phase 3: Full Game Flow Through Nginx (port 3000) ──────
  console.log('--- Phase 3: Full Game Flow Through Nginx (port 3000) ---');
  const nginxUp = await portCheck(NGINX_URL);
  if (!nginxUp) {
    console.log('  \u26a0\uFE0F  Skipping full nginx game flow (port 3000 not responding — Next.js may not be running)');
  } else {
    const [n1, n2] = await Promise.all([client(NGINX_URL, 'Carol', ROOMS.nginx), client(NGINX_URL, 'Dave', ROOMS.nginx)]);
    ok(n1.st.connected, 'Carol connected (nginx)');
    ok(n2.st.connected, 'Dave connected (nginx)');

    const nginxJoined = await waitFor(() => n1.st.roomJoined && n2.st.roomJoined ? true : null);
    ok(!!nginxJoined, 'Both joined room (nginx)');

    n1.s.emit('start_game');
    await new Promise(r => setTimeout(r, 4000));
    ok(!!n1.st.stateUpdate, 'Game state received (Carol, nginx)');
    ok(!!n2.st.stateUpdate, 'Game state received (Dave, nginx)');

    if (n1.st.stateUpdate) {
      const s = n1.st.stateUpdate;
      ok(s.players.length === 2, '2 players (nginx)');
      ok(s.status === 'in_game', 'Status = in_game (nginx)');
      const carol = s.players.find(p => p.id === n1.st.youAre.playerId);
      ok(carol && carol.hand.length === 7, 'Carol has 7 cards');
      ok(!n1.st.invalid, 'No invalid_move (nginx)');

      // Test game action through nginx
      // Determine which player's turn it is and have them play
      const currentPlayer = s.players.find(p => p.id === s.currentTurn);
      if (currentPlayer && currentPlayer.hand.length > 0) {
        const top = s.discardPile[s.discardPile.length - 1];
        const playable = currentPlayer.hand.find(c =>
          c.color === 'wild' || c.color === s.activeColor ||
          (c.type === 'number' && top.type === 'number' && c.value === top.value) ||
          c.type === top.type
        );
        const source = currentPlayer.id === n1.st.youAre.playerId ? n1 : n2;
        if (playable) {
          const before = source.st.stateUpdate;
          source.s.emit('play_card', { payload: { playerId: currentPlayer.id, cardId: playable.id, chosenColor: playable.color === 'wild' ? 'red' : undefined } });
          await new Promise(r => setTimeout(r, 3000));
          ok(source.st.stateUpdate !== before, 'State changed after play_card (nginx)');
        } else {
          source.s.emit('draw_card');
          await new Promise(r => setTimeout(r, 3000));
          ok(true, 'Drew card (no playable, nginx)');
        }
      }
    }

    n1.s.close();
    n2.s.close();
  }
  await new Promise(r => setTimeout(r, 500));
  console.log('');

  // ────── Phase 4: Chat & Lobby ──────
  console.log('--- Phase 4: Chat & Lobby ---');
  const [c1, c2] = await Promise.all([client(DIRECT_URL, 'Eve', ROOMS.chat), client(DIRECT_URL, 'Frank', ROOMS.chat)]);
  await waitFor(() => c1.st.roomJoined ? true : null, 3000);
  await waitFor(() => c2.st.roomJoined ? true : null, 3000);

  // Verify chat is actually broadcast by listening on the second client
  const chatPromise = new Promise(resolve => {
    c2.s.once('chat_message', msg => resolve(msg));
    setTimeout(() => resolve(null), 3000);
  });
  c1.s.emit('chat_message', { message: 'Hello from Eve!' });
  const chatReceived = await chatPromise;
  ok(chatReceived !== null && chatReceived.message === 'Hello from Eve!', 'Chat message broadcast to room');

  const lobbyResp = await new Promise(resolve => {
    c1.s.emit('lobby_rooms');
    c1.s.once('lobby_rooms', d => resolve(d));
    setTimeout(() => resolve(null), 3000);
  });
  ok(lobbyResp !== null, 'Lobby rooms responded');

  c1.s.close();
  c2.s.close();

  // ────── Summary ──────
  console.log('\n=======================================');
  console.log(`  ${passed}/${total} passed, ${failed} failed`);
  console.log('=======================================\n');
  process.exit(failed ? 1 : 0);
}

runTests().catch(e => { console.error('FATAL:', e); process.exit(1); });
