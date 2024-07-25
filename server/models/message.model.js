const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Please a provide a message'],
    },
    receivers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
