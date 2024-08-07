import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { format, isToday } from 'date-fns';

const ChatBubble = ({ message, author, createdAt }) => {
  const { userId } = useSelector(selectUser);

  const myMessage = author._id === userId;

  const formattedDate = isToday(new Date(createdAt))
    ? format(new Date(createdAt), 'p') // e.g., 10:00 AM
    : format(new Date(createdAt), 'MMM dd, yyyy'); // e.g., Jul 31, 2024

  console.log(message.shouldShake);
  const shakeClass = message.shouldShake ? 'shake' : '';

  return (
    <div className={`chat ${myMessage ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Profile" src={author.profilePicture} />
        </div>
      </div>
      <div className="chat-header capitalize">
        {author.firstName + ' ' + author.lastName}
      </div>
      <div
        className={`chat-bubble text-white ${
          myMessage ? 'bg-blue-500' : 'bg-gray-700'
        } ${shakeClass} break-words whitespace-pre-wrap max-w-96 max-[550px]:max-w-36`}
      >
        {message}
      </div>
      <time className="text-xs opacity-50 chat-footer">{formattedDate}</time>
    </div>
  );
};

export default ChatBubble;
