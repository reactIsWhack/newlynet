import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import Messages from '../components/Messages';
import { useDispatch } from 'react-redux';
import { getConversations } from '../app/features/chats/chatSlice';

const Chats = () => {
  useRedirectUser();
  const dispatch = useDispatch();

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
        <Messages />
      </div>
    </div>
  );
};

export default Chats;
