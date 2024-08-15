import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClubChat,
  setclubChatMessages,
} from '../app/features/clubChat/clubChatSlice';
import { selectUser } from '../app/features/user/userSlice';

const useListenClubServerMsg = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);
  const { selectedClubChat } = useSelector(selectClubChat);

  useEffect(() => {
    socket?.on('newClubServerMsg', (clubChat, msg) => {
      console.log(msg.author._id !== userId);
      if (msg.author._id !== userId) dispatch(setclubChatMessages(msg));
    });

    return () => socket?.off('newClubServerMSg');
  }, [selectedClubChat]);
};

export default useListenClubServerMsg;
