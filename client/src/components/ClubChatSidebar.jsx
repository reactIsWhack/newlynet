import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  selectClubChat,
  setSelectedClubChat,
} from '../app/features/clubChat/clubChatSlice';
import { selectUser } from '../app/features/user/userSlice';

const ClubChatSidebar = () => {
  const { chats } = useSelector(selectClubChat);
  const { school } = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();

  const listItem = chats.map((chat) => {
    const isActive = location.pathname === `/clubchat/${chat._id}`;

    return (
      <li
        key={chat._id}
        className={`${
          isActive ? 'bg-slate-600' : ''
        } hover:bg-slate-600 rounded-md transition-colors duration-200`}
        onClick={() => dispatch(setSelectedClubChat(chat))}
      >
        <Link to={`/clubchat/${chat._id}`} className="text-[15px] block p-2">
          # {chat.chatTopic}
        </Link>
      </li>
    );
  });

  return (
    <div className="sidebar border-r border-slate-500 flex flex-col w-1/4 max-[550px]:border-none max-[550px]:w-full relative bg-base-200">
      <h2 className="pl-3 pt-3 font-semibold">
        {school?.formattedName} Server
      </h2>
      <ul className="text-base-content p-4 max-h-[400px] flex flex-col overflow-auto">
        {/* Sidebar content here */}
        {listItem}
      </ul>
      <div className="divider m-0 mt-2"></div>
      <div className="mt-4 flex-1">
        <span className="ml-4 text-base">Online Users Here</span>
      </div>
    </div>
  );
};

export default ClubChatSidebar;
