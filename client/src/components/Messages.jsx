import { useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!paginating)
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  }, [selectedConversation, messages, paginating]);

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
        <div className="flex-1 relative overflow-x-hidden h-full overflow-hidden max-[550px]:w-full z-20 pt-32">
          {selectedConversation && <ChatHeader />}
          <div
            className="message-container overflow-auto pt-4 px-8 h-full max-[550px]:px-1 w-full"
            onScroll={handleScroll}
          >
            {chatsLoading &&
              [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

            {messages.length > 0 && !chatsLoading && chatBubble}
            {!messages.length && !chatsLoading && (
              <h4 className="text-center text-lg">
                Send a message to start the conversation
              </h4>
            )}
          </div>

          <MessageInput />
        </div>
      )}
    </>
  );
};

export default Messages;
