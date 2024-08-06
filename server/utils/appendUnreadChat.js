const appendUnreadChat = (unreadChatItem, newMessage, receiverObj, chat) => {
  if (unreadChatItem) {
    unreadChatItem.messages = [...unreadChatItem.messages, newMessage];
  } else {
    receiverObj.unreadChats = [
      ...receiverObj.unreadChats,
      { chat: chat._id, messages: [newMessage._id] },
    ];
  }
};

module.exports = appendUnreadChat;
