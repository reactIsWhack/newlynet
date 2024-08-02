import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';

const ChatBubble = ({ message, author, createdAt }) => {
  const { userId } = useSelector(selectUser);

  const myMessage = author._id === userId;

  return (
    <>
      <div className={`chat ${myMessage ? 'chat-end' : 'chat-start'}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={author.profilePicture}
            />
          </div>
        </div>
        <div className="chat-header">{author.fullName}</div>
        <div className="chat-bubble">{message}</div>
        <time className="text-xs opacity-50 chat-footer">{createdAt}</time>
      </div>
    </>
  );
};

export default ChatBubble;
