const mongoose = require('mongoose');

const clubChatSchema = new mongoose.Schema(
  {
    generalMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
    topicMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
    chatTopic: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  { timestamps: true }
);

const ClubChat = mongoose.model('clubChat', clubChatSchema);

module.exports = ClubChat;
