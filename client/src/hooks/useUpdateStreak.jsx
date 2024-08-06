import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChats,
  updateConversationStreak,
} from '../app/features/chats/chatSlice';
import { useSocket } from '../context/SocketContext';

const useUpdateStreak = () => {
  const { conversations, chatFilter } = useSelector(selectChats);
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on('updatedStreak', (chat, streak, streakMetaData) => {
      if (
        chatFilter === chat.chatType ||
        (!chatFilter && chat.chatType === 'individual')
      ) {
        dispatch(updateConversationStreak({ chat, metaData: streakMetaData }));
      }
    });

    return () => {
      socket?.off('updatedStreak');
    };
  }, [socket, chatFilter, conversations]);
};

export default useUpdateStreak;
