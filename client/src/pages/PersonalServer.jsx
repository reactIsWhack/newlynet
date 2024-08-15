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
import useListenMessages from '../hooks/useListenMessages';
import useListenNotifications from '../hooks/useListenNotifications';
import { selectPopup } from '../app/features/popup/popupSlice';
import CreateChannel from '../components/CreateChannel';
import useListenNewChannel from '../hooks/useListenNewChannel';
import useDetectMobile from '../hooks/useDetectMobile';

const PersonalServer = () => {
  useRedirectUser();
  useListenMessages();
  useListenNotifications();
  useListenNewChannel();

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
  const {
    renderModal: { name, render },
  } = useSelector(selectPopup);
  const mobile = useDetectMobile();

  useEffect(() => {
    if (!customServer.serverId || !customServer.owner) {
      setIsLoading(true);
      const server = customClubServers.find((item) => item._id === serverId);

      if (customClubServers.length) {
        dispatch(
          setCustomServer({
            members: server.members,
            chats: server.chats,
            serverId: server._id,
            serverName: server.serverName,
            owner: server.owner,
          })
        );
        setIsLoading(false);
      }
    }

    if (chatId && serverId && customClubServers.length) {
      const server = customClubServers.find((item) => item._id === serverId);
      const chat = server.chats.find((item) => item._id === chatId);
      dispatch(setSelectedClubChat({ ...chat, isCustom: true }));
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
    if (chatId && serverId && !dateQuery) {
      dispatch(getClubChatMessages(chatId));
    }
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {(!mobile || (mobile && !chatId)) && (
            <ClubChatSidebar
              members={customServer.members}
              chats={customServer.chats}
              serverName={customServer.serverName}
              isLoading={isLoading}
              owner={customServer.owner}
            />
          )}
          <div className="flex-1 overflow-auto h-full">
            <Outlet />
          </div>
        </div>
      </div>
      {name === 'create-channel' && render && <CreateChannel />}
    </>
  );
};

export default PersonalServer;
