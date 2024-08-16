const sortByNewest = (array, field) => {
  return array.sort((a, b) => {
    const aDate = a.messages.length
      ? a.messages[a.messages.length - 1].createdAt
      : a.createdAt || a.chat.createdAt;
    const bDate = b.messages.length
      ? b.messages[b.messages.length - 1].createdAt
      : b.createdAt || b.chat.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
};

export default sortByNewest;
