import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { IoPersonAdd } from 'react-icons/io5';
import ClubMsgCount from './ClubMsgCount';
import { useNavigate } from 'react-router-dom';
import {
  setCustomServer,
  setSelectedClubChat,
} from '../../app/features/clubChat/clubChatSlice';
import {
  setRenderModal,
  setViewingUserData,
} from '../../app/features/popup/popupSlice';

const ClubServerItem = ({ serverName, chats, members, _id, server }) => {
  const { unreadClubChats } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chatIds = new Set(chats.map((chat) => chat._id));
  const unreadChats = unreadClubChats.filter((unreadChat) =>
    chatIds.has(unreadChat.chat._id)
  );

  const handleClick = async () => {
    await dispatch(setSelectedClubChat(chats[0]));
    await dispatch(
      setCustomServer({ chats, serverName, members, serverId: _id })
    );
    navigate(`/personalserver/${_id}/${chats[0]._id}`);
  };

  const toggleInviteForm = async () => {
    await dispatch(setViewingUserData(server));
    await dispatch(setRenderModal({ render: true, name: 'invite-form' }));
    document.getElementById('my_modal_3')?.showModal();
  };

  return (
    <div className="bg-base-100 text-white shadow-lg rounded-lg py-4 px-5 w-full mb-3">
      {/* Server Name */}
      <div className="flex items-center mb-2 justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{serverName}</span>
          <span className="text-sm">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <IoPersonAdd
            size={20}
            cursor="pointer"
            className="fill-slate-300"
            onClick={toggleInviteForm}
          />
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
