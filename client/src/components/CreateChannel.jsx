import React from 'react';
import CloseModal from './ui/CloseModal';
import Modal from './ui/Modal';

const CreateChannel = () => {
  return (
    <Modal>
      <>
        <h3 className="font-bold text-lg">Create a channel</h3>
        <CloseModal />
        <input
          type="text"
          placeholder="Enter channel name"
          className="input input-bordered w-full mt-3"
          maxLength={35}
        />
        <div className="flex justify-center">
          <button className="btn btn-primary min-h-11 h-11 mt-4">Create</button>
        </div>
      </>
    </Modal>
  );
};

export default CreateChannel;
