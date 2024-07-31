import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { PiChatsFill } from 'react-icons/pi';

const NavLinks = () => {
  const setActiveClassName = ({ isActive }) =>
    `${isActive ? 'nav-link-active' : 'nav-link-inactive'}`;

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
        <li>
          <NavLink to={`/chats`} className={setActiveClassName}>
            <div className="profile-link-border"></div>
            <PiChatsFill size={35} className="stroke-gray" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavLinks;
