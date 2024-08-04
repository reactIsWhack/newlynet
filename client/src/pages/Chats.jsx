import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectChats, setSelectedChat } from '../app/features/chats/chatSlice';
import { Outlet, useParams } from 'react-router-dom';
import useDetectMobile from '../hooks/useDetectMobile';
import Modal from '../components/ui/Modal';
import CreateChatForm from '../components/CreateChatForm';
import { useSocket } from '../context/SocketContext';
import { selectUser, setUnreadChats } from '../app/features/user/userSlice';
import toast from 'react-hot-toast';
import useListenNotifications from '../hooks/useListenNotifications';

const Chats = () => {
  useRedirectUser();
  useListenNotifications();

  const dispatch = useDispatch();
  const { conversations, selectedConversation, messages } =
    useSelector(selectChats);
  const { unreadChats, userId } = useSelector(selectUser);
  const { id } = useParams();
  const mobile = useDetectMobile();
  const { socket } = useSocket();
  const [renderModal, setRenderModal] = useState(false);

  useEffect(() => {
    return () => dispatch(setSelectedChat(null));
  }, [id, conversations, dispatch]);

  useEffect(() => {
    dispatch(
      setSelectedChat(
        conversations.find((conversation) => conversation._id === id)
      )
    );

    if (id) socket?.emit('joinroom', `chat-${id}`);

    return () => {
      if (selectedConversation)
        socket?.emit('leaveroom', `chat-${selectedConversation._id}`);
    };
  }, [selectedConversation, id]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden sidebar-container">
        {((mobile && !id) || !mobile) && (
          <ChatSidebar setRenderModal={setRenderModal} />
        )}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      {renderModal && <CreateChatForm setRenderModal={setRenderModal} />}{' '}
      {/* a modal that is toggled in the chat sidebar */}
    </div>
  );
};

export default Chats;
