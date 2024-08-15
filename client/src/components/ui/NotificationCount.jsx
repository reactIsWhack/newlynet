import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import calculateUnreadMsgCount from '../../utils/calculateUnreadMsgCount';
import { selectClubChat } from '../../app/features/clubChat/clubChatSlice';

const NotificationCount = ({ array, includeInvites }) => {
  const { serverInvites, unreadClubChats } = useSelector(selectUser);
  const { chats } = useSelector(selectClubChat);
  const unreadServers = unreadClubChats.filter(
    (server) => !chats.some((chat) => chat._id === server.chat._id)
  );

  const count = includeInvites
    ? unreadServers.length
    : calculateUnreadMsgCount(array);

  return (
    <div className="w-6 h-6 rounded-full bg-red-500 absolute flex items-center justify-center text-white text-base -top-2 -right-2">
      {includeInvites ? count + serverInvites.length : count}
    </div>
  );
};

export default NotificationCount;
