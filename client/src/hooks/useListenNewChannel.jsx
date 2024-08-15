import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch } from 'react-redux';
import { setServerChannels } from '../app/features/clubChat/clubChatSlice';

const useListenNewChannel = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on('newChannel', (server, newChannel) => {
      dispatch(setServerChannels(server));
    });

    return () => {
      socket?.off('newChannel');
    };
  }, []);
};

export default useListenNewChannel;
