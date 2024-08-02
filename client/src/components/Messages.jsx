import { useRef, useEffect, useState } from 'react';
import MessageInput from './ui/MessageInput';
import ChatBubble from './ui/ChatBubble';
import { useSelector } from 'react-redux';
import { selectChats } from '../app/features/chats/chatSlice';
import MessageSkeleton from './ui/MessageSkeleton';
import useListenMessages from '../hooks/useListenMessages';
import useDetectMobile from '../hooks/useDetectMobile';

const Messages = () => {
  const { messages, chatsLoading } = useSelector(selectChats);
  const lastMessageRef = useRef(null);
  useListenMessages();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  const chatBubble = messages.map((message) => {
    return (
      <div key={message._id} ref={lastMessageRef}>
        <ChatBubble {...message} />
      </div>
    );
  });
  const mobile = useDetectMobile();

  return (
    <div className="px-4 flex-1 relative overflow-x-hidden h-full overflow-hidden pt-12 max-[550px]:w-full z-20">
      <div className="message-container overflow-auto pt-4 px-8 h-full max-[550px]:px-1 w-full">
        {chatsLoading &&
          [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

        {messages.length > 0 && !chatsLoading && chatBubble}
        {!messages.length && !chatsLoading && (
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
