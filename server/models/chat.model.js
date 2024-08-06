const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
      required: [true, 'Please add member(s) to the chat'],
    },
    messages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
    },
    chatName: {
      type: String,
      default: null,
    },
    chatPic: {
      type: String,
    },
    chatType: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    streak: { type: Number, default: 0 },
    accomplishedDailyStreak: {
      accomplished: { type: Boolean, default: false },
      date: { type: Date, default: '' },
    },
    highestStreak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
