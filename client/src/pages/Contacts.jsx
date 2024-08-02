import React from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import Contact from '../components/ui/Contact';
import useRedirectUser from '../hooks/useRedirectUser';

const Contacts = () => {
  useRedirectUser();

  const { contacts } = useSelector(selectUser);
  const contactCard = contacts.map((contact) => {
    return <Contact {...contact} key={contact._id} contact={contact} />;
  });

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-xl mb-6">Contacts</h2>
        <div className="grid grid-cols-3 gap-y-8">{contactCard}</div>
      </div>
    </>
  );
};

export default Contacts;
