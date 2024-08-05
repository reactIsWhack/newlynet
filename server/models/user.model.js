const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter your first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your last name'],
    },
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    grade: {
      type: Number,
      required: [true, 'Please enter a grade'],
    },
    school: {
      type: Object,
      required: [true, 'Please enter a school'],
    },
    interests: {
      type: Array,
      required: [true, 'Please select at least 1 club or sport interest'],
    },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // list of users that the user has stored to keep in contact with
    unreadChats: [
      {
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'chat' },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
      },
    ], // an array of chats that the user has not read recent messages in
    chattingWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    socialMediaUsernames: {
      snapchat: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
