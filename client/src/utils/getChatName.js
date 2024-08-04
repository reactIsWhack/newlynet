const getChatName = (chatName, members) => {
  const mem1 = members[0];
  const mem2 = members[1];
  let chatTitle = '';
  if (chatName) chatTitle = chatName;
  else if (members.length === 3) {
    const mem1 = members[0];
    const mem2 = members[1];
    chatTitle = `${mem1.firstName} ${mem1.lastName} & ${mem2.firstName} ${mem2.lastName}`;
  } else {
    chatTitle = `${mem1.firstName} ${mem1.lastName} & ${
      members.length - 2
    } others`;
  }

  return chatTitle;
};

export default getChatName;
