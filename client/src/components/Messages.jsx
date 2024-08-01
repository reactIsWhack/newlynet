import React from 'react';
import MessageInput from './ui/MessageInput';

const Messages = () => {
  return (
    <div className="px-4 flex-1 overflow-auto relative overflow-x-hidden">
      <MessageInput />
    </div>
  );
};

export default Messages;
