import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import UserTableCard from './ui/UserTableCard';

const UserTable = () => {
  const { commonNewStudents } = useSelector(selectUser);

  const userTableCard = commonNewStudents.slice(0, 20).map((student) => {
    return <UserTableCard key={student._id} {...student} />;
  });

  return (
    <div>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>One Interest</th>
            <th>Connect</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{userTableCard}</tbody>
      </table>
    </div>
  );
};

export default UserTable;
