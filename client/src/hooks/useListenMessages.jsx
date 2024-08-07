import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChats,
  setMessages,
  setSelectedChat,
} from '../app/features/chats/chatSlice';
import { setUnreadChats } from '../app/features/user/userSlice';

const useListenMessages = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(selectChats);

  useEffect(() => {
    socket?.on('newMessage', (newMessage, chat) => {
      newMessage.shouldShake = true;
      if (selectedConversation?._id === chat._id)
        dispatch(setMessages(newMessage));
    });

    return () => socket?.off('newMessage');
  }, [socket, selectedConversation]);
};

export default useListenMessages;
