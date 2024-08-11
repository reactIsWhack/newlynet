import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { setOnlineServerUsers } from '../app/features/clubChat/clubChatSlice';

const useUpdateClubServer = () => {
  const { socket } = useSocket();
  const { school } = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(school);
    socket?.on('onlineClubUsers', (users, userData) => {
      const onlineUsers = users.filter(
        (user) => user.userData.school.schoolId === school?.schoolId
      );
      dispatch(setOnlineServerUsers(onlineUsers));
    });

    return () => {
      socket?.off('onlineClubUsers');
    };
  }, [socket, school]);
};

export default useUpdateClubServer;
