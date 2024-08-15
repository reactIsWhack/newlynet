import React from 'react';
import Modal from '../components/ui/Modal';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { selectPopup } from '../app/features/popup/popupSlice';
import CloseModal from './ui/CloseModal';
import InviteContactCard from './ui/InviteContactCard';

const InviteForm = () => {
  const { contacts } = useSelector(selectUser);
  const { viewingUserData } = useSelector(selectPopup);

  const contactsNotInServer = contacts.filter(
    (contact) =>
      !viewingUserData.members.some((member) => member._id === contact._id)
  );
  const inviteBtn = contactsNotInServer.map((contact) => {
    return <InviteContactCard key={contact._id} {...contact} />;
  });

  return (
    <Modal>
      <h3 className="font-medium text-[17px]">
        Invite Contacts to the Server!
      </h3>
      <div className="mt-1 max-h-96 overflow-auto flex flex-col">
        {contactsNotInServer.length > 0 ? (
          inviteBtn
        ) : (
          <span className="text-center w-full mt-2">
            All contacts in server
          </span>
        )}
      </div>
      <CloseModal />
    </Modal>
  );
};

export default InviteForm;
