const User = require('../models/user.model');
const { getSocketId } = require('../socket/socket');
const appendUnreadChat = require('./appendUnreadChat');
const { io } = require('../socket/socket');
const Chat = require('../models/chat.model');

const sendMessageNotification = async (newMessage, chat) => {
  for (const receiver of newMessage.receivers) {
    const socketId = getSocketId(receiver._id);
    const receiverObj = await User.findById(receiver._id);
    const unreadChatItem = receiverObj.unreadChats.find(
      (chatItem) => String(chatItem.chat._id) === String(chat._id)
    );
    if (!socketId) {
      appendUnreadChat(unreadChatItem, newMessage, receiverObj, chat);
      await receiverObj.save();
      continue;
    }

    io.to(socketId).emit('newMessage', newMessage, chat);
    const room = io.sockets.adapter.rooms.get(`chat-${chat._id}`);
    if (!room) break;

    // if the user is not on the chat, add the new messages to their list of unread messages
    if (!room.has(socketId)) {
      const unreadChat = await Chat.findById(unreadChatItem?._id); // unread chat is sent to the client for notifications
      appendUnreadChat(unreadChatItem, newMessage, receiverObj, chat);
      await receiverObj.save().then((item) =>
        item.populate({
          path: 'unreadChats',
          populate: ['chat', 'messages'],
        })
      );
      const sendingChat = unreadChat || chat;
      io.to(socketId).emit(
        'newMessageNotify',
        receiverObj.unreadChats,
        sendingChat
      );
    }
  }
};

module.exports = sendMessageNotification;
