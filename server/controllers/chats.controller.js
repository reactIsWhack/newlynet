const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat.model');
const { io, getSocketId } = require('../socket/socket');

const createchat = asyncHandler(async (req, res) => {
  const { members, chatName } = req.body; // an array of users that will be part of the chat

  if (members.length > 20) {
    res.status(400);
    throw new Error('Group chats can have a maximum of 20 users');
  }

  if (!members.length) {
    res.status(400);
    throw new Error('Please add member(s) to the chat');
  }

  if (members.length > 1 && !chatName) {
    res.status(400);
    throw new Error('Please provide a chat name for the group');
  }

  const chat = await Chat.create({
    members: [...members, req.userId],
    messages: [],
    chatName,
    chatPic:
      members.length > 1
        ? 'https://cdn-icons-png.flaticon.com/512/6387/6387947.png'
        : '',
    chatType: members.length > 1 ? 'group' : 'individual',
  }).then((chat) =>
    chat.populate({ path: 'members', model: 'user', select: '-password' })
  );

  for (const member of members) {
    const socketId = getSocketId(member._id);
    if (socketId) io.to(socketId).emit('newChat', chat);
  }

  res.status(201).json(chat);
});

const getChats = asyncHandler(async (req, res) => {
  const { chatType } = req.params;

  const chats = await Chat.find({
    members: { $in: [req.userId] },
    chatType,
  }).populate([
    { path: 'members', model: 'user', select: '-password' },
    { path: 'messages', model: 'message' },
  ]);

  console.log(chats);
  res.status(200).json(chats);
});

module.exports = { createchat, getChats };