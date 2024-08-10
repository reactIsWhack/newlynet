const mongoose = require('mongoose');

const clubChatSchema = new mongoose.Schema(
  {
    messages: [],
    chatTopic: {
      type: String,
    },
  },
  { timestamps: true }
);

const ClubChat = mongoose.model('clubChat', clubChatSchema);

module.exports = ClubChat;
