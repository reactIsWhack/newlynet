import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { IoPersonAdd } from 'react-icons/io5';
import ClubMsgCount from './ClubMsgCount';
import { useNavigate } from 'react-router-dom';
import { setCustomServer } from '../../app/features/clubChat/clubChatSlice';

const ClubServerItem = ({ serverName, chats, members, _id }) => {
  const { unreadClubChats } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chatIds = new Set(chats.map((chat) => chat._id));
  const unreadChats = unreadClubChats.filter((unreadChat) =>
    chatIds.has(unreadChat._id)
  );

  const handleClick = async () => {
    await dispatch(
      setCustomServer({ chats, serverName, members, serverId: _id })
    );
    navigate(`/personalserver/${_id}`);
  };

  return (
    <div className="bg-base-100 text-white shadow-lg rounded-lg py-4 px-5 w-full mb-3">
      {/* Server Name */}
      <div className="flex items-center mb-2 justify-between">
        <div className="text-lg font-bold">{serverName}</div>
        <div className="flex items-center gap-3">
          <IoPersonAdd size={20} cursor="pointer" className="fill-slate-300" />
          <div className="relative">
            <button
              className="btn btn-primary min-h-10 h-10"
              onClick={handleClick}
            >
              Chat
            </button>
            {unreadChats.length > 0 && (
              <ClubMsgCount unreadChats={unreadChats} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubServerItem;
