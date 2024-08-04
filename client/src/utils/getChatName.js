const getChatName = (chatName, members, userId) => {
  const membersFiltered = members.filter((member) => member._id !== userId);
  const mem1 = membersFiltered[0];
  const mem2 = membersFiltered[1];

  let chatTitle = '';
  if (chatName) chatTitle = chatName;
  else if (membersFiltered.length === 2) {
    chatTitle = `${mem1.firstName} ${mem1.lastName} & ${mem2.firstName} ${mem2.lastName}`;
  } else {
    chatTitle = `${mem1.firstName} ${mem1.lastName} & ${
      membersFiltered.length - 1
    } others`;
  }

  return chatTitle;
};

export default getChatName;
