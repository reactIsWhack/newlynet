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
  },
  { timestamps: true }
);

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
