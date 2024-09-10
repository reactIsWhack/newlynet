import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  joinClubServer,
  resetClubChatMessages,
  selectClubChat,
  setSelectedClubChat,
} from '../../app/features/clubChat/clubChatSlice';
import { format, add } from 'date-fns';
import { useSocket } from '../../context/SocketContext';
import { selectUser } from '../../app/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { setSelectedChat } from '../../app/features/chats/chatSlice';
import calculateUnreadMsgCount from '../../utils/calculateUnreadMsgCount';

const ClubChatStats = () => {
  const {
    members,
    clubChatLoading,
    onlineServerUsers,
    chats,
    selectedClubChat,
  } = useSelector(selectClubChat);
  const { userId, unreadClubChats } = useSelector(selectUser);
  const { serverId } = useSelector(selectClubChat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInClubServer = members.some((member) => member._id === userId);

  const join = async () => {
    await dispatch(joinClubServer(serverId)).then((res) => {
      if (res.meta.requestStatus !== 'rejected') navigate(`/clubchat`);
    });
  };

  const resume = async () => {
    dispatch(resetClubChatMessages());

    if (selectedClubChat && !selectedClubChat.isCustom)
      navigate(`/clubchat/${selectedClubChat._id}`);
    else {
      const chat = chats.find((chat) => chat.chatTopic === 'General');
      navigate(`/clubchat/${chat._id}`);
    }
  };
  const unreadMsgCount = calculateUnreadMsgCount(
    unreadClubChats.filter((clubChat) =>
      chats.some((chat) => chat._id === clubChat.chat._id)
    )
  );

  return (
    <>
      <div className="stats shadow h-28 w-full overflow-hidden flex max-w-[430px] xl:max-w-[460px]">
        <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
          <div className="stat-title">Members</div>
          <div className="stat-value text-3xl">{members.length}</div>
          <div className="stat-desc"></div>
        </div>

        <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
          <div className="stat-title text-center w-full ">Connect</div>
          <div className="stat-value text-3xl text-center w-full">
            {clubChatLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : userInClubServer ? (
              <button className="btn btn-primary h-9 min-h-9" onClick={resume}>
                Resume
              </button>
            ) : (
              <button className="btn btn-primary h-9 min-h-9" onClick={join}>
                Join
              </button>
            )}
          </div>
        </div>

        <div className="stat max-w-32 px-5 flex-1 xl:max-w-40">
          <div className="stat-title text-right w-full ">Unread Msg</div>
          <div className="stat-value text-3xl text-right w-full">
            {unreadMsgCount}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubChatStats;
