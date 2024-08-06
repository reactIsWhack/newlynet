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
    chat.streak++;
    const currentDate = new Date(Date.now());
    chat.accomplishedDailyStreak.accomplished = true;
    chat.accomplishedDailyStreak.date = currentDate;
    for (const member of chat.members) {
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
