import React from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import { Link, NavLink } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import OnlineUserCard from './ui/OnlineUserCard';
import { selectUser } from '../app/features/user/userSlice';

const ClubChatSidebar = () => {
  const { topic } = useSelector(selectClubChat);
  const { usersInClubChat } = useSocket();
  const { userId } = useSelector(selectUser);

  let topicRoute = topic;
  if (topicRoute.includes('/')) {
    topicRoute = topicRoute.substring(0, topicRoute.indexOf('/'));
  }
  const onlineUser = usersInClubChat
    .filter((item) => item.user !== userId)
    .map((user) => {
      return (
        <OnlineUserCard
          key={user.user}
          {...user.userData}
          userData={user.userData}
        />
      );
    });
  console.log(onlineUser);

  return (
    <div className="sidebar border-r border-slate-500  flex flex-col w-1/4 max-[550px]:border-none max-[550px]:w-full relative">
      <div className="h-full">
        <ul className="menu bg-base-200 text-base-content min-h-full p-4">
          {/* Sidebar content here */}
          <li>
            <Link to="/clubchat" className="text-[15px]">
              # General
            </Link>
          </li>
          <li>
            <Link to={`/clubchat/${topicRoute}`} className="text-[15px]">
              # {topic}
            </Link>
          </li>
          <div className="divider m-0 mt-2 "></div>
          <div className="mt-4">
            <span className="ml-4 text-base">Online Users</span>
            {onlineUser}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default ClubChatSidebar;
