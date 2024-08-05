const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const { getSocketId } = require('../socket/socket');
const { io } = require('../socket/socket');
const User = require('../models/user.model');
const appendUnreadChat = require('../utils/appendUnreadChat');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found, please try again');
  }

  const receivers = chat.members.filter(
    (member) => member._id.toString() !== req.userId.toString()
  );

  let mediaInfo = {
    src: '',
    fileType: '',
  };

  if (req.file) {
    try {
      const media = await cloudinary.uploader.upload(req.file.path, {
        folder: 'newlynet',
        resource_type:
          req.file.mimetype === 'video/mp4' ||
          req.file.mimetype === 'video/quicktime'
            ? 'video'
            : 'image',
      });
      mediaInfo.src = media.secure_url;
      mediaInfo.fileType = req.file.mimetype;
    } catch (error) {
      console.log('Error uploading to cloudinary: ' + error);
    }
  }

  const newMessage = await Message.create({
    message,
    author: req.userId,
    receivers,
    media: mediaInfo,
  }).then((msg) =>
    msg.populate([
      { path: 'author', model: 'user', select: '-password' },
      { path: 'receivers', model: 'user', select: '-password' },
    ])
  );

  if (!newMessage) {
    res.status(500);
    throw new Error('Message failed to send');
  }

  chat.messages = [...chat.messages, newMessage];
  await chat.save().then((item) => item.populate('members'));

  for (const receiver of newMessage.receivers) {
    const socketId = getSocketId(receiver._id);
    const receiverObj = await User.findById(receiver._id);
    const unreadChatItem = receiverObj.unreadChats.find(
      (chatItem) => String(chatItem.chat._id) === String(chat._id)
    );
    if (!socketId) {
      appendUnreadChat(unreadChatItem, newMessage, receiverObj, chat);
      await receiverObj.save();
      continue;
    }

    io.to(socketId).emit('newMessage', newMessage, chat);
    const room = io.sockets.adapter.rooms.get(`chat-${chat._id}`);
    if (!room) break;

    // if the user is not on the chat, add the new messages to their list of unread messages
    if (!room.has(socketId)) {
      const unreadChat = await Chat.findById(unreadChatItem?._id); // unread chat is sent to the client for notifications
      appendUnreadChat(unreadChatItem, newMessage, receiverObj, chat);
      await receiverObj.save().then((item) =>
        item.populate({
          path: 'unreadChats',
          populate: ['chat', 'messages'],
        })
      );
      const sendingChat = unreadChat || chat;
      io.to(socketId).emit(
        'newMessageNotify',
        receiverObj.unreadChats,
        sendingChat
      );
    }
  }
  res.status(201).json(newMessage);
});

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId).populate({
    path: 'messages',
    model: 'message',
    populate: [
      { path: 'author', model: 'user', select: '-password' },
      { path: 'receivers', model: 'user', select: '-password' },
    ],
  });

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // mark unread messsages as read by removing the chat from the unreadChats array
  const user = await User.findById(req.userId).populate('unreadChats');
  const updatedUnreadChats = user.unreadChats.filter(
    (chatItem) => String(chatItem.chat._id) !== String(chat._id)
  );
  user.unreadChats = updatedUnreadChats;
  await user
    .save()
    .then((item) =>
      item.populate({ path: 'unreadChats', populate: ['chat', 'messagse'] })
    );

  const socketId = getSocketId(user._id);
  io.to(socketId).emit('newMessageNotify', user.unreadChats);

  res.status(200).json(chat.messages);
});

const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { messageText } = req.body;

  const message = await Message.findById(messageId).populate([
    { path: 'author', select: '-password' },
    { path: 'receivers', select: '-password' },
  ]);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (!messageText) {
    res.status(400);
    throw new Error('Please provide a message');
  }

  if (messageText == message.message) {
    // if the updated message text is the same as the old message, throw an error
    res.status(400);
    throw new Error('Please provide a new message');
  }

  message.message = messageText;
  await message.save().then((msg) => msg.populate(['author', 'receivers']));

  for (const receiver of message.receivers) {
    const socketId = getSocketId(receiver._id);
    if (socketId) io.to(socketId).emit('editMessage', message);
  }

  res.status(200).json(message);
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await message.deleteOne();

  for (const receiver of message.receivers) {
    const socketId = getSocketId(receiver);
    if (socketId) {
      io.to(socketId).emit('deletedMessage', message);
    }
  }

  res.status(200).json(message);
});

module.exports = { sendMessage, getMessages, editMessage, deleteMessage };
