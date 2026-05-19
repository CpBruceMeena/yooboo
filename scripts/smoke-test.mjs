import { io } from 'socket.io-client';

function makeClient(name) {
  const socket = io('http://localhost:3001');

  socket.on('connect', () => {
    console.log(`${name} connected (${socket.id})`);
    socket.emit('join_room', { roomId: 'test-room', playerName: name });
  });

  socket.on('you_are', (data) => {
    console.log(name, 'you_are', data);
  });

  socket.on('room_joined', (data) => {
    console.log(name, 'room_joined', data.players.map(p=>p.name));
  });

  socket.on('state_update', (data) => {
    console.log(name, 'state_update: players=', data.state.players.map(p=>({ id: p.id, name: p.name, hand: p.hand.length })));
  });

  socket.on('invalid_move', (d) => console.log(name, 'invalid_move', d));
  socket.on('player_joined', (d) => console.log(name, 'player_joined', d));
  socket.on('player_eliminated', (d) => console.log(name, 'player_eliminated', d));
  socket.on('game_won', (d) => console.log(name, 'game_won', d));

  return socket;
}

async function run() {
  const a = makeClient('Alice');
  const b = makeClient('Bob');

  // Wait shortly then trigger start from Alice
  setTimeout(() => {
    console.log('Attempting to start game (Alice)');
    a.emit('start_game');
  }, 1000);

  // Close after a few seconds
  setTimeout(() => {
    a.close();
    b.close();
    console.log('Smoke test finished');
    process.exit(0);
  }, 6000);
}

run();
