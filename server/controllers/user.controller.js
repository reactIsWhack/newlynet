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
  console.log(user);

  res.status(200).json(user);
});

const getCommonNewStudents = asyncHandler(async (req, res) => {
  const { filter, dateQuery } = req.params; // the user can find other new students either by grade or common interests, hence the filter property
  // filter is an object since the user can filter by higher, lower, or same grade

  const user = await User.findById(req.userId);
  let users;

  if (filter === 'grade') {
    users = await User.find({
      grade: user.grade,
      $and: [
        { 'school.description': user.school.description },
        { 'school.formattedName': user.school.formattedName },
        { _id: { $ne: user._id } },
        { _id: { $nin: user.contacts } },
      ],
      createdAt: { $lte: dateQuery },
    })
      .sort('-createdAt')
      .limit(20);
  } else {
    users = await User.find({
      $and: [
        { 'school.description': user.school.description },
        { 'school.formattedName': user.school.formattedName },
        { _id: { $ne: user._id } },
        { _id: { $nin: user.contacts } },
      ],
      createdAt: { $lte: dateQuery },
      interests: { $in: user.interests },
    })
      .sort('-createdAt')
      .limit(20);
  }

  res.status(200).json(users);
});

module.exports = { addContact, getCommonNewStudents };
