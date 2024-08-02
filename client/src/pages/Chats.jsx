import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectChats, setSelectedChat } from '../app/features/chats/chatSlice';
import { Outlet, useParams } from 'react-router-dom';
import useDetectMobile from '../hooks/useDetectMobile';
import Modal from '../components/ui/Modal';
import CreateChatForm from '../components/CreateChatForm';

const Chats = () => {
  useRedirectUser();
  const dispatch = useDispatch();
  const { conversations } = useSelector(selectChats);
  const { id } = useParams();
  const mobile = useDetectMobile();

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
      <div className="flex flex-1 overflow-hidden sidebar-container">
        {((mobile && !id) || !mobile) && <ChatSidebar />}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      <CreateChatForm /> {/* a modal that is toggled in the chat sidebar */}
    </div>
  );
};

export default Chats;
