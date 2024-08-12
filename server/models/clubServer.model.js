const mongoose = require('mongoose');

const clubServerSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clubChat' }],
    schoolAffiliation: {
      type: String,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    tags: Array,
    serverName: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const ClubServer = mongoose.model('clubServer', clubServerSchema);

module.exports = ClubServer;
