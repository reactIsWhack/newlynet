import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import useRedirectUser from '../hooks/useRedirectUser';
import { useSocket } from '../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import ClubChatSidebar from '../components/ClubChatSidebar';
import {
  getClubChatMessages,
  selectClubChat,
  setSelectedClubChat,
} from '../app/features/clubChat/clubChatSlice';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import useDetectMobile from '../hooks/useDetectMobile';

const ClubChat = () => {
  useRedirectUser();
  const { socket } = useSocket();
  const { members, serverId, selectedClubChat, chats } =
    useSelector(selectClubChat);
  const { sectionId } = useParams();
  const dispatch = useDispatch();
  const mobile = useDetectMobile();
  const { pathname } = useLocation();

  useEffect(() => {
    const chat = chats.find((chat) => chat._id === sectionId);
    dispatch(setSelectedClubChat(chat));
    if (chat) {
      socket?.emit(
        'joinroom',
        `clubserver-${serverId}-${chat._id}`,
        true,
        chat.chatTopic
      );
    }

    if (selectedClubChat) {
      return () => {
        socket?.emit(
          'leaveroom',
          `clubserver-${serverId}-${selectedClubChat._id}`,
          true,
          selectedClubChat.chatTopic
        );
      };
    }
  }, [sectionId, selectedClubChat, chats]);

  useEffect(() => {
    if (sectionId) {
      dispatch(getClubChatMessages(sectionId));
    }
  }, [sectionId]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {((mobile && !sectionId) || !mobile) && <ClubChatSidebar />}
        {((mobile && sectionId) || !mobile) && (
          <div className="flex-1 overflow-auto h-full">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubChat;
