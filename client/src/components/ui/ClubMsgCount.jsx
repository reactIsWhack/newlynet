import React from 'react';

const ClubMsgCount = ({ unreadChats }) => {
  return (
    <div>
      {' '}
      <span className="w-5 h-5 rounded-full bg-red-500 absolute flex items-center justify-center text-white text-xs -top-3 -right-3">
        {unreadChats.length}
      </span>
    </div>
  );
};

export default ClubMsgCount;
