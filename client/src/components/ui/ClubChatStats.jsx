import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  joinClubServer,
  selectClubChat,
} from '../../app/features/clubChat/clubChatSlice';
import { format, add } from 'date-fns';
import { useSocket } from '../../context/SocketContext';
import { selectUser } from '../../app/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { setSelectedChat } from '../../app/features/chats/chatSlice';

const ClubChatStats = () => {
  const {
    members,
    clubChatLoading,
    onlineServerUsers,
    chats,
    selectedClubChat,
  } = useSelector(selectClubChat);
  const { userId } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInClubServer = members.some((member) => member._id === userId);

  const join = async () => {
    await dispatch(joinClubServer()).then(() => {
      navigate(`/clubchat`);
    });
  };

  const resume = async () => {
    if (selectedClubChat) navigate(`/clubchat/${selectedClubChat._id}`);
    else {
      const chat = chats.find((chat) => chat.chatTopic === 'General');
      navigate(`/clubchat/${chat._id}`);
    }
  };

  return (
    <>
      <div className="stats shadow h-28 w-full overflow-hidden flex">
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

        <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
          <div className="stat-title text-right w-full ">Online Users</div>
          <div className="stat-value text-3xl text-right w-full">
            {onlineServerUsers.length}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubChatStats;
