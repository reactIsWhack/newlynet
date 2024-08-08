const asyncHandler = require('express-async-handler');
const ClubChat = require('../models/clubChat.model');

const getActiveClubChat = asyncHandler(async (req, res) => {
  const activeClubChat = await ClubChat.findOne({ isActive: true });

  if (!activeClubChat) {
    return res.status(200).json({ message: 'No active club chats right now' });
  }

  res.status(200).json(activeClubChat);
});

module.exports = { getActiveClubChat };
