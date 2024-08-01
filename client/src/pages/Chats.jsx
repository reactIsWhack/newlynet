import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import Messages from '../components/Messages';

const Chats = () => {
  useRedirectUser();

  useEffect(() => {
    // remove the scroll effect created by the body by default
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
