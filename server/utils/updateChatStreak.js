const { isSameDay } = require('date-fns');

const updateChatStreak = async (chat, newMessage) => {
  const messagesToday = chat.messages.filter((msg) =>
    isSameDay(new Date(msg.createdAt), new Date(newMessage.createdAt))
  );
  let totalContributionsToday = [];

  if (messagesToday.length) {
    for (const msg of messagesToday) {
      if (
        chat.members.some(
          (memberId) => String(memberId) === String(msg.author._id)
        )
      ) {
        totalContributionsToday.push(true);
      } else {
        totalContributionsToday.push(false);
      }
    }
  }
  if (
    !totalContributionsToday.includes(false) &&
    totalContributionsToday.length >= chat.members.length
  ) {
    chat.streak++;
    chat.accomplishedDailyStreak.accomplished = true;
    chat.accomplishedDailyStreak.date = new Date(Date.now());
  }
};

module.exports = updateChatStreak;
