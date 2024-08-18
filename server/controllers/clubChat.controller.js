const asyncHandler = require('express-async-handler');
const ClubChat = require('../models/clubChat.model');
const Message = require('../models/message.model');
const { io } = require('../socket/socket');
const User = require('../models/user.model');
const { shuffledInterests } = require('../utils/seeds');
const ClubServer = require('../models/clubServer.model');
const appendUnreadServerMessages = require('../utils/appendUnreadServerMessages');

const sendClubChatMessage = asyncHandler(async (req, res) => {
  const { message, chatSection } = req.body;
  const { serverId } = req.params;

  if (!message) {
    res.status(400);
    throw new Error('Please provide a message');
  }

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
  await Promise.all([
    chat.save(),
    appendUnreadServerMessages(receivers, serverId, serverChat, newMessage),
  ]);

  io.to(`clubserver-${clubServer._id}-${chat._id}`).emit(
    'newClubServerMsg',
    chat,
    newMessage
  );

  res.status(201).json(newMessage);
});

const getClubChatMessages = asyncHandler(async (req, res) => {
  const { dateQuery, chatId } = req.params;

  const clubChat = await ClubChat.findById(chatId);

  console.log(clubChat, dateQuery);
  if (!clubChat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  const messages = await Message.find({
    _id: { $in: clubChat.messages },
    createdAt: { $lt: dateQuery },
  })
    .limit(process.env.NODE_ENV === 'test' ? 2 : 8)
    .sort('-createdAt')
    .populate([
      { path: 'author', select: '-password' },
      { path: 'receivers', select: '-password' },
    ]);

  res.status(200).json(messages);
});

const readClubChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  console.log(chatId);

  const user = await User.findById(req.userId);

  const updatedUnreadChats = user.unreadClubChatMessages.filter(
    (chatItem) => String(chatItem._id) !== String(chatId)
  );
  console.log(updatedUnreadChats);

  user.unreadClubChatMessages = updatedUnreadChats;
  await user.save().then((item) =>
    item.populate({
      path: 'unreadClubChatMessages',
      populate: [{ path: 'chat' }, { path: 'messages' }],
    })
  );

  res.status(200).json(user);
});

module.exports = {
  sendClubChatMessage,
  getClubChatMessages,
  readClubChatMessages,
};
