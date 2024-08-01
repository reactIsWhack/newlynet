import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { isLoggedIn, userId } = useSelector(selectUser);

  useEffect(() => {
    if (isLoggedIn) {
      const socketVal = io('http://localhost:4000', { query: { userId } });
      setSocket(socketVal);

      socketVal.on('onlineUsers', (users) => {
        // listens for the getAllOnlineUsers event
        setOnlineUsers(users);
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
