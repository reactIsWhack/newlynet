const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
// const app = require('../index');
const app = express();
const { config } = require('dotenv');
const User = require('../models/user.model');
config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const onlineUsers = {};
let usersInClubChat = [];

const getSocketId = (userId) => {
  return onlineUsers[userId];
};

io.on('connection', async (socket) => {
  console.log(`user connected on socket with id of ${socket.id}`);

  const { school, userId, username } = socket.handshake.query;
  if (userId) {
    onlineUsers[userId] = socket.id;
  }

  socket.on('joinroom', async (roomname, isClubChat) => {
    console.log(`user: ${socket.id} joined room - ${roomname}`);
    socket.join(roomname);

    if (isClubChat) {
      const user = await User.findOne({ username })
        .select('-password')
        .populate('chats');
      usersInClubChat.push({
        user: userId,
        school,
        socket: socket.id,
        userData: user,
      });
      io.emit('usersInClubChat', usersInClubChat);
    }
  });

  socket.on('leaveroom', (roomname, isClubChat) => {
    console.log(`user: ${socket.id} left room - ${roomname}`);
    socket.leave(roomname);

    if (isClubChat) {
      usersInClubChat = usersInClubChat.filter((user) => user.user !== userId);
      io.emit('usersInClubChat', usersInClubChat);
    }
  });
  io.emit('usersInClubChat', usersInClubChat);

  io.emit('onlineUsers', Object.keys(onlineUsers));

  socket.on('disconnect', () => {
    console.log(`user disconnected from socket with id of ${socket.id} `);
    delete onlineUsers[userId];
    io.emit('onlineUsers', Object.keys(onlineUsers));
  });
});

const resetOnlineUsers = () => (usersInClubChat = []);

module.exports = {
  server,
  io,
  getSocketId,
  app,
  usersInClubChat,
  resetOnlineUsers,
};
