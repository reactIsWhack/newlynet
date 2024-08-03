import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';

const NotificationCount = () => {
  const { unreadChats } = useSelector(selectUser);

  return (
    <div className="w-6 h-6 rounded-full bg-red-500 absolute flex items-center justify-center text-white text-base -top-2 -right-2">
      {unreadChats.length}
    </div>
  );
};

export default NotificationCount;
