const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const { getSocketId } = require('../socket/socket');
const { io } = require('../socket/socket');
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

  if (newMessage) {
    chat.messages = [...chat.messages, newMessage];
    await chat.save();

    for (const receiver of newMessage.receivers) {
      const socketId = getSocketId(receiver._id);
      console.log(socketId);
      if (socketId) io.to(socketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  }
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

  res.status(200).json(chat.messages);
});

module.exports = { sendMessage, getMessages };
