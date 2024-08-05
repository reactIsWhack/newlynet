import React from 'react';
import Modal from './ui/Modal';
import Contact from './ui/Contact';
import { useSelector } from 'react-redux';
import { selectPopup } from '../app/features/popup/popupSlice';
import CloseModal from './ui/CloseModal';

const UserDetails = ({ filter }) => {
  const { viewingUserData } = useSelector(selectPopup);

  return (
    <Modal modalType="user-detail">
      <CloseModal />
      <Contact
        {...viewingUserData}
        contact={viewingUserData}
        renderConnectBtns={true}
        bg="bg-base-300"
        filter={filter}
      />
    </Modal>
  );
};

export default UserDetails;
