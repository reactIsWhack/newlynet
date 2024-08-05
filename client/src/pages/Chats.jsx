import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';
import useRedirectUser from '../hooks/useRedirectUser';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessages,
  selectChats,
  setSelectedChat,
} from '../app/features/chats/chatSlice';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useDetectMobile from '../hooks/useDetectMobile';
import Modal from '../components/ui/Modal';
import CreateChatForm from '../components/CreateChatForm';
import { useSocket } from '../context/SocketContext';
import { selectUser, setUnreadChats } from '../app/features/user/userSlice';
import toast from 'react-hot-toast';
import useListenNotifications from '../hooks/useListenNotifications';
import { selectPopup } from '../app/features/popup/popupSlice';

const Chats = ({ filter }) => {
  useRedirectUser();
  useListenNotifications();

  const dispatch = useDispatch();
  const { conversations, selectedConversation, messages, chatFilter } =
    useSelector(selectChats);
  const { id } = useParams();
  const mobile = useDetectMobile();
  const { socket } = useSocket();
  const { renderModal } = useSelector(selectPopup);
  const navigate = useNavigate();
  const renderCount = useRef(0);

  useEffect(() => {
    return () => dispatch(setSelectedChat(null));
  }, [id, conversations, dispatch]);

  useEffect(() => {
    const conversation = conversations.find(
      (conversation) => conversation._id === id
    );
    if (!conversation && renderCount.current >= 3) navigate('/chats');

    dispatch(setSelectedChat(conversation));

    if (id) socket?.emit('joinroom', `chat-${id}`);

    renderCount.current++;

    return () => {
      if (selectedConversation) {
        socket?.emit('leaveroom', `chat-${selectedConversation._id}`);
      }
    };
  }, [selectedConversation, id, conversations]);

  useEffect(() => {
    if (id) {
      dispatch(getMessages(id));
    }
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden sidebar-container">
        {((mobile && !id) || !mobile) && <ChatSidebar />}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      {renderModal && <CreateChatForm filter={filter} />}{' '}
      {/* a modal that is toggled in the chat sidebar */}
    </div>
  );
};

export default Chats;
