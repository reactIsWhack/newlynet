import React from 'react';
import Conversations from './Conversations';
import SearchChat from './ui/SearchChat';

const ChatSidebar = () => {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col w-1/4 py-5 max-h-screen pb-20 h-screen max-[550px]:w-full max-[550px]:border-none">
      <SearchChat />
      <div className="divider px-0 mb-0"></div>
      <Conversations />
    </div>
  );
};

export default ChatSidebar;
