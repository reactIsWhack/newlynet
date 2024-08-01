import { useEffect, useState } from 'react';
import Dropdown from './ui/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonNewStudents,
  resetStudents,
  selectUser,
} from '../app/features/user/userSlice';
import UserTable from './UserTable';

const HomeMainContent = () => {
  const { isLoading, cursor, commonNewStudents } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('grade');

  return (
    <div className="home-main-content flex-1 py-4 px-1 max-[550px]:px-0">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">New Students in your School</h3>
        <Dropdown filter={filter} setFilter={setFilter} />
      </div>
      <UserTable filter={filter} />
    </div>
  );
};

export default HomeMainContent;
