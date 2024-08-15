import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetClubChatMessages,
  selectClubChat,
} from '../app/features/clubChat/clubChatSlice';
import { IoIosArrowBack } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const ClubChatHeader = () => {
  const { selectedClubChat, customServer } = useSelector(selectClubChat);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(resetClubChatMessages());
    if (customServer.serverId) {
      return navigate(`/personalserver/${customServer.serverId}`);
    }
    navigate('/clubchat');
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-3 shadow-md flex justify-center items-center h-14">
      <IoIosArrowBack
        className="mr-auto"
        size={20}
        cursor="pointer"
        fill="#cbd5e1"
        onClick={handleClick}
      />
      <h2 className="text-lg font-semibold mr-auto">
        #{' '}
        <span className="hover:underline cursor-pointer">
          {selectedClubChat.chatTopic}
        </span>
      </h2>
      <div className="hover:bg-slate-700 transition-colors duration-500 h-9 w-9 rounded-full flex items-center justify-center cursor-pointer">
        <CiSearch size={20} fill="#cbd5e1" cursor="pointer" />
      </div>
    </div>
  );
};

export default ClubChatHeader;
