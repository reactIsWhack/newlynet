import React from 'react';
import InterestDisplayBtn from './InterestDisplayBtn';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { IoPersonAdd } from 'react-icons/io5';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import { useSocket } from '../../context/SocketContext';
import useDetectMobile from '../../hooks/useDetectMobile';

const UserTableCard = ({
  profilePicture,
  fullName,
  school,
  grade,
  interests,
  _id,
}) => {
  const user = useSelector(selectUser);
  const similarInterest = interests.find((interest) =>
    user.interests.includes(interest)
  );
  const { onlineUsers } = useSocket();

  let interest = similarInterest ? similarInterest : interests[0];
  if (interest.length > 16) {
    interest = interest.substring(0, 16) + '...';
  }

  const isOnline = checkOnlineStatus(onlineUsers, _id);
  const mobile = useDetectMobile();

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
            <div className="mask mask-squircle h-12 w-12">
              <img src={profilePicture} alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
          <div>
            <div className="font-bold">{fullName}</div>
            <span className="badge badge-ghost badge-sm">Grade {grade}</span>
          </div>
        </div>
      </td>
      {!mobile && (
        <td className="w-2/5">
          <InterestDisplayBtn interest={interest} />
        </td>
      )}
      <td>
        <div className="flex items-center gap-3">
          <button className="btn btn-sm btn-outline">Chat</button>
          <IoPersonAdd size={20} cursor="pointer" />
        </div>
      </td>
      <th>
        <button className="btn btn-ghost btn-xs max-[550px]:pr-0">
          Details
        </button>
      </th>
    </tr>
  );
};

export default UserTableCard;
