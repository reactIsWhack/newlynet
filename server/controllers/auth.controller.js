const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ClubServer = require('../models/clubServer.model');
const shuffle = require('../utils/shuffleArray');
const { interestOptions } = require('../db/data');
const ClubChat = require('../models/clubChat.model');
const nodemailer = require('nodemailer');

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

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email');
  }
  console.log(email);

  const user = await User.findOne({ email });

  if (!user) {
    console.log('no user');
    res.status(404);
    throw new Error('User not found');
  }

  // Generate a unique JWT token for the user that contains the user's id
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });

  // Send the token to the user's email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_APP_EMAIL,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Email configuration
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Reset Password',
    html: `<h1>Reset Your Password</h1>
    <p>Click on the following link to reset your password:</p>
    <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500);
      throw new Error('Failed to send email, try again later');
    }
    res.status(200).send({ message: 'Email sent' });
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // If the token is invalid, return an error
  if (!decodedToken) {
    res.status(401);
    throw new Error('Invalid token');
  }

  // find the user with the id from the token
  const user = await User.findOne({ _id: decodedToken.userId });
  if (!user) {
    res.status(401);
    throw new Error('No authorized user found');
  }

  // Update user's password, clear reset token and expiration time
  user.password = newPassword;
  await user.save();

  // Send success response
  res.status(200).json({ message: 'Password updated' });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  forgetPassword,
  resetPassword,
};
