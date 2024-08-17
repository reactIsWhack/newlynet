import React from 'react';
import Conversation from './ui/Conversation';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConversations,
  selectChats,
  setChatFilter,
  setSelectedChat,
} from '../app/features/chats/chatSlice';
import checkOnlineStatus from '../utils/checkOnlineStatus';

const Conversations = ({ conversationsToRender }) => {
  const { conversations, chatsLoading, chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const conversation = conversationsToRender.map((conversation, index) => {
    return (
      <Conversation
        key={conversation._id}
        {...conversation}
        conversation={conversation}
        lastIdx={index === conversations.length - 1}
      />
    );
  });

  const handleChange = (e) => {
    dispatch(setChatFilter(e.target.value));
    dispatch(getConversations(e.target.value));
    navigate('/chats');
  };

  return (
    <>
      <div className="mb-4 mt-2">
        <select
          className="select select-bordered max-w-xs min-h-10 h-10"
          onChange={handleChange}
          value={chatFilter}
        >
          <option value="individual">Conversations</option>
          <option value="group">Group Chats</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 overflow-auto  max-h-screen scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-700">
        {chatsLoading && !conversationsToRender.length ? (
          <div className="flex justify-center mt-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : conversationsToRender.length > 0 ? (
          conversation
        ) : (
          <div className="text-center mt-5">No conversations found</div>
        )}
      </div>
    </>
  );
};

export default Conversations;
