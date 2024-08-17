import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { setRenderModal } from '../../app/features/popup/popupSlice';
import { selectChats } from '../../app/features/chats/chatSlice';
import { selectUser } from '../../app/features/user/userSlice';

const SearchChat = ({ setConversationsToRender, conversationsToRender }) => {
  const dispatch = useDispatch();
  const { conversations, chatFilter } = useSelector(selectChats);
  const { userId } = useSelector(selectUser);

  const handleClick = async () => {
    await dispatch(setRenderModal({ render: true, name: 'create-chat' }));
    document.getElementById('my_modal_3').showModal();
  };

  const searchChat = (e) => {
    const searchQuery = e.target.value.trim().toLowerCase();

    // Create a regular expression that matches the search query sequentially at the start of any word
    const regex = new RegExp(`\\b${searchQuery.split('').join('.*')}`, 'i');

    const results = [];
    conversations.forEach((conversation) => {
      const members = conversation.members.filter((m) => m._id !== userId);
      members.forEach((member) => {
        const { firstName, lastName } = member;
        const fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
        // Check if the regex matches the full name
        if (regex.test(fullName)) {
          results.push(conversation);
        }
      });
    });

    if (searchQuery) {
      setConversationsToRender(results);
    } else {
      setConversationsToRender(conversations);
    }
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
