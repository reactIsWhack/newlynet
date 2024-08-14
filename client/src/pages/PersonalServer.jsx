import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import {
  getClubChatMessages,
  resetClubChatMessages,
  resetCustomServer,
  selectClubChat,
  setCustomServer,
  setSelectedClubChat,
} from '../app/features/clubChat/clubChatSlice';
import ClubChatSidebar from '../components/ClubChatSidebar';
import { Outlet, useParams } from 'react-router-dom';
import useRedirectUser from '../hooks/useRedirectUser';
import { useSocket } from '../context/SocketContext';
import { resetDateQuery } from '../app/features/chats/chatSlice';

const PersonalServer = () => {
  useRedirectUser();
  const {
    customServer,
    customClubServers,
    dateQuery,
    selectedClubChat,
    messages,
  } = useSelector(selectClubChat);
  const { serverId, chatId } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (!customServer.serverId) {
      setIsLoading(true);
      const server = customClubServers.find((item) => item._id === serverId);

      if (customClubServers.length) {
        dispatch(
          setCustomServer({
            members: server.members,
            chats: server.chats,
            serverId: server._id,
            serverName: server.serverName,
          })
        );
        setIsLoading(false);
      }
    }
  }, [customClubServers]);

  useEffect(() => {
    if (chatId)
      socket?.emit(
        'joinroom',
        `clubserver-${serverId}-${chatId}`,
        true,
        selectedClubChat?.chatTopic
      );

    if (selectedClubChat)
      return () => {
        socket?.emit(
          'leaveroom',
          `clubserver-${serverId}-${selectedClubChat._id}`,
          true,
          selectedClubChat.chatTopic
        );
      };
  }, [chatId, serverId]);

  useEffect(() => {
    const server = customClubServers.find((item) => item._id === serverId);
    const chat = server.chats.find((item) => item._id === chatId);
    dispatch(setSelectedClubChat(chat));

    if (chatId && serverId && !dateQuery) {
      dispatch(getClubChatMessages(chatId));
    }

    return () => {
      dispatch(setSelectedClubChat(null));
      if (messages.length) {
        dispatch(resetClubChatMessages());
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ClubChatSidebar
          members={customServer.members}
          chats={customServer.chats}
          serverName={customServer.serverName}
          isLoading={isLoading}
        />
        <div className="flex-1 overflow-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PersonalServer;
