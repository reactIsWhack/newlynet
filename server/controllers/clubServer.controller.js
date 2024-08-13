const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const ClubServer = require('../models/clubServer.model');
const ClubChat = require('../models/clubChat.model');
const { io, getSocketId } = require('../socket/socket');

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

  if (
    user.serverInvites.some((invite) => String(invite) === String(serverId))
  ) {
    user.serverInvites = user.serverInvites.filter(
      (invite) => String(invite) !== String(serverId)
    );
  }

  clubServer.members = [...clubServer.members, user];

  await Promise.all([
    clubServer
      .save()
      .then((item) => item.populate({ path: 'members', select: '-password' })),
    user.save(),
  ]);

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

const inviteUserToServer = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { users } = req.body;

  if (users.length > 8) {
    res.status(400);
    throw new Error('Max of 8 user invites at a time');
  }

  const sendInvite = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.serverInvites = [...user.serverInvites, serverId];
    await user.save().then((item) => item.populate('serverInvites'));

    const socketId = getSocketId(user._id);
    io.to(socketId).emit('serverInvite', user.serverInvites);
  };

  await Promise.all(
    users.map(async (userId) => {
      await sendInvite(userId);
    })
  );

  res.status(200).json({ message: 'Invite(s) Sent!' });
});

const getUserClubServers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  const clubServers = await ClubServer.find({
    members: { $in: [user._id] },
    custom: true,
  }).populate([{ path: 'members', select: '-password' }, { path: 'chats' }]);

  res.status(200).json(clubServers);
});

const getSuggestedServers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  const clubServers = await ClubServer.find({
    custom: true,
    $or: [{ tags: { $in: user.interests } }, { tags: { $in: ['Social'] } }],
    members: { $nin: [user._id] },
    schoolAffiliation: user.school.schoolId,
  }).populate([{ path: 'members', select: '-password' }, { path: 'chats' }]);

  res.status(200).json(clubServers);
});

module.exports = {
  getClubServer,
  joinClubServer,
  createCustomClubServer,
  inviteUserToServer,
  getUserClubServers,
  getSuggestedServers,
};
