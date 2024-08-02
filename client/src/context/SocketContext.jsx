import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { io } from 'socket.io-client';
import { setConversations, setMessages } from '../app/features/chats/chatSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { isLoggedIn, userId } = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      const socketVal = io('http://localhost:4000', { query: { userId } });
      setSocket(socketVal);

      socketVal.on('onlineUsers', (users) => {
        // listens for the getAllOnlineUsers event
        setOnlineUsers(users);
      });

      socketVal.on('newChat', (chat) => {
        dispatch(setConversations(chat));
        const toastMsg =
          chat.members.length < 3
            ? `${chat.creator.fullName} created a chat with you!`
            : `${chat.creator.fullName} created a chat with you and ${
                chat.members.length - 2
              } others`;
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
  }, [isLoggedIn, userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
