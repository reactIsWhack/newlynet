import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { useSocket } from '../../context/SocketContext';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import {
  selectChats,
  setSelectedChat,
} from '../../app/features/chats/chatSlice';
import { useNavigate } from 'react-router-dom';

const Conversation = ({ lastIdx, _id, members, conversation }) => {
  const { onlineUsers } = useSocket();
  const { userId } = useSelector(selectUser);
  const { selectedConversation } = useSelector(selectChats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const receivingMember = members.find((member) => member._id !== userId);
  const isOnline = checkOnlineStatus(onlineUsers, receivingMember?._id);

  const isSelected = selectedConversation?._id === _id;

  const handleClick = () => {
    dispatch(setSelectedChat(conversation));
    navigate(`/chats/${_id}`);
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? 'bg-sky-500' : ''
        }`}
        onClick={handleClick}
      >
        <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
          <div className="w-12 rounded-full">
            <img src={receivingMember.profilePicture} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">
              {receivingMember.fullName}
            </p>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
