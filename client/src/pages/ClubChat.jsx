import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import useRedirectUser from '../hooks/useRedirectUser';
import { useSocket } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import ClubChatSidebar from '../components/ClubChatSidebar';
import ClubChatHeader from '../components/ClubChatHeader';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

const ClubChat = () => {
  useRedirectUser();
  const { socket } = useSocket();
  const { school, userId } = useSelector(selectUser);
  const { members } = useSelector(selectClubChat);
  const navigate = useNavigate();
  const firstRender = useRef(true);

  const isInClubChat = members.some((member) => member._id === userId);

  useEffect(() => {
    if (!isInClubChat) {
      navigate('/');
      toast.error('Please join the club chat to access it');
    }

    if (isInClubChat && firstRender.current)
      socket?.emit('joinroom', `clubchat-${school.schoolId}`, true);

    firstRender.current = false;
    return () => {
      if (isInClubChat)
        socket?.emit('leaveroom', `clubchat-${school.schoolId}`, true);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1">
        <ClubChatSidebar />
        <Outlet />
        <div>
          <ClubChatHeader />
        </div>
      </div>
    </div>
  );
};

export default ClubChat;
