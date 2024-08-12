import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getClubChatMessages,
  selectClubChat,
} from '../app/features/clubChat/clubChatSlice';
import ClubChatHeader from '../components/ClubChatHeader';
import MessageSkeleton from '../components/ui/MessageSkeleton';
import MessageInput from '../components/ui/MessageInput';
import ChatBubble from '../components/ui/ChatBubble';
import useListenClubServerMsg from '../hooks/useListenClubServerMsg';
import { useParams } from 'react-router-dom';
import {
  readUnreadClubMessages,
  selectUser,
} from '../app/features/user/userSlice';
import UnreadMessageHeadline from '../components/ui/UnreadMessageHeadline';
import useCheckVisibility from '../hooks/useCheckVisibility';

const SectionMessages = () => {
  useListenClubServerMsg(); // listens for messages in real time

  const { selectedClubChat, clubChatLoading, messages, dateQuery, paginating } =
    useSelector(selectClubChat);
  const { unreadClubChats } = useSelector(selectUser);
  const [filePreview, setFilePreview] = useState('');
  const lastMessageRef = useRef(null);
  const dispatch = useDispatch();
  const { sectionId } = useParams();

  const chat = unreadClubChats.find(
    (chatItem) => chatItem.chat._id === selectedClubChat?._id
  );
  const chatMessages = new Set(chat?.messages.map((msg) => msg._id));
  const initialMessage = messages.find((msg) => chatMessages?.has(msg._id));
  const isVisible = useCheckVisibility(lastMessageRef, initialMessage);

  useEffect(() => {
    if (chat && isVisible) dispatch(readUnreadClubMessages(chat._id));
  }, [isVisible]);

  const chatBubble = messages.map((message, index) => {
    return (
      <div
        key={message._id}
        id={message._id}
        ref={index + 1 === messages.length ? lastMessageRef : null}
      >
        {message._id === initialMessage?._id && <UnreadMessageHeadline />}
        <ChatBubble {...message} />
      </div>
    );
  });

  useEffect(() => {
    if (initialMessage) {
      setTimeout(() => {
        document.getElementById(initialMessage._id)?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
          behavior: 'smooth',
          alignToTop: false,
        });
      }, 200);
    } else {
      !paginating &&
        setTimeout(() => {
          lastMessageRef.current?.scrollIntoView({
            block: 'nearest',
            inline: 'center',
            behavior: 'smooth',
            alignToTop: false,
          });
        }, 200);
    }
  }, [selectedClubChat, sectionId, initialMessage, messages]);

  const handleScroll = (e) => {
    if (dateQuery === '') return;

    if (e.target.scrollTop === 0) {
      dispatch(getClubChatMessages(selectedClubChat._id)).then((res) => {
        if (res.payload.data.length) {
          const lastMessageLoaded =
            res.payload.data[res.payload.data.length - 1]._id;
          document.getElementById(lastMessageLoaded).scrollIntoView();
        }
      });
    }
  };

  return (
    <>
      {selectedClubChat && (
        <div className="flex-1 relative overflow-hidden h-full flex flex-col z-20">
          {selectedClubChat && <ClubChatHeader />}
          <div
            className="message-container overflow-auto pt-4 px-8 flex-1 max-[550px]:px-4 w-full"
            onScroll={handleScroll}
          >
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
