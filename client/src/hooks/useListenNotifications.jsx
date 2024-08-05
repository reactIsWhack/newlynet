import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUnreadChats } from '../app/features/user/userSlice';
import {
  reorderChats,
  selectChats,
  setMessages,
} from '../app/features/chats/chatSlice';
import { useParams } from 'react-router-dom';

const useListenNotifications = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { unreadChats, userId } = useSelector(selectUser);
  const { messages, conversations, chatFilter } = useSelector(selectChats);
  const { id } = useParams();

  useEffect(() => {
    socket?.on('newMessageNotify', (unreadChats, sendingChat) => {
      dispatch(setUnreadChats(unreadChats));

      if (sendingChat) {
        console.log(chatFilter, sendingChat.chatType);
        console.log(chatFilter === sendingChat.chatType);
        const [firstMember, secondMember] = sendingChat?.members.filter(
          (m) => m._id !== userId
        );
        let groupChatNotif = '';

        if (sendingChat.chatType === 'group') {
          if (sendingChat.chatName)
            groupChatNotif = `New message in ${sendingChat.chatName}`;
          else if (sendingChat.members.length === 3)
            groupChatNotif = `New message in chat with ${
              firstMember.firstName + ' ' + firstMember.lastName
            } & ${secondMember.firstName + ' ' + secondMember.lastName}`;
          else
            groupChatNotif = `New message in chat with ${
              firstMember.firstName + ' ' + firstMember.lastName
            }, and ${sendingChat.members.length - 2} others`;
        }

        const receiverName =
          sendingChat.chatType === 'group'
            ? groupChatNotif
            : `New message from ${
                firstMember?.firstName + ' ' + firstMember?.lastName
              }`;

        toast(`${receiverName}`, { id: 'notify' });
        const reordered = conversations.filter(
          (c) => c._id !== sendingChat?._id
        );
        if (chatFilter === sendingChat.chatType) {
          console.log('ran');
          dispatch(reorderChats([sendingChat, ...reordered]));
        }
      }
    });
  }, [socket, id, dispatch, chatFilter]);
};

export default useListenNotifications;
