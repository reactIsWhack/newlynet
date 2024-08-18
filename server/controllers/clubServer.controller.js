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
    user.serverInvites.some(
      (invite) => String(invite.server) === String(serverId)
    )
  ) {
    user.serverInvites = user.serverInvites.filter(
      (invite) => String(invite.server) !== String(serverId)
    );
  }

  clubServer.members = [...clubServer.members, user];

  await Promise.all([
    clubServer
      .save()
      .then((item) =>
        item.populate([
          { path: 'members', select: '-password', populate: 'chats' },
          { path: 'chats' },
          { path: 'owner', select: '-password' },
          { path: 'admins', select: '-password' },
        ])
      ),
    user.save(),
  ]);

  if (!clubServer) {
    res.status(500);
    throw new Error('Failed to join club server');
  }

  for (const member of clubServer.members) {
    if (member._id.toString() !== req.userId.toString()) {
      const socketId = getSocketId(String(member._id));
      io.to(socketId).emit('serverMemberChange', clubServer, user, 'joined');
    }
  }

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
    owner: req.userId,
  }).then((item) => item.populate(['chats', 'members', 'owner']));

  res.status(201).json(customServer);
});

const inviteUserToServer = asyncHandler(async (req, res) => {
  const { serverId, userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.serverInvites = [
    ...user.serverInvites,
    { server: serverId, sender: req.userId },
  ];
  await user.save().then((item) =>
    item.populate({
      path: 'serverInvites',
      populate: ['server', 'sender'],
    })
  );

  const socketId = getSocketId(user._id);
  io.to(socketId).emit('serverInvite', user.serverInvites);

  res.status(200).json(user);
});

const getUserClubServers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  const clubServers = await ClubServer.find({
    members: { $in: [user._id] },
    custom: true,
  }).populate([
    { path: 'members', populate: { path: 'chats' }, select: '-password' },
    { path: 'chats' },
    { path: 'owner', select: '-password', populate: 'chats' },
    { path: 'admins', select: '-password', populate: 'chats' },
  ]);

  res.status(200).json(clubServers);
});

const getSuggestedServers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  const clubServers = await ClubServer.find({
    custom: true,
    $or: [{ tags: { $in: user.interests } }, { tags: { $in: ['Social'] } }],
    members: { $nin: [user._id] },
    schoolAffiliation: user.school.schoolId,
    _id: { $nin: user.serverInvites.map((server) => server.server) },
  }).populate([{ path: 'members', select: '-password' }, { path: 'chats' }]);

  res.status(200).json(clubServers);
});

const createServerChannel = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { channelName } = req.body;

  if (!channelName) {
    res.status(400);
    throw new Error('Please provide a channel name');
  }

  const server = await ClubServer.findById(serverId);

  if (
    String(req.userId) !== String(server.owner) &&
    !server.admins.some((admin) => String(admin) === String(req.userId))
  ) {
    res.status(400);
    throw new Error('You are not permitted to create a channel');
  }

  const clubChat = await ClubChat.create({
    messages: [],
    chatTopic: channelName,
  });
  server.chats = [...server.chats, clubChat];
  await server.save().then((item) => item.populate('chats'));

  server.members.forEach((member) => {
    if (String(member) !== String(req.userId)) {
      const socketId = getSocketId(String(member));
      io.to(socketId).emit('newChannel', server, clubChat);
    }
  });

  res.status(200).json(server);
});

const addServerAdmin = asyncHandler(async (req, res) => {
  const { serverId, userId } = req.params;

  const server = await ClubServer.findById(serverId);

  if (server.admins.length === 4) {
    res.status(400);
    throw new Error('Server can only have up to 4 admins');
  }

  if (!server) {
    res.status(404);
    throw new Error('Server not found');
  }

  server.admins = [userId, ...server.admins];
  await server.save().then((item) => item.populate('admins'));

  for (let i = 0; i < server.members.length; i++) {
    const memberId = server.members[i];
    if (memberId.toString() === req.userId.toString()) continue;
    const socketId = getSocketId(String(memberId));
    if (!socketId) continue;
    io.to(socketId).emit('newAdmin', server);
  }

  res.status(200).json(server);
});

const leaveClubServer = asyncHandler(async (req, res) => {
  const { serverId } = req.params;

  const server = await ClubServer.findById(serverId);
  const user = await User.findById(req.userId);

  if (!server) {
    res.status(404);
    throw new Error('Server not found');
  }

  const updatedMembers = server.members.filter(
    (memberId) => String(memberId) !== String(req.userId)
  );
  const updatedAdmins = server.admins.filter(
    (adminId) => String(adminId) !== String(req.userId)
  );
  server.members = updatedMembers;
  server.admins = updatedAdmins;

  await server.save().then((item) => item.populate('members'));

  for (let i = 0; i < server.members.length; i++) {
    const member = server.members[i];
    const socketId = getSocketId(member._id.toString());
    io.to(socketId).emit('serverMemberChange', server, user, 'left');
  }

  res.status(200).json(server);
});

const getCustomServer = asyncHandler(async (req, res) => {
  const { serverId } = req.params;

  const server = await ClubServer.findById(serverId).populate([
    { path: 'members', select: '-password', populate: 'chats' },
    { path: 'owner', select: '-password', populate: 'chats' },
    { path: 'chats' },
    { path: 'admins', select: '-password', populate: 'chats' },
  ]);

  if (!server) {
    res.status(404);
    throw new Error('Server not found');
  }

  res.status(200).json(server);
});

module.exports = {
  getClubServer,
  joinClubServer,
  createCustomClubServer,
  inviteUserToServer,
  getUserClubServers,
  getSuggestedServers,
  createServerChannel,
  addServerAdmin,
  leaveClubServer,
  getCustomServer,
};
