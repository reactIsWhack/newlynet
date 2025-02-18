import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import {
  getClubChatMessages,
  getCustomServer,
  selectClubChat,
  setSelectedClubChat,
} from '../app/features/clubChat/clubChatSlice';
import ClubChatSidebar from '../components/ClubChatSidebar';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useRedirectUser from '../hooks/useRedirectUser';
import { useSocket } from '../context/SocketContext';
import { resetDateQuery } from '../app/features/chats/chatSlice';
import useListenMessages from '../hooks/useListenMessages';
import useListenNotifications from '../hooks/useListenNotifications';
import { selectPopup } from '../app/features/popup/popupSlice';
import CreateChannel from '../components/CreateChannel';
import useListenNewChannel from '../hooks/useListenNewChannel';
import useDetectMobile from '../hooks/useDetectMobile';
import { selectUser } from '../app/features/user/userSlice';
import toast from 'react-hot-toast';
import useGetData from '../hooks/useGetData';

const PersonalServer = () => {
  useRedirectUser();
  useListenMessages();
  useListenNotifications();
  useListenNewChannel();

  const { customServer, customClubServers, dateQuery, selectedClubChat } =
    useSelector(selectClubChat);
  const { serverId, chatId } = useParams();
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const {
    renderModal: { name, render },
  } = useSelector(selectPopup);
  const mobile = useDetectMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (chatId && serverId && customClubServers.length) {
      const server = customClubServers.find((item) => item._id === serverId);
      if (server) {
        const chat = server.chats.find((item) => item._id === chatId);
        dispatch(setSelectedClubChat({ ...chat, isCustom: true }));
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
    dispatch(getCustomServer(serverId));

    if (chatId && serverId && !dateQuery) {
      dispatch(getClubChatMessages(chatId));
    }
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {(!mobile || (mobile && !chatId)) && customServer.serverId && (
            <ClubChatSidebar
              members={customServer.members}
              chats={customServer.chats}
              serverName={customServer.serverName}
              owner={customServer.owner}
              admins={customServer.admins}
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
