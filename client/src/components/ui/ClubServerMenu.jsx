import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClubChat,
  setClubChatFilter,
} from '../../app/features/clubChat/clubChatSlice';
import { IoIosCreate } from 'react-icons/io';
import { setRenderModal } from '../../app/features/popup/popupSlice';

const ClubServerMenu = () => {
  const { customClubServers } = useSelector(selectClubChat);
  const dispatch = useDispatch();

  const handleClick = async () => {
    await dispatch(setRenderModal({ render: true, name: 'create-server' }));
    document.getElementById('my_modal_3').showModal();
  };

  const handleChange = (e) => {
    dispatch(setClubChatFilter(e.target.value));
  };

  return (
    <div className="flex items-center flex-1 justify-between">
      <h3>Club Server Info</h3>
      <div className="flex items-center gap-3">
        <select
          className="select select-info  max-w-xs min-h-10 h-10"
          onChange={handleChange}
        >
          <option value="suggested">Servers for you</option>
          <option value="invites">Invites</option>
          <option value="personal">My Servers</option>
        </select>
        <IoIosCreate size={20} cursor="pointer" onClick={handleClick} />
      </div>
    </div>
  );
};

export default ClubServerMenu;
