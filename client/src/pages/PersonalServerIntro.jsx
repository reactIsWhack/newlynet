import React from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import useGetData from '../hooks/useGetData';

const PersonalServerIntro = () => {
  const { customServer } = useSelector(selectClubChat);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="font-medium text-xl">
        Welcome to the {customServer.serverName} Server!
      </h3>
    </div>
  );
};

export default PersonalServerIntro;
