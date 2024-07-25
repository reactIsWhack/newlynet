const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

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
    });
  }
});

module.exports = { registerUser };
