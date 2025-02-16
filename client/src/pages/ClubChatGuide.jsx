import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import useGetData from '../hooks/useGetData';

const ClubChatGuide = () => {
  useGetData();
  const { school } = useSelector(selectUser);

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full h-full">
      <h2 className="font-semibold text-xl">
        Welcome to the club server of {school && school.formattedName}!
      </h2>
      <div className="text-[18px]">
        Here, you can chat with any new student in your school about anything!
      </div>
    </div>
  );
};

export default ClubChatGuide;
