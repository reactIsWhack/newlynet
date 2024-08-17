const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ClubServer = require('../models/clubServer.model');
const shuffle = require('../utils/shuffleArray');
const { interestOptions } = require('../db/data');
const ClubChat = require('../models/clubChat.model');

const shuffledInterests = ['General', ...shuffle(interestOptions)];

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, grade, school, interests } =
    req.body;

  if (!interests.length) {
    res.status(400);
    throw new Error('Please provide at least one club or sport interest');
  }

  if ((!school.description && !school.fullDescription) || !school.schoolId) {
    res.status(400);
    throw new Error('Please provide a valid school');
  }

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${school.schoolId}?fields=id,displayName&key=${process.env.API_KEY}`
  );
  const verifiedSchool = await response.json();
  if (response.status !== 200) {
    res.status(400);
    throw new Error('Please provide a valid school');
  }

  const clubServerExists = await ClubServer.findOne({
    schoolAffiliation: school.schoolId,
  });

  if (!clubServerExists) {
    const chats = [];
    for (const interest of shuffledInterests) {
      const clubChat = await ClubChat.create({
        messages: [],
        chatTopic: interest,
      });
      chats.push(clubChat);
    }
    await ClubServer.create({
      members: [],
      chats,
      schoolAffiliation: school.schoolId,
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    grade,
    school: {
      ...school,
      formattedName: verifiedSchool.displayName.text,
    },
    interests,
    contacts: [],
    profilePicture: `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&size=100`,
    chattingWith: [],
  });
  const token = generateToken(user._id);

  if (user) {
    res.cookie('token', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000), // 7days
    });
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      grade: user.grade,
      school: user.school,
      interests: user.interests,
      contacts: user.contacts,
      profilePicture: user.profilePicture,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const user = await User.findOne({ email }).populate('contacts');

  if (!user) {
    res.status(400);
    throw new Error('User does not exist, please create an account');
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error('Password incorrect');
  }

  const token = generateToken(user._id);
  res.cookie('token', token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000), // 7days
  });

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    grade: user.grade,
    school: user.school,
    interests: user.interests,
    contacts: user.contacts,
    profilePicture: user.profilePicture,
    chattingWith: user.chattingWith,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully!' });
});

const getLoginStatus = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(verified.userId);

  if (verified && user) {
    res.json(true);
  } else {
    res.json(false);
  }
});

module.exports = { registerUser, loginUser, logoutUser, getLoginStatus };
