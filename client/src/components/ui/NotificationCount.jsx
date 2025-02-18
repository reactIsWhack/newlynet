import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import calculateUnreadMsgCount from '../../utils/calculateUnreadMsgCount';

const NotificationCount = ({ array, includeInvites }) => {
  const { serverInvites, unreadClubChats } = useSelector(selectUser);
  const count = includeInvites
    ? unreadClubChats.length
    : calculateUnreadMsgCount(array);

  return (
    <div className="w-6 h-6 rounded-full bg-red-500 absolute flex items-center justify-center text-white text-base -top-2 -right-2">
      {includeInvites ? count + serverInvites.length : count}
    </div>
  );
};

export default NotificationCount;
