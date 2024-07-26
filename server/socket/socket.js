const { Server } = require('socket.io');
const http = require('http');
const app = require('../index');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const onlineUsers = {};

const getSocketId = (userId) => {
  return onlineUsers[userId];
};

io.on('connection', (socket) => {
  console.log(`user connected on socket with id of ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId !== 'undefined ') {
    onlineUsers[userId] = socket.id;
  }

  io.emit('onlineUsers', Object.keys(onlineUsers));

  io.on('disconnect', () => {
    console.log(`user disconnected from socket with id of ${socket.id} `);
  });
});

module.exports = { server, io, getSocketId };
