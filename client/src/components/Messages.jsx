import React from 'react';
import MessageInput from './ui/MessageInput';
import ChatBubble from './ui/ChatBubble';
import { useSelector } from 'react-redux';
import { selectChats } from '../app/features/chats/chatSlice';

const Messages = () => {
  const { messages } = useSelector(selectChats);
  const chatBubble = messages.map((message) => {
    return <ChatBubble key={message._id} {...message} />;
  });

  return (
    <div className="px-4 flex-1 relative overflow-x-hidden">
      <div className="message-container overflow-auto pt-4 px-8">
        {messages.length > 0 ? (
          chatBubble
        ) : (
          <h4 className="text-center text-lg">
            Send a message to start the conversation
          </h4>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default Messages;
