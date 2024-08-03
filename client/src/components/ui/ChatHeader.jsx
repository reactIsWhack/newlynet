import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChats,
  setSelectedChat,
} from '../../app/features/chats/chatSlice';
import { selectUser } from '../../app/features/user/userSlice';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const ChatHeader = () => {
  const { selectedConversation } = useSelector(selectChats);
  const { userId } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const receivingMember = selectedConversation?.members.find(
    (m) => m._id !== userId
  );
  const receiverName =
    selectedConversation?.chatType === 'group'
      ? selectedConversation?.chatName
      : receivingMember?.fullName;
  const headerPic =
    selectedConversation?.chatType === 'group'
      ? selectedConversation.chatPic
      : receivingMember?.profilePicture;

  const handleClick = () => {
    dispatch(setSelectedChat(null));
    navigate('/chats');
  };

  return (
    <div className="h-20 fixed top-16 bg-gray-900 w-3/4 shadow-xl flex items-center  px-3 max-[550px]:w-full">
      <IoIosArrowBack
        size={30}
        className="absolute fill-blue-500"
        cursor="pointer"
        onClick={handleClick}
      />
      <div className="flex flex-col items-center mx-auto gap-1">
        <img src={headerPic} className="h-10" />
        <div className="text-sm">To: {receiverName}</div>
      </div>
    </div>
  );
};

export default ChatHeader;
