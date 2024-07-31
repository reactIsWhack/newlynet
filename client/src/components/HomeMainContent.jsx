import React from 'react';
import Dropdown from './ui/Dropdown';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import UserTable from './UserTable';

const HomeMainContent = () => {
  const { isLoading } = useSelector(selectUser);

  return (
    <div className="home-main-content flex-1 py-4 px-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">New Students in your School</h3>
        <Dropdown />
      </div>
      {isLoading ? (
        <div className="flex justify-center mt-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <UserTable />
      )}
    </div>
  );
};

export default HomeMainContent;
