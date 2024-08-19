import React from 'react';
import checkOnlineStatus from '../../utils/checkOnlineStatus';
import { useSocket } from '../../context/SocketContext';
import InterestDisplayBtn from './InterestDisplayBtn';
import truncateInterest from '../../utils/truncateInterest';
import { useDispatch, useSelector } from 'react-redux';
import {
  createChat,
  overideChats,
  resetDateQuery,
  resetMessages,
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
import FireStreak from './FireStreak';
import useDetectMobile from '../../hooks/useDetectMobile';
import { selectPopup } from '../../app/features/popup/popupSlice';

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
  chats,
}) => {
  const { onlineUsers } = useSocket();
  const online = checkOnlineStatus(onlineUsers, _id);
  const { chattingWith, userId } = useSelector(selectUser);
  const { contactConversations, chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mobile = useDetectMobile();
  const {
    renderModal: { name, render },
  } = useSelector(selectPopup);

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
    if (chatFilter === 'group') {
      await dispatch(setChatFilter(''));
      await dispatch(overideChats(contactConversations));
    }
    await dispatch(resetMessages());
    await dispatch(resetDateQuery());
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
  const streakArr = chats.map((chat) => chat.highestStreak);
  const highestStreak = Math.max(...streakArr);

  return (
    <div className={`card shadow-xl w-full ${bg} relative`}>
      <div className="card-body max-[55px]:py-8 py-6 px-0">
        <div className="flex items-center gap-3 mb-2 px-6">
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
        {contactHasUserInContacts &&
          (socialMediaUsernames.snapchat || socialMediaUsernames.instagram) && (
            <div className="flex items-center flex-wrap justify-center mb-4 gap-2">
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
            highestStreak={highestStreak}
          />
        ) : (
          <div className="card-actions justify-center h-full ">
            {chattingWith.includes(_id) &&
            contactConversations.some((contact) =>
              contact.members.some((member) => member._id === _id)
            ) ? (
              <button
                className="btn btn-primary min-h-10 h-10 mt-auto"
                onClick={handleResumeChatting}
              >
                Resume Chatting
              </button>
            ) : (
              <button
                className="btn btn-neutral mt-auto"
                onClick={handleStartChatting}
              >
                Start Chatting
              </button>
            )}
          </div>
        )}
      </div>
      {highestStreak > 0 && (
        <div
          className={`flex flex-col items-center ${
            mobile && render && name === 'user-detail'
              ? 'static -mt-2 mb-2'
              : 'absolute bottom-3 left-2'
          }`}
        >
          <span className="flex items-center w-full flex-1 justify-center">
            <FireStreak streak={highestStreak} />
          </span>
          <div className="text-[13.5px] italic">Max Streak</div>
        </div>
      )}
    </div>
  );
};

export default Contact;
