const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const ClubServer = require('../models/clubServer.model');
const { io } = require('../socket/socket');

const getClubServer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  const clubServer = await ClubServer.findOne({
    schoolAffiliation: user.school.schoolId,
  }).populate([{ path: 'chats' }, { path: 'members', select: '-password' }]);

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

module.exports = { getClubServer, joinClubServer };
