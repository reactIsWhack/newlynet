import React from 'react';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import { useSocket } from '../../context/SocketContext';
import InterestDisplayBtn from './InterestDisplayBtn';
import truncateInterest from '../../utils/truncateInterest';
import useCheckConversation from '../../hooks/useCheckConversation';
import { useDispatch, useSelector } from 'react-redux';
import {
  createChat,
  selectChats,
  setSelectedChat,
} from '../../app/features/chats/chatSlice';
import { useNavigate } from 'react-router-dom';

const Contact = ({
  fullName,
  profilePicture,
  _id,
  school,
  grade,
  interests,
  contact,
}) => {
  const { hasConversation, conversation } = useCheckConversation(_id);
  const { onlineUsers } = useSocket();
  const { chatsLoading } = useSelector(selectChats);
  const online = checkOnlineStatus(onlineUsers, _id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const interestBtn = interests.map((interest, index) => {
    return (
      <InterestDisplayBtn
        interest={truncateInterest(interest, 16)}
        key={index}
      />
    );
  });

  const handleResumeChatting = async () => {
    await dispatch(setSelectedChat(conversation));
    navigate(`/chats/${conversation._id}`);
  };

  const handleStartChatting = async (e) => {
    e.target.classList.add('disabled');
    await dispatch(createChat({ chatData: { members: [contact] }, navigate }));
    e.target.classList.remove('disabled');
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body py-8 px-0">
        <div className="flex items-center gap-3 mb-2 px-8">
          <div className={`avatar ${online ? 'online' : 'offline'}`}>
            <div className="w-12 rounded-full">
              <img src={profilePicture} />
            </div>
          </div>
          <div>
            <h2 className="card-title text-lg">{fullName}</h2>
            <div className="text-sm">
              {school.formattedName} - Grade {grade}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-4 gap-2 justify-center px-3">
          {interestBtn}
        </div>
        <div className="card-actions justify-center h-full items-end">
          {hasConversation ? (
            <button
              className="btn btn-primary min-h-10 h-10"
              onClick={handleResumeChatting}
            >
              Resume Chatting
            </button>
          ) : (
            <button className="btn btn-neutral" onClick={handleStartChatting}>
              Start Chatting
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
