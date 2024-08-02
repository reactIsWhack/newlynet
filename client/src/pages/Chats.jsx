import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectChats, setSelectedChat } from '../app/features/chats/chatSlice';
import { Outlet, useParams } from 'react-router-dom';

const Chats = () => {
  useRedirectUser();
  const dispatch = useDispatch();
  const { conversations } = useSelector(selectChats);
  const { id } = useParams();

  useEffect(() => {
    dispatch(
      setSelectedChat(
        conversations.find((conversation) => conversation._id === id)
      )
    );

    return () => dispatch(setSelectedChat(null));
  }, [id, conversations, dispatch]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Chats;
