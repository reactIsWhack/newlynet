import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  setChattingWith,
  setUnreadChats,
} from '../app/features/user/userSlice';
import { io } from 'socket.io-client';
import {
  selectChats,
  setConversations,
  setMessages,
} from '../app/features/chats/chatSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { isLoggedIn, userId } = useSelector(selectUser);
  const { chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      const socketVal = io('http://localhost:4000', { query: { userId } });
      setSocket(socketVal);

      socketVal.on('onlineUsers', (users) => {
        // listens for the onlineUsers event
        setOnlineUsers(users);
      });

      socketVal.on('newChat', (chat, updatedNotifications) => {
        console.log(chatFilter);
        if (chatFilter === chat.chatType) dispatch(setConversations(chat));
        dispatch(setChattingWith(chat.members.map((member) => member._id)));
        dispatch(setUnreadChats(updatedNotifications));

        const toastMsg =
          chat.members.length < 3
            ? `${
                chat.creator.firstName + ' ' + chat.creator.lastName
              } created a chat with you!`
            : `${
                chat.creator.firstName + ' ' + chat.creator.lastName
              } created a chat with you and ${chat.members.length - 2} ${
                chat.members.length === 3 ? 'other' : 'others'
              }`;
        toast(toastMsg);
      });

      return () => {
        socketVal.close();
        socketVal.disconnect();
      };
    } else {
      if (socket) {
        socket.close();
        socket.disconnect(); // if the user is no longer logged in, close the socket connection
        setSocket(null);
      }
    }
  }, [isLoggedIn, userId, chatFilter]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
