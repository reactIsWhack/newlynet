import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import { useSocket } from '../context/SocketContext';

const useLeaveClubServer = () => {
  const { pathname } = useLocation();
  const { selectedClubChat, serverId } = useSelector(selectClubChat);
  const { socket } = useSocket();
  const { sectionId } = useParams();

  useEffect(() => {
    if (!pathname.includes('/clubchat'))
      if (selectedClubChat) {
        socket?.emit(
          'leaveroom',
          `clubserver-${serverId}-${selectedClubChat._id}`,
          true,
          selectedClubChat.chatTopic
        );
      }

    if (selectedClubChat) {
      return () => {
        socket?.emit(
          'leaveroom',
          `clubserver-${serverId}-${selectedClubChat._id}`,
          true,
          selectedClubChat.chatTopic
        );
      };
    }
  }, [pathname, selectedClubChat, sectionId]);
};

export default useLeaveClubServer;
