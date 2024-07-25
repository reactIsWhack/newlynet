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

module.exports = { addContact };
