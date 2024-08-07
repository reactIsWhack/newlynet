import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { PiChatsFill } from 'react-icons/pi';
import { FaUserFriends } from 'react-icons/fa';
import NotificationCount from './NotificationCount';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import useDetectMobile from '../../hooks/useDetectMobile';

const NavLinks = () => {
  const setActiveClassName = ({ isActive }) =>
    `${isActive ? 'nav-link-active' : 'nav-link-inactive'}`;
  const { unreadChats } = useSelector(selectUser);
  const mobile = useDetectMobile();

  return (
    <div className="flex-1 justify-center">
      <ul className="flex items-center nav-links">
        <li className="relative">
          <NavLink to={`/`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <AiFillHome
              size={mobile ? 31 : 35}
              className="stroke-[50px] stroke-gray home-icon"
            />
          </NavLink>
        </li>
        <li className="relative">
          <NavLink to={`/chats`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <PiChatsFill size={mobile ? 31 : 35} className="stroke-gray" />
          </NavLink>
          {unreadChats?.length > 0 && <NotificationCount />}
        </li>
        <li>
          <NavLink to={`/contacts`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <FaUserFriends size={mobile ? 31 : 35} className="stroke-gray" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavLinks;
