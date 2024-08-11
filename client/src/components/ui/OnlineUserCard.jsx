import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setRenderModal,
  setViewingUserData,
} from '../../app/features/popup/popupSlice';

const OnlineUserCard = ({
  profilePicture,
  firstName,
  lastName,
  userData,
  chatSection,
}) => {
  const dispatch = useDispatch();

  const openDetails = async () => {
    await dispatch(setViewingUserData(userData));
    await dispatch(setRenderModal({ render: true, name: 'user-detail' }));
    document.getElementById('my_modal_3').showModal();
  };

  return (
    <div className="flex gap-2 items-center rounded ml-2 my-3 p-2">
      <div className="avatar">
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
        <span className="text-xs"># {chatSection}</span>
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
