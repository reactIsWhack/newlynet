import { useEffect, useState } from 'react';
import Conversations from './Conversations';
import SearchChat from './ui/SearchChat';
import { useSelector } from 'react-redux';
import { selectChats } from '../app/features/chats/chatSlice';

const ChatSidebar = () => {
  const { conversations, chatFilter } = useSelector(selectChats);
  const [conversationsToRender, setConversationsToRender] = useState([]);

  useEffect(() => {
    setConversationsToRender(conversations);
  }, [conversations]);

  console.log(conversationsToRender);
  return (
    <div className="sidebar border-r border-slate-500 p-4 flex flex-col w-1/4 py-5 max-[550px]:border-none max-[550px]:w-full relative">
      <SearchChat
        setConversationsToRender={setConversationsToRender}
        conversationsToRender={conversationsToRender}
      />
      <div className="divider px-0 mb-0"></div>
      <Conversations conversationsToRender={conversationsToRender} />
    </div>
  );
};

export default ChatSidebar;
