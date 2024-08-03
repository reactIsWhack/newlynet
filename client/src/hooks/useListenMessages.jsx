import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch } from 'react-redux';
import { setMessages } from '../app/features/chats/chatSlice';
import { setUnreadChats } from '../app/features/user/userSlice';

const useListenMessages = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      newMessage.shouldShake = true;
      dispatch(setMessages(newMessage));
    });

    return () => socket?.off('newMessage');
  }, [socket]);
};

export default useListenMessages;
