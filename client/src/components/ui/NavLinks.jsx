import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { PiChatsFill } from 'react-icons/pi';
import { FaUserFriends } from 'react-icons/fa';
import NotificationCount from './NotificationCount';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import useDetectMobile from '../../hooks/useDetectMobile';
import { BsWechat } from 'react-icons/bs';

const NavLinks = () => {
  const setActiveClassName = ({ isActive }) =>
    `${isActive ? 'nav-link-active' : 'nav-link-inactive'}`;
  const { unreadChats, unreadClubChats } = useSelector(selectUser);
  const mobile = useDetectMobile();

  return (
    <div className="flex-1 justify-center">
      <ul className="flex items-center nav-links">
        <li className="relative">
          <NavLink to={`/`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <AiFillHome
              size={35}
              className="stroke-[50px] stroke-gray home-icon"
            />
          </NavLink>
        </li>
        <li className="relative">
          <NavLink to={`/chats`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <PiChatsFill size={35} className="stroke-gray" />
          </NavLink>
          {unreadChats?.length > 0 && (
            <NotificationCount array={unreadChats} includeInvites={false} />
          )}
        </li>
        <li>
          <NavLink to={`/contacts`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <FaUserFriends size={35} className="stroke-gray" />
          </NavLink>
        </li>
        <li className="relative">
          <NavLink to={`/clubserverinfo`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <BsWechat size={35} className="stroke-gray" />
          </NavLink>
          {unreadClubChats.length > 0 && (
            <NotificationCount array={unreadClubChats} includeInvites={true} />
          )}{' '}
        </li>
      </ul>
    </div>
  );
};

export default NavLinks;
