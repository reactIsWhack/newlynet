const User = require('../models/user.model');
const { io, getSocketId } = require('../socket/socket');

const appendMessage = async (userId, serverChat, newMessage, serverId) => {
  console.log(serverChat._id);
  const user = await User.findById(userId);
  const unreadChat = user.unreadClubChatMessages.find(
    (chatItem) => chatItem.chat._id.toString() === serverChat._id.toString()
  );
  if (unreadChat) {
    unreadChat.messages = [...unreadChat.messages, newMessage];
  } else {
    user.unreadClubChatMessages = [
      ...user.unreadClubChatMessages,
      { chat: serverChat, messages: [newMessage], server: serverId },
    ];
  }
  await user.save().then((item) =>
    item.populate({
      path: 'unreadClubChatMessages',
      populate: [{ path: 'chat' }, { path: 'messages' }, { path: 'server' }],
    })
  );
  const socketId = getSocketId(userId);
  io.to(socketId).emit('clubChatNotif', user.unreadClubChatMessages);
};

const appendUnreadServerMessages = async (
  receivers,
  serverId,
  serverChat,
  newMessage
) => {
  const room = Array.from(
    io.sockets.adapter.rooms.get(`clubserver-${serverId}-${serverChat._id}`)
  );

  const usersNotInRoom = receivers.filter((receiverId) => {
    const socketId = getSocketId(receiverId);
    if (!room.includes(socketId)) return receiverId;
  });

  await Promise.all(
    usersNotInRoom.map(async (userId) => {
      await appendMessage(userId, serverChat, newMessage, serverId);
    })
  );
};

module.exports = appendUnreadServerMessages;
