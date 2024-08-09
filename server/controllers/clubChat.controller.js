const asyncHandler = require('express-async-handler');
const ClubChat = require('../models/clubChat.model');
const Message = require('../models/message.model');
const { io, usersInClubChat } = require('../socket/socket');
const User = require('../models/user.model');

const getActiveClubChat = asyncHandler(async (req, res) => {
  const activeClubChat = await ClubChat.findOne({ isActive: true }).populate([
    'generalMessages',
    'topicMessages',
  ]);

  if (!activeClubChat) {
    return res.status(200).json({ message: 'No active club chats right now' });
  }

  res.status(200).json(activeClubChat);
});

const sendClubChatMessage = asyncHandler(async (req, res) => {
  const { message, messageType } = req.body;

  const clubChat = await ClubChat.findOne({ isActive: true });
  const user = await User.findById(req.userId);

  if (!clubChat) {
    res.status(404);
    throw new Error('No active chat open currently to send messages in');
  }

  const receivers = Object.keys(usersInClubChat).filter(
    (userId) => String(userId) !== String(user._id)
  );

  const newMessage = await Message.create({
    message,
    receivers,
    media: { src: '', fileType: '' },
    isClubChatMsg: true,
  }).then((msg) => msg.populate('receivers'));

  if (messageType === 'general') {
    clubChat.generalMessages = [...clubChat.generalMessages, newMessage];
  } else {
    clubChat.topicMessages = [...clubChat.topicMessages, newMessage];
  }
  await clubChat.save();

  if (!newMessage) {
    res.status(500);
    throw new Error('Message failed to send');
  }

  const roomName = `clubchat-${user.school.schoolId}`;

  io.to(roomName).emit('clubChatMsg', newMessage);

  res.status(201).json(newMessage);
});

module.exports = { getActiveClubChat, sendClubChatMessage };
