const styleChatStreak = (streak) => {
  let fireStyles = {
    size: 18,
    textColor: 'text-red-500',
  };
  if (streak > 10) {
    fireStyles.size = 22;
    fireStyles.textColor = 'text-blue-500';
  }
  if (streak > 20) {
    fireStyles.size = 28;
    fireStyles.textColor = 'text-purple-500';
  }

  return fireStyles;
};

export default styleChatStreak;
