const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat.model');
const { io, getSocketId } = require('../socket/socket');
const cloudinary = require('cloudinary').v2;

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
    creator: req.userId,
  }).then((chat) =>
    chat.populate([
      { path: 'members', model: 'user', select: '-password' },
      { path: 'creator' },
    ])
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

const updateChatSettings = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { chatName } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  let newChatPic;
  if (req.file) {
    try {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'newlynet',
        resource_type: 'image',
      });
      newChatPic = secure_url;
    } catch (error) {
      console.log(error);
    }
  }

  chat.chatName = chatName || chat.chatName;
  chat.chatPic = newChatPic || chat.chatPic;

  await chat.save().then((item) => item.populate(['members', 'messages']));
  const chatMembers = chat.members.filter(
    (member) => String(member._id) !== String(req.userId)
  );

  for (const chatMember of chatMembers) {
    const socketId = getSocketId(chatMember._id);
    if (socketId) {
      io.to(socketId).emit('updatedChat', chat);
    }
  }

  res.status(200).json(chat);
});

const leaveGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId).then((item) =>
    item.populate('members')
  );

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  const updatedChatMembers = chat.members.filter(
    (member) => String(member._id) !== String(req.userId)
  );

  if (!updatedChatMembers.length) {
    // if all members leave the chat, delete the chat entirely
    await chat.deleteOne();
    return res.status(200).json(chat);
  }

  chat.members = updatedChatMembers;

  await chat.save().then((item) => item.populate(['members', 'messages']));

  for (const member of chat.members) {
    const socketId = getSocketId(member._id);
    if (socketId) {
      io.to(socketId).emit('memberChange', chat);
    }
  }

  res.status(200).json(chat);
});

module.exports = { createchat, getChats, updateChatSettings, leaveGroupChat };
