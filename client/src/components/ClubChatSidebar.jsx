import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { selectUser } from '../app/features/user/userSlice';
import OnlineUserCard from './ui/OnlineUserCard';
import { resetMessages } from '../app/features/chats/chatSlice';
import ServerLinkItem from './ui/ServerLinkItem';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';

const ClubChatSidebar = ({ chats, members, serverName, isLoading }) => {
  const { userId } = useSelector(selectUser);
  const location = useLocation();
  const { customServer } = useSelector(selectClubChat);

  const listItem = chats.map((chat) => {
    const isActive =
      location.pathname === `/clubchat/${chat._id}` ||
      location.pathname ===
        `/personalserver/${customServer.serverId}/${chat._id}`;

    return <ServerLinkItem chat={chat} isActive={isActive} key={chat._id} />;
  });

  const memberCard = members
    .filter((m) => m._id !== userId)
    .map((user) => {
      return <OnlineUserCard key={user.userId} {...user} userData={user} />;
    });

  return (
    <div className="sidebar border-r border-slate-500 flex flex-col w-1/4 max-[550px]:border-none max-[550px]:w-full relative bg-base-200">
      {isLoading ? (
        <div className="flex justify-center my-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <h2 className="pl-3 pt-3 font-semibold">{serverName}</h2>
          <ul className="text-base-content p-4 max-h-[360px] flex flex-col overflow-auto max-[550px]:max-h-[520px]">
            {/* Sidebar content here */}
            {listItem}
          </ul>
        </>
      )}
      <div className="divider m-0 mt-2"></div>
      <div className="mt-4 flex-1">
        <span className="ml-4 text-base">Members</span>
        <div className="h-40 overflow-auto">{memberCard}</div>
      </div>
    </div>
  );
};

export default ClubChatSidebar;
