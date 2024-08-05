import React from 'react';

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full mt-10 flex-col gap-20">
      <h1 className="text-lg m-0">
        Select a chat or create one to start connecting!
      </h1>

      <h1 className="text-lg">Send daily messages in chats to gain a streak</h1>
    </div>
  );
};

export default NoChatSelected;
