import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import { selectPopup } from '../../app/features/popup/popupSlice';
import { FaCheck } from 'react-icons/fa6';
import { selectChats } from '../../app/features/chats/chatSlice';

const ConnectBtns = () => {
  const { contacts, chattingWith } = useSelector(selectUser);
  const { viewingUserData } = useSelector(selectPopup);
  const { contactConversations } = useSelector(selectChats);

  const inContacts = contacts.some(
    (contact) => contact._id === viewingUserData._id
  );
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {chattingWith.includes(viewingUserData._id) &&
      contactConversations.some((contact) =>
        contact.members.some((member) => member._id === viewingUserData._id)
      ) ? (
        <button className="btn btn-info min-h-11 h-11">Resume Chatting</button>
      ) : (
        <button className="btn btn-info min-h-11 h-11">Start Chatting</button>
      )}
      {inContacts ? (
        <button className="btn btn-outline btn-success min-h-11 h-11 pointer-events-none">
          <FaCheck />
          Contact
        </button>
      ) : (
        <button className="btn btn-secondary min-h-11 h-11">Add Contact</button>
      )}
    </div>
  );
};

export default ConnectBtns;
