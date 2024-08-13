import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { IoPersonAdd } from 'react-icons/io5';
import ClubMsgCount from './ClubMsgCount';

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
        <div className="flex items-center gap-3">
          <IoPersonAdd size={20} cursor="pointer" className="fill-slate-300" />
          <div className="relative">
            <button className="btn btn-primary min-h-10 h-10">Chat</button>
            {unreadChats.length > 0 && (
              <ClubMsgCount unreadChats={unreadChats} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubServerItem;
