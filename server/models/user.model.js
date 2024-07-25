const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please enter a fullname'],
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
