import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChats,
  setSelectedChat,
} from '../../app/features/chats/chatSlice';
import { addContact, selectUser } from '../../app/features/user/userSlice';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import getChatName from '../../utils/getChatName';
import { IoPersonAdd } from 'react-icons/io5';
import {
  setRenderModal,
  setViewingUserData,
} from '../../app/features/popup/popupSlice';

const ChatHeader = () => {
  const { selectedConversation } = useSelector(selectChats);
  const { userId, contacts } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const receivingMember = selectedConversation?.members.find(
    (m) => m._id !== userId
  );

  const viewMemberDetails = async (member) => {
    await dispatch(setViewingUserData(member));
    await dispatch(setRenderModal({ render: true, name: 'user-detail' }));
    document.getElementById('my_modal_3').showModal();
  };

  const members = selectedConversation.members.map((member, index) => {
    if (member._id === userId) return null;
    return (
      <span key={member._id} className="comma">
        {
          <span
            className="hover:underline cursor-pointer"
            onClick={() => viewMemberDetails(member)}
          >
            {member.firstName + ' ' + member.lastName}
          </span>
        }{' '}
      </span>
    );
  });

  const receiverName =
    selectedConversation.chatType === 'group'
      ? selectedConversation.chatName || members
      : receivingMember.firstName + ' ' + receivingMember?.lastName;

  const headerPic =
    selectedConversation.chatType === 'group'
      ? selectedConversation.chatPic
      : receivingMember.profilePicture;

  const handleClick = () => {
    dispatch(setSelectedChat(null));
    navigate('/chats');
  };

  const addAsContact = async (e) => {
    e.target.classList.add('disabled');
    e.target.opacity = 0.4;
    await dispatch(addContact(receivingMember._id));
  };

  const isInContacts = contacts.some(
    (contact) => contact._id === receivingMember._id
  );

  const profilePicturesHead = selectedConversation.members.map(
    (member, index) => {
      if (member._id === userId) return null;
      return (
        <img
          src={member.profilePicture}
          key={member._id}
          className={`w-8 h-8 rounded-full border-2 border-gray-900 -ml-3 cursor-pointer object-cover`}
          onClick={() => viewMemberDetails(member)}
        />
      );
    }
  );

  return (
    <div className=" bg-gray-900 shadow-xl flex items-center px-3 max-[550px]:w-full z-50 justify-between py-3 w-full">
      <IoIosArrowBack
        size={30}
        className=" fill-blue-500"
        cursor="pointer"
        onClick={handleClick}
      />
      <div className="flex flex-col items-center">
        {selectedConversation.chatType === 'group' && !headerPic ? (
          <div className="flex items-center h-10">{profilePicturesHead}</div>
        ) : (
          <img src={headerPic} className="h-10 rounded-full" />
        )}
        <div className="text-sm capitalize">
          To: {receiverName || 'Loading...'}
        </div>
      </div>
      <div>
        {!isInContacts && selectedConversation.chatType === 'individual' && (
          <IoPersonAdd size={25} onClick={addAsContact} cursor="pointer" />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
