import { useEffect, useState } from 'react';
import Dropdown from './ui/Dropdown';
import UserTable from './UserTable';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import {
  setRenderModal,
  setViewingUserData,
} from '../app/features/popup/popupSlice';
import { selectChats } from '../app/features/chats/chatSlice';

const HomeMainContent = ({ filter, setFilter }) => {
  const { commonNewStudents, interests } = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleClick = async () => {
    const usersWithCommonInterests =
      filter === 'grade'
        ? commonNewStudents.filter((student) => {
            for (const interest of student.interests) {
              if (interests.includes(interest)) return student;
            }
          })
        : commonNewStudents;
    let user;

    if (usersWithCommonInterests.length) {
      const index = Math.floor(Math.random() * usersWithCommonInterests.length);
      user = usersWithCommonInterests[index];
    } else {
      const index = Math.floor(Math.random() * commonNewStudents.length);
      user = commonNewStudents[index];
    }
    await dispatch(setViewingUserData(user));
    await dispatch(setRenderModal({ render: true, name: 'user-detail' }));
    document.getElementById('my_modal_3').showModal();
  };

  return (
    <div className="home-main-content flex-1 py-4 px-1 max-[550px]:px-0">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">New Students in your School</h3>
        <div className="flex items-center gap-3">
          <button
            className="btn btn-accent min-h-10 h-10"
            onClick={handleClick}
          >
            Pick for me
          </button>

          <Dropdown filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <UserTable filter={filter} />
    </div>
  );
};

export default HomeMainContent;
