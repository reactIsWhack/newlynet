import React from 'react';

const UnreadMessageHeadline = () => {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-grow border-t-2 border-red-500"></div>
      <span className="mx-4 text-red-500 font-medium text-lg">
        Latest Messages
      </span>
      <div className="flex-grow border-t-2 border-red-500"></div>
    </div>
  );
};

export default UnreadMessageHeadline;
