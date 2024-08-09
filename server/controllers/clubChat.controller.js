const asyncHandler = require('express-async-handler');
const ClubChat = require('../models/clubChat.model');
const Message = require('../models/message.model');
const { io } = require('../socket/socket');
const User = require('../models/user.model');
const { shuffledInterests } = require('../utils/seeds');

const joinClubChat = asyncHandler(async (req, res) => {
  const clubChat = await ClubChat.findOne({ isActive: true });

  if (!clubChat) {
    res.status(404);
    throw new Error('No active club chat, join later');
  }

  clubChat.members = [...clubChat.members, req.userId];

  await clubChat.save().then((item) => item.populate('members'));

  res.status(200).json(clubChat);
});

const getActiveClubChat = asyncHandler(async (req, res) => {
  const activeClubChat = await ClubChat.findOne({ isActive: true }).populate([
    'generalMessages',
    'topicMessages',
    'members',
  ]);
  const currentIndex = shuffledInterests.indexOf(activeClubChat.chatTopic);
  const nextTopic = shuffledInterests[currentIndex + 1] || shuffledInterests[0];

  if (!activeClubChat) {
    return res.status(200).json({ message: 'No active club chats right now' });
  }

  res.status(200).json({ nextTopic, clubChat: activeClubChat });
});

const sendClubChatMessage = asyncHandler(async (req, res) => {
  const { message, messageType } = req.body;

  const clubChat = await ClubChat.findOne({ isActive: true }).populate(
    'members'
  );
  const user = await User.findById(req.userId);

  if (!clubChat.members.some((m) => m._id.toString() === user._id.toString())) {
    res.status(400);
    throw new Error('Please join the chat club to send a message');
  }

  if (!clubChat) {
    res.status(404);
    throw new Error('No active chat open currently to send messages in');
  }

  const receivers = clubChat.members.filter(
    (member) =>
      String(member._id) !== String(req.userId) &&
      member.school.schoolId === user.school.schoolId
  );

  const newMessage = await Message.create({
    message,
    receivers,
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

  if (!clubChat.members.some((m) => m.toString() === user._id.toString())) {
    res.status(400);
    throw new Error('Please join the chat club to view messages');
  }

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
  joinClubChat,
};
