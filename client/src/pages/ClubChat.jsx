import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import useRedirectUser from '../hooks/useRedirectUser';
import { useSocket } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';

const ClubChat = () => {
  useRedirectUser();
  const { socket } = useSocket();
  const { school } = useSelector(selectUser);

  useEffect(() => {
    socket?.emit('joinroom', `clubchat-${school.schoolId}`, true);

    return () => {
      socket?.emit('leaveroom', `clubchat-${school.schoolId}`, true);
    };
  }, []);

  return (
    <>
      <Navbar />
      <h1>ClubChat</h1>
    </>
  );
};

export default ClubChat;
