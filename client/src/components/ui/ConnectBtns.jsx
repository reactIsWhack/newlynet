import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, selectUser } from '../../app/features/user/userSlice';
import {
  selectPopup,
  setRenderModal,
} from '../../app/features/popup/popupSlice';
import { FaCheck } from 'react-icons/fa6';
import {
  overideChats,
  selectChats,
  setChatFilter,
} from '../../app/features/chats/chatSlice';

const ConnectBtns = ({ handleResumeChatting, handleStartChatting }) => {
  const { contacts, chattingWith } = useSelector(selectUser);
  const { viewingUserData } = useSelector(selectPopup);
  const { contactConversations } = useSelector(selectChats);
  const dispatch = useDispatch();

  const inContacts = contacts.some(
    (contact) => contact._id === viewingUserData._id
  );

  const resumeChatting = () => {
    dispatch(setRenderModal({ render: false, name: '' }));
    dispatch(setChatFilter('individual'));
    dispatch(overideChats(contactConversations));
    handleResumeChatting();
  };

  const startChatting = async (e) => {
    dispatch(setRenderModal({ render: false, name: '' }));
    await handleStartChatting(e);
  };

  const contactAdd = (e) => {
    e.target.classList.add('disabled');
    dispatch(addContact(viewingUserData._id));
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {chattingWith.includes(viewingUserData._id) &&
      contactConversations.some((contact) =>
        contact.members.some((member) => member._id === viewingUserData._id)
      ) ? (
        <button className="btn btn-info min-h-11 h-11" onClick={resumeChatting}>
          Resume Chatting
        </button>
      ) : (
        <button className="btn btn-info min-h-11 h-11" onClick={startChatting}>
          Start Chatting
        </button>
      )}
      {inContacts ? (
        <button className="btn btn-outline btn-success min-h-11 h-11 pointer-events-none">
          <FaCheck />
          Contact
        </button>
      ) : (
        <button
          className="btn btn-secondary min-h-11 h-11"
          onClick={contactAdd}
        >
          Add Contact
        </button>
      )}
    </div>
  );
};

export default ConnectBtns;
