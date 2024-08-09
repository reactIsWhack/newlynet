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
const usersInClubChat = {};

const getSocketId = (userId) => {
  return onlineUsers[userId];
};

io.on('connection', (socket) => {
  console.log(`user connected on socket with id of ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers[userId] = socket.id;
  }

  socket.on('joinroom', (roomname, isClubChat) => {
    console.log(`user: ${socket.id} joined room - ${roomname}`);
    socket.join(roomname);
    console.log(isClubChat);
    if (isClubChat) {
      usersInClubChat[userId] = socket.id;
      io.emit('usersInClubChat', Object.keys(usersInClubChat));
    }
  });

  socket.on('leaveroom', (roomname, isClubChat) => {
    console.log(`user: ${socket.id} left room - ${roomname}`);
    socket.leave(roomname);
    if (isClubChat) {
      delete usersInClubChat[userId];
      io.emit('usersInClubChat', Object.keys(usersInClubChat));
    }
  });

  io.emit('onlineUsers', Object.keys(onlineUsers));

  socket.on('disconnect', () => {
    console.log(`user disconnected from socket with id of ${socket.id} `);
    delete onlineUsers[userId];
    io.emit('onlineUsers', Object.keys(onlineUsers));
  });
});

module.exports = { server, io, getSocketId, app, usersInClubChat };
