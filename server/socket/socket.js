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
let usersInClubServer = [];

const getSocketId = (userId) => {
  return onlineUsers[userId];
};

io.on('connection', async (socket) => {
  console.log(`user connected on socket with id of ${socket.id}`);

  const { userId } = socket.handshake.query;
  if (userId) {
    onlineUsers[userId] = socket.id;
  }

  socket.on('joinroom', async (roomname, isClubServer, chatSection) => {
    console.log(`user: ${socket.id} joined room - ${roomname}`);
    socket.join(roomname);
    if (isClubServer) {
      const userData = await User.findById(userId)
        .select('-password')
        .populate('chats');
      if (
        !usersInClubServer.some(
          (user) => user.userId.toString() === userData._id.toString()
        )
      ) {
        usersInClubServer.push({
          socket: socket.id,
          userId,
          chatSection,
          userData,
        });
        io.emit('onlineClubUsers', usersInClubServer, userData);
      }
      console.log(usersInClubServer);
    }
  });

  socket.on('leaveroom', (roomname, isClubServer) => {
    console.log(`user: ${socket.id} left room - ${roomname}`);

    socket.leave(roomname);
    if (isClubServer) {
      usersInClubServer = usersInClubServer.filter(
        (user) => user.userId !== userId
      );
      io.emit('onlineClubUsers', usersInClubServer);
      console.log(usersInClubServer);
    }
  });

  io.emit('onlineUsers', Object.keys(onlineUsers));
  io.emit('onlineClubUsers', usersInClubServer);

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
  resetOnlineUsers,
};
