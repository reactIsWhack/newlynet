const asyncHandler = require('express-async-handler');
const ClubChat = require('../models/clubChat.model');
const Message = require('../models/message.model');
const { io } = require('../socket/socket');
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

  const newMessage = await Message.create({
    message,
    receivers: clubChat.members,
    media: { src: '', fileType: '' },
    isClubChatMsg: true,
    schoolAffiliation: user.school.schoolId,
    author: user,
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

const getClubChatMessages = asyncHandler(async (req, res) => {
  const { dateQuery, section } = req.params;

  const clubChat = await ClubChat.findOne({ isActive: true });
  const user = await User.findById(req.userId);

  const clubChatMessages =
    section === 'general' ? clubChat.generalMessages : clubChat.topicMessages;
  console.log(clubChatMessages);

  if (!clubChat) {
    res.status(404);
    throw new Error('No active chat open currently to send messages in');
  }

  const messages = await Message.find({
    isClubChatMsg: true,
    schoolAffiliation: user.school.schoolId,
    _id: { $in: clubChatMessages },
    createdAt: { $lt: dateQuery },
  })
    .limit(process.env.NODE_ENV === 'test' ? 2 : 30)
    .sort('-createdAt')
    .populate([
      { path: 'author', model: 'user', select: '-password' },
      { path: 'receivers', model: 'user', select: '-password' },
    ]);

  res.status(200).json(messages);
});

module.exports = {
  getActiveClubChat,
  sendClubChatMessage,
  getClubChatMessages,
};
