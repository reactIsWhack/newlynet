import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import Messages from '../components/Messages';
import { useDispatch } from 'react-redux';
import { getConversations } from '../app/features/chats/chatSlice';
import useDetectMobile from '../hooks/useDetectMobile';

const Chats = () => {
  useRedirectUser();
  const dispatch = useDispatch();
  const mobile = useDetectMobile();

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
        {!mobile && <Messages />}
      </div>
    </div>
  );
};

export default Chats;
