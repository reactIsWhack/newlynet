import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { setRenderModal } from '../../app/features/popup/popupSlice';
import { selectChats } from '../../app/features/chats/chatSlice';
import { selectUser } from '../../app/features/user/userSlice';

const SearchChat = () => {
  const dispatch = useDispatch();
  const { conversations, chatFilter } = useSelector(selectChats);
  const { userId } = useSelector(selectUser);

  const handleClick = async () => {
    await dispatch(setRenderModal({ render: true, name: 'create-chat' }));
    document.getElementById('my_modal_3').showModal();
  };

  const searchChat = (e) => {
    const searchQuery = e.target.value;

    const results = conversations.filter((conversation) => {
      if (chatFilter === 'individual') {
        const otherMember = conversation.members.find((m) => m._id !== userId);
        if (
          searchQuery &&
          ((otherMember.firstName
            .toLowerCase()
            .indexOf(searchQuery[0].toLowerCase()) === 0 &&
            otherMember.firstName.toLowerCase().includes(searchQuery)) ||
            (otherMember.lastName
              .toLowerCase()
              .indexOf(searchQuery[0].toLowerCase()) === 0 &&
              otherMember.lastName.toLowerCase().includes(searchQuery)))
        ) {
          return conversation;
        }
      }
    });
    console.log(results);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search a chat..."
        className="input input-bordered rounded-full w-full"
        onChange={searchChat}
      />
      <button
        className="btn btn-circle bg-sky-500 text-white"
        onClick={handleClick}
      >
        <FaPlus size={20} />
      </button>
    </div>
  );
};

export default SearchChat;
