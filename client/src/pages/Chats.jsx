import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import Messages from '../components/Messages';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConversations,
  getMessages,
  selectChats,
  setSelectedChat,
} from '../app/features/chats/chatSlice';
import useDetectMobile from '../hooks/useDetectMobile';
import { Outlet, useParams } from 'react-router-dom';

const Chats = () => {
  useRedirectUser();
  const dispatch = useDispatch();
  const mobile = useDetectMobile();
  const { selectedConversation, conversations, createMsgLoading } =
    useSelector(selectChats);
  const { id } = useParams();

  useEffect(() => {
    dispatch(
      setSelectedChat(
        conversations.find((conversation) => conversation._id === id)
      )
    );

    return () => dispatch(setSelectedChat(null));
  }, [id, conversations]);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <ChatSidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Chats;
