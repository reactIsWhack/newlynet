const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const ClubServer = require('../models/clubServer.model');
const ClubChat = require('../models/clubChat.model');
const { io } = require('../socket/socket');

const getClubServer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  const clubServer = await ClubServer.findOne({
    schoolAffiliation: user.school.schoolId,
  }).populate([
    { path: 'chats' },
    { path: 'members', select: '-password', populate: 'chats' },
  ]);

  if (!clubServer) {
    res.status(404);
    throw new Error('Club server not found');
  }

  res.status(200).json(clubServer);
});

const joinClubServer = asyncHandler(async (req, res) => {
  const { serverId } = req.params;

  const user = await User.findById(req.userId);
  const clubServer = await ClubServer.findById(serverId);

  if (!clubServer) {
    res.status(404);
    throw new Error('Club server not found');
  }

  clubServer.members = [...clubServer.members, user];

  await clubServer
    .save()
    .then((item) => item.populate({ path: 'members', select: '-password' }));

  if (!clubServer) {
    res.status(500);
    throw new Error('Failed to join club server');
  }

  io.emit('clubServerJoin', clubServer, user);

  res.status(200).json(clubServer);
});

const createCustomClubServer = asyncHandler(async (req, res) => {
  const { tags, serverName } = req.body;

  if (!serverName) {
    res.status(400);
    throw new Error('Please provide a server name');
  }

  if (!tags.length) {
    res.status(400);
    throw new Error('Please input at least one tag');
  }
  const existingClubServer = await ClubServer.findOne({ serverName });

  if (existingClubServer) {
    res.status(400);
    throw new Error('Server name already exists');
  }

  const user = await User.findById(req.userId);
  const generalClubChat = await ClubChat.create({
    chatTopic: 'General',
    messages: [],
  });

  const customServer = await ClubServer.create({
    serverName,
    tags,
    custom: true,
    schoolAffiliation: user.school.schoolId,
    chats: [generalClubChat],
    members: [user],
  }).then((item) => item.populate(['chats', 'members']));

  res.status(201).json(customServer);
});

module.exports = { getClubServer, joinClubServer, createCustomClubServer };
