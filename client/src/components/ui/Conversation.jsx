import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { useSocket } from '../../context/SocketContext';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import {
  getMessages,
  resetMessages,
  selectChats,
  setSelectedChat,
} from '../../app/features/chats/chatSlice';
import { useNavigate, useParams } from 'react-router-dom';
import getChatName from '../../utils/getChatName';

const Conversation = ({
  lastIdx,
  _id,
  members,
  conversation,
  chatType,
  chatName,
  chatPic,
}) => {
  const { onlineUsers, socket } = useSocket();
  const { userId, unreadChats } = useSelector(selectUser);
  const { selectedConversation } = useSelector(selectChats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const receivingMember = members.find((member) => member._id !== userId);
  const isOnline = checkOnlineStatus(onlineUsers, receivingMember?._id);

  const isSelected = selectedConversation?._id === _id;

  const handleClick = async () => {
    dispatch(setSelectedChat(conversation));
    navigate(`/chats/${_id}`);
    await dispatch(resetMessages());
    dispatch(getMessages(_id));
  };

  useEffect(() => {
    return () => dispatch(resetMessages());
  }, []);

  const renderUnreadMark = unreadChats?.some((chat) => chat.chat._id === _id);
  const filteredMembers = members.filter((member) => member._id !== userId);

  const memberImg = filteredMembers.map((member, index) => {
    return (
      <img
        key={member._id}
        src={member.profilePicture}
        className={`object-cover ${
          filteredMembers.length === 2 && index === 1 ? 'ml-8' : ''
        }`}
      />
    );
  });

  const imageGrid = {
    display: 'grid',
    gridTemplateColumns: `repeat(${
      filteredMembers.length === 2 ? '1' : '2'
    }, 25px)`,
    gridTemplateRows: `repeat(2, 25px)`,
    gap: 0,
    placeItems: 'center',
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? 'bg-sky-500' : ''
        }`}
        onClick={handleClick}
      >
        <div
          className={`avatar ${
            chatType === 'group' ? '' : isOnline ? 'online' : 'offline'
          }`}
        >
          {chatType === 'individual' ? (
            <div className="w-12 h-12 rounded-full object-cover">
              <img src={receivingMember.profilePicture} alt="user avatar" />
            </div>
          ) : !chatPic ? (
            <div className="w-12 h-12 rounded-full overflow-hidden ">
              <div style={imageGrid}>{memberImg}</div>
            </div>
          ) : (
            <img src={chatPic} className="w-12 rounded-full object-cover" />
          )}
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">
              {chatType === 'group'
                ? getChatName(chatName, members, userId)
                : receivingMember.firstName + ' ' + receivingMember.lastName}
            </p>
          </div>
        </div>
        {renderUnreadMark && (
          <div className="w-3 h-3 rounded-full bg-sky-400 mr-4"></div>
        )}
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
