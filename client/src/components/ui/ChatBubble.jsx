import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { format, isToday } from 'date-fns';

const ChatBubble = ({ message, author, createdAt, media }) => {
  const { userId } = useSelector(selectUser);
  const chatBubbleRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const myMessage = author._id === userId;

  const formattedDate = isToday(new Date(createdAt))
    ? format(new Date(createdAt), 'p') // e.g., 10:00 AM
    : format(new Date(createdAt), 'MMM dd, yyyy'); // e.g., Jul 31, 2024

  const shakeClass = message.shouldShake ? 'shake' : '';

  useEffect(() => {
    const checkOverflow = () => {
      if (chatBubbleRef.current) {
        const { scrollHeight, clientHeight } = chatBubbleRef.current;
        setIsOverflowing(scrollHeight > clientHeight);
      }
    };

    checkOverflow();

    // Optional: Add a resize listener to recheck on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [message]);
  if (message === 'great job') console.log(message.length > 20);

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

      <div className="max-w-96 max-[550px]:max-w-36 flex flex-col">
        {media.src && (
          <div className="mb-3">
            {media.fileType.includes('video') ? (
              <video src={media.src} controls className="rounded-lg"></video>
            ) : (
              <img src={media.src} className="rounded-lg" />
            )}
          </div>
        )}
        <div
          className={`chat-bubble text-white ${
            myMessage ? 'bg-blue-500 ml-auto' : 'bg-gray-700 mr-auto'
          } ${shakeClass} break-words whitespace-pre-wrap max-w-96 max-[550px]:max-w-36`}
          ref={chatBubbleRef}
        >
          {message}
        </div>
      </div>

      <time className="text-xs opacity-50 chat-footer">{formattedDate}</time>
    </div>
  );
};

export default ChatBubble;
