import React from 'react';
import Conversation from './ui/Conversation';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectChats } from '../app/features/chats/chatSlice';
import checkOnlineStatus from '../utils/checkOnlineStatus';

const Conversations = () => {
  const { conversations, chatsLoading } = useSelector(selectChats);

  const conversation = conversations.map((conversation, index) => {
    return (
      <Conversation
        key={conversation._id}
        {...conversation}
        conversation={conversation}
        lastIdx={index === conversations.length - 1}
      />
    );
  });

  return (
    <>
      <div className="mb-4 mt-2">
        <select className="select select-bordered max-w-xs min-h-10 h-10">
          <option>Conversations</option>
          <option>Group Chats</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 overflow-auto  max-h-screen scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-700">
        {chatsLoading && !conversations.length ? (
          <div className="flex justify-center mt-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : conversations.length > 0 ? (
          conversation
        ) : (
          <div className="text-center mt-5">No conversations found</div>
        )}
      </div>
    </>
  );
};

export default Conversations;
