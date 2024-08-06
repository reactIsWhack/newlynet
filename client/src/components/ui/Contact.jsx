import React from 'react';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import { useSocket } from '../../context/SocketContext';
import InterestDisplayBtn from './InterestDisplayBtn';
import truncateInterest from '../../utils/truncateInterest';
import { useDispatch, useSelector } from 'react-redux';
import {
  createChat,
  overideChats,
  selectChats,
  setChatFilter,
  setSelectedChat,
} from '../../app/features/chats/chatSlice';
import { useNavigate } from 'react-router-dom';
import {
  getCommonNewStudents,
  resetStudents,
  selectUser,
} from '../../app/features/user/userSlice';
import ConnectBtns from './ConnectBtns';
import Badge from './Badge';

const Contact = ({
  firstName,
  lastName,
  profilePicture,
  _id,
  school,
  grade,
  interests,
  contact,
  renderConnectBtns,
  bg,
  filter,
  contacts,
  socialMediaUsernames,
}) => {
  const { onlineUsers } = useSocket();
  const online = checkOnlineStatus(onlineUsers, _id);
  const { chattingWith, userId } = useSelector(selectUser);
  const { contactConversations, chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const interestBtn = interests.map((interest, index) => {
    return (
      <InterestDisplayBtn
        interest={truncateInterest(interest, 16)}
        key={index}
      />
    );
  });

  const handleResumeChatting = async () => {
    const conversation = contactConversations.find((chat) =>
      chat.members.some((member) => member._id === _id)
    );
    await dispatch(setSelectedChat(conversation));
    navigate(`/chats/${conversation._id}`);
  };

  const handleStartChatting = async (e) => {
    e.target.classList.add('disabled');
    if (chatFilter !== 'individual') {
      /* if the user was previously viewing group chats, change the chats on the chat page to individual conversations
      so the user can see their new conversation */
      await dispatch(setChatFilter('individual'));
      await dispatch(overideChats(contactConversations));
    }
    await dispatch(createChat({ chatData: { members: [contact] } })).then(
      (result) => {
        navigate(`/chats/${result.payload._id}`);
        dispatch(resetStudents());
        dispatch(getCommonNewStudents({ filter, cursor: '' }));
      }
    );
    e.target.classList.remove('disabled');
  };
  const contactHasUserInContacts = contacts.some(
    (contactId) => contactId === userId
  );

  let socialMediaTag;
  if (contactHasUserInContacts) {
    socialMediaTag = Object.values(socialMediaUsernames).map((value, index) => {
      if (value)
        return (
          <Badge
            key={index}
            text={value}
            label={Object.keys(socialMediaUsernames)[index]}
          />
        );
    });
  }

  return (
    <div className={`card shadow-xl w-full ${bg}`}>
      <div className="card-body py-8 px-0">
        <div className="flex items-center gap-3 mb-2 px-8">
          <div className={`avatar ${online ? 'online' : 'offline'}`}>
            <div className="w-12 rounded-full">
              <img src={profilePicture} />
            </div>
          </div>
          <div>
            <h2 className="card-title text-lg capitalize">
              {firstName + ' ' + lastName}
            </h2>
            <div className="text-sm">
              {school.formattedName} - Grade {grade}
            </div>
          </div>
        </div>
        {contactHasUserInContacts && (
          <div className="flex items-center flex-wrap justify-center mb-4 mt-2 gap-2">
            {socialMediaTag}
          </div>
        )}
        <div className="flex flex-wrap mb-4 gap-2 justify-center px-3">
          {interestBtn}
        </div>
        {renderConnectBtns ? (
          <ConnectBtns
            handleResumeChatting={handleResumeChatting}
            handleStartChatting={handleStartChatting}
          />
        ) : (
          <div className="card-actions justify-center h-full items-end">
            {chattingWith.includes(_id) &&
            contactConversations.some((contact) =>
              contact.members.some((member) => member._id === _id)
            ) ? (
              <button
                className="btn btn-primary min-h-10 h-10"
                onClick={handleResumeChatting}
              >
                Resume Chatting
              </button>
            ) : (
              <button className="btn btn-neutral" onClick={handleStartChatting}>
                Start Chatting
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
