const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
// const app = require('../index');
const app = express();
const { config } = require('dotenv');
config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
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
  console.log(userId, 'userId\n');
  if (userId) {
    onlineUsers[userId] = socket.id;
  }

  socket.on('joinroom', (roomname) => {
    console.log(`user: ${socket.id} joined room - ${roomname}`);
    // the rooms will be used to check if a user has unread messages based on if they are in the room or not
    socket.join(roomname); // roomname is the id of a chat with the prefix "chat"
    console.log(io.sockets.adapter.rooms.get(roomname));
  });

  socket.on('leaveroom', (roomname) => {
    console.log(`user: ${socket.id} left room - ${roomname}`);
    socket.leave(roomname);
  });

  io.emit('onlineUsers', Object.keys(onlineUsers));

  console.log(onlineUsers);
  socket.on('disconnect', () => {
    console.log(`user disconnected from socket with id of ${socket.id} `);
    delete onlineUsers[userId];
    io.emit('onlineUsers', Object.keys(onlineUsers));
  });
});

module.exports = { server, io, getSocketId, app };
