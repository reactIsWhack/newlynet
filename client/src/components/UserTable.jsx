import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonNewStudents,
  selectUser,
  setCursor,
} from '../app/features/user/userSlice';
import UserTableCard from './ui/UserTableCard';
import { useSocket } from '../context/SocketContext';
import useDetectMobile from '../hooks/useDetectMobile';

const UserTable = ({ filter }) => {
  const { commonNewStudents, isLoading } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [requestPending, setRequestPending] = useState(false);
  const largeScreen =
    window.screen.width > 1500 ||
    (window.screen.width > 700 && window.screen.width < 850);

  const userTableCard = commonNewStudents.map((student) => {
    return (
      <UserTableCard
        key={student._id}
        {...student}
        student={student}
        filter={filter}
      />
    );
  });
  const mobile = useDetectMobile();

  const handleScroll = async () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom) {
      window.removeEventListener('scroll', handleScroll);
      await setRequestPending(true);
      const cursor = commonNewStudents[commonNewStudents.length - 1]._id;
      if (!cursor) return;
      await dispatch(
        getCommonNewStudents({
          filter,
          cursor,
        })
      );
      setRequestPending(false);
    }
  };
  useEffect(() => {
    if (requestPending) {
      return window.removeEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [commonNewStudents]);

  return (
    <div>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            {!mobile && (
              <th>{largeScreen ? 'Two Interests' : 'One Interest'}</th>
            )}
            <th>Connect</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{userTableCard}</tbody>
      </table>
      {isLoading && (
        <div className="flex justify-center mt-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
};

export default UserTable;
