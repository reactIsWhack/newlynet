const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '5d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, grade, school, interests } = req.body;

  if (!interests.length) {
    res.status(400);
    throw new Error('Please provide at least one club or sport interest');
  }

  const user = await User.create({
    fullName,
    username,
    password,
    grade,
    school,
    interests,
    contacts: [],
  });
  const token = generateToken(user._id);

  if (user) {
    res.cookie(token, 'token', {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      grade: user.grade,
      school: user.school,
      interests: user.interests,
      contacts: user.contacts,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const user = await User.findOne({ username }).populate('contacts');

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
  res.cookie(token, 'token', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    grade: user.grade,
    school: user.school,
    interests: user.interests,
    contacts: user.contacts,
  });
});

module.exports = { registerUser, loginUser };
