import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { useSocket } from '../../context/SocketContext';
import checkOnlineStatus from '../../utils/checkOnlineStatus';

const Conversation = ({ lastIdx, _id }) => {
  const { profilePicture } = useSelector(selectUser);
  const { conversations } = useSocket();

  const isOnline = checkOnlineStatus(conversations, _id);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer`}
      >
        <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
          <div className="w-12 rounded-full">
            <img src={profilePicture} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">John Doe</p>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
