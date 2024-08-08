const mongoose = require('mongoose');

const clubChatSchema = new mongoose.Schema({
  generalMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
  topicMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
  chatTopic: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const ClubChat = mongoose.model('clubChat', clubChatSchema);

module.exports = ClubChat;
