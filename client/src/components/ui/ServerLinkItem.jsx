import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  selectClubChat,
  setSelectedClubChat,
} from '../../app/features/clubChat/clubChatSlice';
import { resetMessages } from '../../app/features/chats/chatSlice';
import { selectUser } from '../../app/features/user/userSlice';

const ServerLinkItem = ({ chat, isActive }) => {
  const { sectionId } = useParams();
  const { selectedClubChat } = useSelector(selectClubChat);
  const { unreadClubChats } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [chatUnreadCount, setChatUnreadCount] = useState(null);

  const isUnreadChat = unreadClubChats.find(
    (clubChat) => clubChat.chat._id === chat._id
  );

  const handleClick = async () => {
    if (sectionId !== selectedClubChat?._id) {
      await dispatch(resetMessages());
    }
    await dispatch(setSelectedClubChat(chat));
  };

  useEffect(() => {
    console.log(isUnreadChat);
    if (isUnreadChat) setChatUnreadCount(isUnreadChat.messages.length);
  }, []);

  return (
    <li
      className={`${
        isActive ? 'bg-slate-600' : ''
      } hover:bg-slate-600 rounded-md transition-colors duration-200 flex items-center justify-between cursor-pointer`}
      onClick={handleClick}
    >
      <Link
        to={`/clubchat/${chat._id}`}
        className={`text-[15px] block p-2 flex-1 ${
          isUnreadChat ? 'text-slate-200' : ''
        }`}
      >
        # {chat.chatTopic}
      </Link>
      {isUnreadChat && (
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs mr-3">
          {chatUnreadCount}
        </div>
      )}
    </li>
  );
};

export default ServerLinkItem;
