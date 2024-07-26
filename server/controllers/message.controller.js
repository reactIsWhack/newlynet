const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const { getSocketId } = require('../socket/socket');
const { io } = require('../socket/socket');

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found, please try again');
  }

  const newMessage = await Message.create({
    message,
    author: req.userId,
    receivers: chat.members,
  }).then((msg) =>
    msg.populate([
      { path: 'author', model: 'user', select: '-password' },
      { path: 'receivers', model: 'user', select: '-password' },
    ])
  );

  if (newMessage) {
    chat.messages = [...chat.messages, newMessage];
    await chat.save();

    for (const member of chat.members) {
      const socketId = getSocketId(member);
      if (socketId) io.to(socketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  }
});

module.exports = { sendMessage };
