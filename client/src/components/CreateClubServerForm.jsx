import React, { useState } from 'react';
import Modal from './ui/Modal';
import CloseModal from './ui/CloseModal';
import { interestOptions } from '../../data.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCustomClubServer,
  selectClubChat,
  setClubChatFilter,
} from '../app/features/clubChat/clubChatSlice';
import { setRenderModal } from '../app/features/popup/popupSlice';

const CreateClubServerForm = () => {
  const [formData, setFormData] = useState({
    serverName: '',
    firstTag: 'Social',
    secondTag: '',
  });
  const dispatch = useDispatch();
  const { clubChatLoading } = useSelector(selectClubChat);

  const optionsList = interestOptions.map((option, index) => {
    return (
      <option key={index} id="option-1">
        {option}
      </option>
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reqData = {
      serverName: formData.serverName,
      tags: [formData.firstTag, formData.secondTag].filter(
        (item) => item !== ''
      ),
    };

    dispatch(createCustomClubServer(reqData)).then((res) => {
      if (!res.meta.rejectedWithValue) {
        dispatch(setClubChatFilter('personal'));
        dispatch(setRenderModal({ render: false, name: '' }));
      }
    });
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit}>
        <h3 className="font-bold text-lg">Create a Club Server</h3>
        <input
          type="text"
          placeholder="Enter server name"
          className="input input-bordered w-full mt-4"
          value={formData.serverName}
          name="serverName"
          onChange={handleChange}
        />
        <label className="label mt-2">Tags (only 1 needed)</label>
        <CloseModal />
        <div className="tags-container flex items-center gap-4 mt-3">
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={handleChange}
            name="firstTag"
            value={formData.firstTag}
          >
            <option>Social</option>
            {optionsList}
          </select>
          <select
            className="select select-bordered w-full max-w-xs"
            name="secondTag"
            onChange={handleChange}
          >
            <option disabled selected>
              # Tag 2
            </option>
            {optionsList}
          </select>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className={`btn btn-primary ${clubChatLoading ? 'disabled' : ''}`}
            disabled={clubChatLoading}
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClubServerForm;
