const calculateUnreadMsgCount = (array) => {
  const count = array.reduce((acc, current) => {
    acc += current.messages.length || 1;
    return acc;
  }, 0);

  return count;
};

export default calculateUnreadMsgCount;
