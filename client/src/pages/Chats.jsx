import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import Messages from '../components/Messages';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, selectChats } from '../app/features/chats/chatSlice';
import useDetectMobile from '../hooks/useDetectMobile';
import { Outlet } from 'react-router-dom';

const Chats = () => {
  useRedirectUser();
  const dispatch = useDispatch();
  const mobile = useDetectMobile();
  const { selectedChat } = useSelector(selectChats);

  useEffect(() => {
    // remove the scroll effect created by the body by default
    dispatch(getConversations('individual'));
    document.body.style.overflow = 'hidden';

    return () => (document.body.style.overflow = 'visible');
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <ChatSidebar />
        <Outlet />
        {!mobile && selectedChat && <Messages />}
      </div>
    </div>
  );
};

export default Chats;
