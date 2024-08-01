import React from 'react';
import Conversation from './ui/Conversation';
import { Link } from 'react-router-dom';

const Conversations = () => {
  return (
    <>
      <div className="mb-4 mt-2">
        <Link className="text-base hover:underline hover:text-blue-600">
          Conversations
        </Link>
      </div>
      <div className="flex flex-col gap-2 overflow-auto  max-h-screen scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-700">
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
      </div>
    </>
  );
};

export default Conversations;
