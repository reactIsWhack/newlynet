import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import ClubChatHeader from '../components/ClubChatHeader';
import MessageSkeleton from '../components/ui/MessageSkeleton';
import MessageInput from '../components/ui/MessageInput';

const SectionMessages = () => {
  const { selectedClubChat, clubChatLoading, messages } =
    useSelector(selectClubChat);
  const [filePreview, setFilePreview] = useState('');

  return (
    <>
      {selectedClubChat && (
        <div className="flex-1 relative overflow-hidden h-full flex flex-col z-20">
          {selectedClubChat && <ClubChatHeader />}
          <div className="message-container overflow-auto pt-4 px-8 flex-1 max-[550px]:px-4 w-full">
            {clubChatLoading &&
              !messages.length &&
              [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
            {clubChatLoading && messages.length > 0 && (
              <div className="flex justify-center mt-4">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}

            {messages.length > 0 && chatBubble}
            {!messages.length && !clubChatLoading && (
              <h4 className="text-center text-lg">No messages here</h4>
            )}
          </div>

          <MessageInput
            filePreview={filePreview}
            setFilePreview={setFilePreview}
          />
        </div>
      )}
    </>
  );
};

export default SectionMessages;
