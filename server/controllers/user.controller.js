const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const { getSocketId, io } = require('../socket/socket');
const cloudinary = require('cloudinary').v2;

const addContact = asyncHandler(async (req, res) => {
  const { contactId } = req.params;

  const user = await User.findById(req.userId).select('-password');
  const contactedUser = await User.findById(contactId);

  if (!contactedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  user.contacts = [contactedUser, ...user.contacts];

  await user.save().then((item) =>
    item.populate([
      {
        path: 'contacts',
        model: 'user',
        select: '-password',
        populate: { path: 'chats' },
      },
    ])
  );

  res.status(200).json(user);
});

const getCommonNewStudents = asyncHandler(async (req, res) => {
  const { filter } = req.params; // the user can find other new students either by grade or common interests, hence the filter property
  const { cursor } = req.query;

  const user = await User.findById(req.userId);
  let users;

  console.log(cursor);
  let query = {};
  if (cursor) query._id = { $gt: cursor };

  if (filter === 'grade') {
    users = await User.find({
      grade: user.grade,
      $and: [
        { 'school.schoolId': user.school.schoolId },
        { _id: { $ne: user._id } },
        { _id: { $nin: user.contacts } },
        { _id: { $nin: user.chattingWith } },
        query,
      ],
    })
      .limit(process.env.NODE_ENV === 'test' ? 1 : 20)
      .populate('chats'); // for testing pagination
  } else {
    users = await User.find({
      $and: [
        { 'school.schoolId': user.school.schoolId },
        { _id: { $ne: user._id } },
        { _id: { $nin: user.contacts } },
        { _id: { $nin: user.chattingWith } },
        query,
      ],
      interests: { $in: user.interests },
    })
      .limit(process.env.NODE_ENV === 'test' ? 1 : 20)
      .populate('chats');
  }

  res.status(200).json(users);
});

const getPersonalProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate([
    {
      path: 'contacts',
      model: 'user',
      select: '-password',
      populate: { path: 'chats' },
    },
    {
      path: 'unreadChats',
      populate: [
        { path: 'chat', populate: ['members', 'messages'] },
        'messages',
      ],
    },
    {
      path: 'unreadClubChatMessages',
      populate: [{ path: 'chat' }, { path: 'messages' }, { path: 'server' }],
    },
    {
      path: 'serverInvites',
      populate: ['server', { path: 'sender', populate: 'chats' }],
    },
  ]);

  if (!user) {
    res.status(404);
    throw new Error('Cannot find your profile');
  }

  res.status(200).json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { grade, school, interests, replacedInterests } = req.body;
  const user = await User.findById(req.userId);

  if (
    grade === user.grade &&
    school.schoolId === user.school.schoolId &&
    !interests.length
  ) {
    res.status(400);
    throw new Error('Please provide a field to be updated');
  }

  let profilePicture = '';
  if (req.file) {
    try {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'newlynet',
        resource_type: 'image',
      });
      profilePicture = secure_url;
    } catch (error) {
      console.log(error);
    }
  }

  let schoolDetails;
  if (school && school.schoolId !== user.school.schoolId) {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${school.schoolId}?fields=id,displayName&key=${process.env.API_KEY}`
    );
    const verifiedSchool = await response.json();
    schoolDetails = {
      ...school,
      formattedName: verifiedSchool.displayName.text,
    };
  }

  user.grade = grade || user.grade;
  user.school = schoolDetails || user.school;
  user.profilePicture = profilePicture || user.profilePicture;

  if (interests.length) {
    if (interests.length === 3) user.interests = interests;
    else {
      const filteredInterests = user.interests.filter(
        (interest) => !replacedInterests.includes(interest)
      );
      user.interests = [...filteredInterests, ...interests];
    }
  }

  await user.save();

  res.status(200).json(user);
});

const addSocialMediaInfo = asyncHandler(async (req, res) => {
  const { snapchat, instagram } = req.body;

  if (!snapchat && !instagram) {
    res.status(400);
    throw new Error('Please provide at least one social media username');
  }

  const user = await User.findById(req.userId).select('-password');

  if (
    snapchat === user.socialMediaUsernames.snapchat &&
    instagram === user.socialMediaUsernames.instagram
  ) {
    res.status(400);
    throw new Error('Please change your username(s) to update it');
  }

  user.socialMediaUsernames.snapchat = snapchat;
  user.socialMediaUsernames.instagram = instagram;

  await user.save();

  for (let i = 0; i < user.contacts.length; i++) {
    const contact = user.contacts[i];
    const socketId = getSocketId(String(contact));
    if (socketId) {
      io.to(socketId).emit(
        'socialMediaUsername',
        String(user._id),
        user.socialMediaUsernames.snapchat,
        user.socialMediaUsernames.instagram
      );
    }
  }

  res.status(200).json(user);
});

const searchForUser = asyncHandler(async (req, res) => {
  const { searchQuery } = req.params;

  if (searchQuery.includes('/')) {
    res.status(400);
    console.log('/error');
    throw new Error('Please remove all / characters');
  }

  const user = await User.findById(req.userId);

  let users = await User.find({
    $or: [
      {
        firstName: {
          $regex: `^${searchQuery}`,
          $options: 'i',
        },
      },
      {
        lastName: {
          $regex: `^${searchQuery}`,
          $options: 'i',
        },
      },
    ],
    'school.schoolId': user.school.schoolId,
  });

  if (!users.length) {
    users = await User.aggregate()
      .addFields({
        fullName: { $concat: ['$firstName', '$lastName'] },
      })
      .match({
        fullName: { $regex: searchQuery, $options: 'i' },
        'school.schoolId': user.school.schoolId,
      })
      .lookup({
        from: 'chats',
        localField: 'chats',
        foreignField: '_id',
        as: 'chats',
      });
  }

  res.status(200).json(users);
});

module.exports = {
  addContact,
  getCommonNewStudents,
  getPersonalProfile,
  updateProfile,
  addSocialMediaInfo,
  searchForUser,
};
