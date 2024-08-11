import { useRef, useEffect, useState } from 'react';
import MessageInput from './ui/MessageInput';
import ChatBubble from './ui/ChatBubble';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, selectChats } from '../app/features/chats/chatSlice';
import MessageSkeleton from './ui/MessageSkeleton';
import useListenMessages from '../hooks/useListenMessages';
import useDetectMobile from '../hooks/useDetectMobile';
import ChatHeader from './ui/ChatHeader';
import { useParams } from 'react-router-dom';

const Messages = () => {
  const {
    messages,
    chatsLoading,
    selectedConversation,
    paginating,
    dateQuery,
  } = useSelector(selectChats);
  const lastMessageRef = useRef(null);
  useListenMessages();
  const dispatch = useDispatch();
  const [filePreview, setFilePreview] = useState('');

  useEffect(() => {
    if (!paginating)
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
          behavior: 'smooth',
          alignToTop: false,
        });
      }, 300);
  }, [selectedConversation, messages, paginating, filePreview]);

  const chatBubble = messages.map((message) => {
    return (
      <div key={message._id} ref={lastMessageRef} id={message._id}>
        <ChatBubble {...message} />
      </div>
    );
  });

  const handleScroll = (e) => {
    if (dateQuery === '') return;

    if (e.target.scrollTop === 0) {
      dispatch(getMessages(selectedConversation?._id));
    }
  };

  return (
    <>
      {selectedConversation && (
        <div className="flex-1 relative overflow-hidden h-full flex flex-col z-20 pt-[4.5rem]">
          {selectedConversation && <ChatHeader />}
          <div
            className="message-container overflow-auto pt-4 px-8 flex-1 max-[550px]:px-4 w-full"
            onScroll={handleScroll}
          >
            {chatsLoading &&
              !messages.length &&
              [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
            {chatsLoading && messages.length > 0 && (
              <div className="flex justify-center mt-4">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}

            {messages.length > 0 && chatBubble}
            {!messages.length && !chatsLoading && (
              <h4 className="text-center text-lg">
                Send a message to start the conversation
              </h4>
            )}
          </div>

          <MessageInput
            filePreview={filePreview}
            setFilePreview={setFilePreview}
            lastMessageRef={lastMessageRef}
            messageType="standard"
          />
        </div>
      )}
    </>
  );
};

export default Messages;
