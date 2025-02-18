import React from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import Contact from '../components/ui/Contact';
import useRedirectUser from '../hooks/useRedirectUser';
import useListenMessages from '../hooks/useListenMessages';
import useListenNotifications from '../hooks/useListenNotifications';
import useUpdateStreak from '../hooks/useUpdateStreak';
import useGetData from '../hooks/useGetData';

const Contacts = ({ filter }) => {
  useRedirectUser();
  useListenNotifications();
  useUpdateStreak();

  const { contacts } = useSelector(selectUser);
  const contactCard = contacts.map((contact) => {
    return (
      <Contact
        {...contact}
        key={contact._id}
        contact={contact}
        renderConnectBtns={false}
        bg="bg-base-100"
        filter={filter}
      />
    );
  });

  return (
    <>
      <Navbar />
      <div className="p-8 max-[550px]:p-3">
        <h2 className="text-xl mb-6">Contacts</h2>
        <div className="grid grid-cols-3 gap-x-8 gap-y-8 max-[1100px]:grid-cols-2 max-[550px]:grid-cols-1 2xl:grid-cols-4">
          {contactCard}
        </div>
      </div>
    </>
  );
};

export default Contacts;
