import React, { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonNewStudents,
  resetStudents,
  selectUser,
} from '../app/features/user/userSlice';
import MemberCard from './ui/MemberCard';
import { IoMdAddCircleOutline } from 'react-icons/io';
import {
  createChat,
  getConversations,
  resetConversations,
  selectChats,
  setSelectedChat,
} from '../app/features/chats/chatSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setRenderModal } from '../app/features/popup/popupSlice';
import CloseModal from './ui/CloseModal';

const CreateChatForm = ({ filter }) => {
  const [memberQuery, setMemberQuery] = useState('');
  const { contacts } = useSelector(selectUser);
  const [contactResults, setContactResults] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [renderFullList, setRenderFullList] = useState(false);
  const { chatFilter, err } = useSelector(selectChats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const value = e.target.value;
    await setMemberQuery(value);

    const results = contacts.filter((contact) => {
      if (
        value &&
        !addedMembers.some((m) => m._id === contact._id) &&
        ((contact.firstName.toLowerCase().indexOf(value[0].toLowerCase()) ===
          0 &&
          contact.firstName.toLowerCase().includes(value)) ||
          (contact.lastName.toLowerCase().indexOf(value[0].toLowerCase()) ===
            0 &&
            contact.lastName.toLowerCase().includes(value)))
      ) {
        return contact;
      }
    });
    setContactResults(results);
  };

  const handleClick = (e) => {
    setAddedMembers((prev) => [
      ...prev,
      contactResults.find((c) => c._id === e.target.id),
    ]);
    setContactResults([]);
    setMemberQuery('');
    renderFullList && setRenderFullList(false);
    document.getElementById('contact-input').focus();
  };

  const resultOption = contactResults.map((result, index) => (
    <div
      key={index}
      className="px-3 py-2 cursor-pointer text-white hover:bg-gray-600"
      id={result._id}
      onClick={handleClick}
    >
      {result.firstName + ' ' + result.lastName}
    </div>
  ));

  const memberCard = addedMembers.map((member, index) => {
    return (
      <MemberCard
        key={index}
        name={member?.firstName + ' ' + member?.lastName}
        setAddedMembers={setAddedMembers}
        id={member?._id}
      />
    );
  });

  const renderAllContacts = () => {
    const contactsCopy = [
      ...contacts.filter((c) => !addedMembers.some((m) => m._id === c._id)),
    ];
    setContactResults(
      contactsCopy.sort((a, b) => a.firstName.localeCompare(b.firstName))
    );
    setRenderFullList(true);
  };
  const hideFullList = () => {
    setContactResults([]);
    setRenderFullList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addedMembers)
      return toast.error('Please add at least one chat member');

    await dispatch(createChat({ chatData: { members: addedMembers } })).then(
      async (result) => {
        if (!result.meta.rejectedWithValue) {
          dispatch(setRenderModal(false));

          if (result.payload.chatType !== chatFilter) {
            dispatch(resetConversations());
            await dispatch(getConversations(result.payload.chatType));
            navigate(`/chats/${result.payload._id}`);
            dispatch(resetStudents());
            dispatch(getCommonNewStudents({ filter, cursor: '' }));
          }
        }
      }
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setAddedMembers([]);
        setMemberQuery('');
        setContactResults([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Modal>
      <>
        <h3 className="font-bold text-lg">Create a chat</h3>

        <form className="min-h-24 max-h-72" onSubmit={handleSubmit}>
          <div className="flex items-center border-b py-3">
            <div className="flex relative flex-wrap items-center flex-1">
              <div className="mr-2">To:</div>
              {memberCard}
              <input
                type="text"
                className="bg-transparent outline-none border-none flex-1 ml-2"
                onChange={handleChange}
                value={memberQuery}
                id="contact-input"
                autoComplete="off"
              />
            </div>
            <IoMdAddCircleOutline
              size={20}
              cursor="pointer"
              fill="#0ea5e9"
              onClick={renderAllContacts}
            />
          </div>
          <CloseModal />
          <div className="bg-gray-800 w-full rounded-md shadow-md z-10 mt-1 max-h-52 overflow-auto">
            {renderFullList && (
              <span
                className="pl-3 cursor-pointer hover:underline text-sky-500"
                onClick={hideFullList}
              >
                Cancel
              </span>
            )}
            {resultOption}
          </div>

          <div className="flex justify-center mt-4">
            <button className="btn btn-active btn-primary min-h-9 h-9">
              Create
            </button>
          </div>
        </form>
      </>
    </Modal>
  );
};

export default CreateChatForm;
