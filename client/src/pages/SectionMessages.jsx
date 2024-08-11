import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import ClubChatHeader from '../components/ClubChatHeader';
import MessageSkeleton from '../components/ui/MessageSkeleton';
import MessageInput from '../components/ui/MessageInput';
import ChatBubble from '../components/ui/ChatBubble';
import useListenClubServerMsg from '../hooks/useListenClubServerMsg';
import { useParams } from 'react-router-dom';

const SectionMessages = () => {
  useListenClubServerMsg();
  const { selectedClubChat, clubChatLoading, messages } =
    useSelector(selectClubChat);
  const [filePreview, setFilePreview] = useState('');
  const lastMessageRef = useRef(null);
  const { sectionId } = useParams();

  const chatBubble = messages.map((message) => {
    return (
      <div key={message._id} id={message._id} ref={lastMessageRef}>
        <ChatBubble {...message} />
      </div>
    );
  });

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth',
        alignToTop: false,
      });
    }, 300);
  }, [selectedClubChat, sectionId]);

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
            messageType="chatClub"
            lastMessageRef={lastMessageRef}
          />
        </div>
      )}
    </>
  );
};

export default SectionMessages;
