import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setRenderModal,
  setViewingUserData,
} from '../../app/features/popup/popupSlice';
import { useSocket } from '../../context/SocketContext';
import checkOnlineStatus from '../../utils/checkOnlineStatus';

const OnlineUserCard = ({ profilePicture, firstName, lastName, userData }) => {
  const dispatch = useDispatch();
  const { onlineUsers } = useSocket();

  const openDetails = async () => {
    await dispatch(setViewingUserData(userData));
    await dispatch(setRenderModal({ render: true, name: 'user-detail' }));
    document.getElementById('my_modal_3').showModal();
  };

  const isOnline = checkOnlineStatus(onlineUsers, userData._id);

  return (
    <div className="flex gap-2 items-center rounded ml-2 my-3 p-2">
      <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
        <div className="w-10 rounded-full">
          <img src={profilePicture} alt="user avatar" className="h-16" />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex gap-3 justify-between">
          <p className="font-bold text-gray-200 capitalize">
            {firstName + ' ' + lastName}
          </p>
        </div>
      </div>
      <button
        className="btn btn-ghost btn-xs max-[550px]:pr-0"
        onClick={openDetails}
      >
        Details
      </button>
    </div>
  );
};

export default OnlineUserCard;
