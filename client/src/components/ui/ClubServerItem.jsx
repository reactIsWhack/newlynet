import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';

const ClubServerItem = ({ serverName, chats }) => {
  const { unreadClubChats } = useSelector(selectUser);

  const chatIds = new Set(chats.map((chat) => chat._id));
  const unreadChats = unreadClubChats.filter((unreadChat) =>
    chatIds.has(unreadChat._id)
  );
  console.log(unreadChats);

  return (
    <div className="bg-base-100 text-white shadow-lg rounded-lg py-4 px-5 w-full mb-3">
      {/* Server Name */}
      <div className="flex items-center mb-2 justify-between">
        <div className="text-lg font-bold">{serverName}</div>
        <div className="relative">
          <button className="btn btn-primary min-h-10 h-10">Chat</button>
          {unreadChats.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 absolute flex items-center justify-center text-white text-xs -top-3 -right-3">
              {unreadChats.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubServerItem;
