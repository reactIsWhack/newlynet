import React from 'react';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import { useSocket } from '../../context/SocketContext';
import InterestDisplayBtn from './InterestDisplayBtn';
import truncateInterest from '../../utils/truncateInterest';

const Contact = ({
  fullName,
  profilePicture,
  _id,
  school,
  grade,
  interests,
}) => {
  const { onlineUsers } = useSocket();
  const online = checkOnlineStatus(onlineUsers, _id);

  const interestBtn = interests.map((interest, index) => {
    return (
      <InterestDisplayBtn
        interest={truncateInterest(interest, 16)}
        key={index}
      />
    );
  });

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
        <div className="card-actions justify-center">
          <button className="btn btn-primary min-h-10 h-10">
            Resume Chatting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
