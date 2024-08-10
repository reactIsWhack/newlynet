const asyncHandler = require('express-async-handler');
const ClubChat = require('../models/clubChat.model');
const Message = require('../models/message.model');
const { io } = require('../socket/socket');
const User = require('../models/user.model');
const { shuffledInterests } = require('../utils/seeds');
const ClubServer = require('../models/clubServer.model');

const sendClubChatMessage = asyncHandler(async (req, res) => {
  const { message, chatSection } = req.body;
  const { serverId } = req.params;

  const clubServer = await ClubServer.findById(serverId).populate('chats');
  const user = await User.findById(req.userId);

  if (!clubServer) {
    res.status(404);
    throw new Error('Club server not found');
  }

  if (
    !clubServer.members.some(
      (memberId) => String(memberId) === String(user._id)
    )
  ) {
    res.status(400);
    throw new Error('Please join the club server to send messagse');
  }

  const receivers = clubServer.members.filter(
    (member) => String(member) !== String(user._id)
  );
  const newMessage = await Message.create({
    message,
    receivers,
    author: user,
    isClubChatMsg: true,
    schoolAffiliation: user.school.schoolId,
  }).then((item) => item.populate(['receivers', 'author']));

  if (!newMessage) {
    res.status(500);
    throw new Error('Message failed to send');
  }

  const serverChat = clubServer.chats.find(
    (chat) => chat.chatTopic === chatSection
  );
  const chat = await ClubChat.findById(serverChat._id);
  chat.messages = [...chat.messages, newMessage];
  await chat.save();

  io.to(`clubserver-${clubServer._id}-${chat._id}`).emit(
    'newClubServerMsg',
    chat,
    newMessage
  );

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
  sendClubChatMessage,
  getClubChatMessages,
};
