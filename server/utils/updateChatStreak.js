const { isSameDay } = require('date-fns');
const { io, getSocketId } = require('../socket/socket');

const updateChatStreak = async (chat, newMessage) => {
  const messagesToday = chat.messages.filter((msg) =>
    isSameDay(new Date(msg.createdAt), new Date(newMessage.createdAt))
  );
  let contributorsToday = new Set([]);

  if (messagesToday.length) {
    for (const msg of messagesToday) {
      if (
        chat.members.some(
          (memberId) => String(memberId) === String(msg.author._id)
        )
      ) {
        contributorsToday.add(String(msg.author._id));
      }
    }
  }
  if (contributorsToday.size === chat.members.length) {
    if (chat.streak === chat.highestStreak) chat.highestStreak++; // update the highest streak of a chat if it has been reached
    chat.streak++;
    const currentDate = new Date(Date.now());
    chat.accomplishedDailyStreak.accomplished = true;
    chat.accomplishedDailyStreak.date = currentDate;

    for (const member of chat.members) {
      // alert the members on the client side to update the streak for a given chat
      const socketId = getSocketId(member._id);
      if (socketId)
        io.to(socketId).emit('updatedStreak', chat, chat.streak + 1, {
          accomplished: true,
          date: currentDate,
        });
    }
  }
};

module.exports = updateChatStreak;
