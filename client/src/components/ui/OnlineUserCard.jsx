import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setRenderModal,
  setViewingUserData,
} from '../../app/features/popup/popupSlice';
import { useSocket } from '../../context/SocketContext';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import { TiUserAdd } from 'react-icons/ti';
import {
  promoteToAdmin,
  selectClubChat,
} from '../../app/features/clubChat/clubChatSlice';

const OnlineUserCard = ({
  profilePicture,
  firstName,
  lastName,
  userData,
  _id,
  advancedPermission,
}) => {
  const dispatch = useDispatch();
  const { onlineUsers } = useSocket();
  const { customServer } = useSelector(selectClubChat);
  const isOwner = customServer.owner?._id === _id;
  const isAdmin = customServer.admins?.some((admin) => admin?._id === _id);

  const openDetails = async () => {
    await dispatch(setViewingUserData(userData));
    await dispatch(setRenderModal({ render: true, name: 'user-detail' }));
    document.getElementById('my_modal_3').showModal();
  };

  const isOnline = checkOnlineStatus(onlineUsers, userData._id);
  const addAdminStatus = (e) => {
    e.target.disabled = true;
    e.target.style.opacity = 0.4;
    e.target.style.cursor = 'default';
    dispatch(promoteToAdmin(_id)).then((res) => {
      if (!res.meta.rejectedWithValue) {
        e.target.disabled = false;
        e.target.style.opacity = 1;
        e.target.style.cursor = 'pointer';
      }
    });
  };

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
      <div className="flex items-center">
        {!isOwner && !isAdmin && advancedPermission && (
          <button onClick={addAdminStatus}>
            <TiUserAdd size={20} cursor="pointer" />
          </button>
        )}
        <button
          className="btn btn-ghost btn-xs max-[550px]:pr-0"
          onClick={openDetails}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default OnlineUserCard;
