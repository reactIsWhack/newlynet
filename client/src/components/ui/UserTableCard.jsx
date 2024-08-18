import React, { useEffect } from 'react';
import InterestDisplayBtn from './InterestDisplayBtn';
import { useDispatch, useSelector } from 'react-redux';
import {
  addContact,
  getCommonNewStudents,
  resetStudents,
  selectUser,
} from '../../app/features/user/userSlice';
import { IoPersonAdd } from 'react-icons/io5';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import { useSocket } from '../../context/SocketContext';
import useDetectMobile from '../../hooks/useDetectMobile';
import { createChat, selectChats } from '../../app/features/chats/chatSlice';
import {
  setRenderModal,
  setViewingUserData,
} from '../../app/features/popup/popupSlice';
import { useNavigate } from 'react-router-dom';
import truncateInterest from '../../utils/truncateInterest';
import { FaCheck } from 'react-icons/fa6';

const UserTableCard = ({
  profilePicture,
  firstName,
  lastName,
  school,
  grade,
  interests,
  _id,
  student,
  filter,
}) => {
  const user = useSelector(selectUser);
  const similarInterest = interests.find((interest) =>
    user.interests.includes(interest)
  );
  const { onlineUsers } = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const largeScreen = window.screen.width > 1500;

  let interest = similarInterest ? similarInterest : interests[0];

  const isOnline = checkOnlineStatus(onlineUsers, _id);
  const mobile = useDetectMobile();

  const disableBtns = (id) => {
    const element = document.getElementById(id);
    element.style.opacity = 0.4;
    element.classList.add('disabled');
  };

  const startChat = async (e) => {
    disableBtns(e.target.id);
    await dispatch(createChat({ chatData: { members: [student] } })).then(
      (result) => {
        navigate(`/chats/${result.payload._id}`);
        dispatch(resetStudents());
        dispatch(getCommonNewStudents({ filter, cursor: '' }));
      }
    );
  };

  const contactAdd = async (e) => {
    e.target.classList.add('disabled');
    await dispatch(addContact(_id));
  };
  const isInContacts = user.contacts.find((c) => c._id === _id);

  const openDetails = async () => {
    await dispatch(setViewingUserData(student));
    await dispatch(setRenderModal({ render: true, name: 'user-detail' }));
    document.getElementById('my_modal_3').showModal();
  };

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
            <div className="mask mask-squircle h-12 w-12">
              <img
                src={profilePicture}
                alt="Avatar Tailwind CSS Component"
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="font-bold capitalize">
              {firstName + ' ' + lastName}
            </div>
            <span className="badge badge-ghost badge-sm">Grade {grade}</span>
          </div>
        </div>
      </td>
      {!mobile && (
        <td className="w-2/5">
          {largeScreen ? (
            interests.slice(0, 2).map((interestItem, index) => {
              return (
                <InterestDisplayBtn
                  interest={interestItem}
                  key={index}
                  includeMargin={true}
                />
              );
            })
          ) : (
            <InterestDisplayBtn interest={truncateInterest(interest, 16)} />
          )}
        </td>
      )}
      <td>
        <div className="flex items-center gap-3">
          <button
            className="btn btn-sm btn-outline"
            onClick={startChat}
            id={`chat-${_id}`}
          >
            Chat
          </button>
          {!isInContacts ? (
            <IoPersonAdd size={20} cursor="pointer" onClick={contactAdd} />
          ) : (
            <FaCheck fill="green" size={18} />
          )}
        </div>
      </td>
      <th>
        <button
          className="btn btn-ghost btn-xs max-[550px]:pr-0"
          onClick={openDetails}
        >
          Details
        </button>
      </th>
    </tr>
  );
};

export default UserTableCard;
