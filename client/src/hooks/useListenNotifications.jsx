import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUnreadChats } from '../app/features/user/userSlice';
import { selectChats } from '../app/features/chats/chatSlice';
import { useParams } from 'react-router-dom';

const useListenNotifications = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { unreadChats, userId } = useSelector(selectUser);
  const { messages } = useSelector(selectChats);
  const { id } = useParams();

  useEffect(() => {
    console.log(socket);
    socket?.on('newMessageNotify', (unreadChats, sendingChat) => {
      if (sendingChat) {
        const receivingMember = sendingChat?.members.find(
          (m) => m._id !== userId
        );
        const receiverName =
          sendingChat.chatType === 'group'
            ? sendingChat.chatName
            : receivingMember?.fullName;
        toast(`New message from ${receiverName}`, { id: 'notify' });
      }

      dispatch(setUnreadChats(unreadChats));
    });
  }, [unreadChats, messages, socket, id, dispatch]);
};

export default useListenNotifications;
