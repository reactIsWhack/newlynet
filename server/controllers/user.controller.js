const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

const addContact = asyncHandler(async (req, res) => {
  const { contactId } = req.params;

  const user = await User.findById(req.userId).select('-password');
  const contactedUser = await User.findById(contactId);

  if (!contactedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  user.contacts = [contactedUser, ...user.contacts];

  await user
    .save()
    .then((item) =>
      item.populate({ path: 'contacts', model: 'user', select: '-password' })
    );

  res.status(200).json(user);
});

const getCommonNewStudents = asyncHandler(async (req, res) => {
  const { filter } = req.params; // the user can find other new students either by grade or common interests, hence the filter property
  // filter is an object since the user can filter by higher, lower, or same grade
  const { cursor } = req.query;

  const user = await User.findById(req.userId);
  let users;

  let query = {};
  if (cursor) query._id = { $gt: cursor };

  if (filter === 'grade') {
    users = await User.find({
      grade: user.grade,
      $and: [
        { 'school.description': user.school.description },
        { 'school.formattedName': user.school.formattedName },
        { _id: { $ne: user._id } },
        { _id: { $nin: user.contacts } },
        query,
      ],
      // createdAt: { $lte: dateQuery },
    }).limit(process.env.NODE_ENV === 'test' ? 1 : 20); // for testing pagination
  } else {
    users = await User.find({
      $and: [
        { 'school.description': user.school.description },
        { 'school.formattedName': user.school.formattedName },
        { _id: { $ne: user._id } },
        { _id: { $nin: user.contacts } },
        query,
      ],
      interests: { $in: user.interests },
    }).limit(process.env.NODE_ENV === 'test' ? 1 : 20);
  }

  const nextCursor = users.length ? users[users.length - 1]._id : null;

  res.status(200).json({ users, nextCursor });
});

const getPersonalProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate({
    path: 'contacts',
    model: 'user',
    select: '-password',
  });

  if (!user) {
    res.status(404);
    throw new Error('Cannot find your profile');
  }

  res.status(200).json(user);
});

module.exports = { addContact, getCommonNewStudents, getPersonalProfile };
