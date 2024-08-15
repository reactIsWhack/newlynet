import React, { useState } from 'react';
import CloseModal from './ui/CloseModal';
import Modal from './ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  createServerChannel,
  selectClubChat,
} from '../app/features/clubChat/clubChatSlice';
import { setRenderModal } from '../app/features/popup/popupSlice';

const CreateChannel = () => {
  const [channelName, setChannelName] = useState('');
  const { createChannelLoading } = useSelector(selectClubChat);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(createServerChannel(channelName)).then((res) => {
      if (!res.meta.rejectedWithValue) {
        dispatch(setRenderModal({ render: false, name: '' }));
      }
    });
  };

  return (
    <Modal>
      <>
        <h3 className="font-bold text-lg">Create a channel</h3>
        <CloseModal />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter channel name"
            className="input input-bordered w-full mt-3"
            maxLength={35}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <div className="flex justify-center">
            <button
              className={`btn btn-primary min-h-11 h-11 mt-4 ${
                createChannelLoading ? 'disabled' : ''
              }`}
              disabled={createChannelLoading}
            >
              Create
            </button>
          </div>
        </form>
      </>
    </Modal>
  );
};

export default CreateChannel;
