import React from 'react';
import Modal from './ui/Modal';
import CloseModal from './ui/CloseModal';
import interestOptions from '../../data';

const CreateClubServerForm = () => {
  console.log(interestOptions.length);
  const firstOptionsSet = interestOptions.slice(0, 12).map((option, index) => {
    return <option key={index}>{option}</option>;
  });
  const secondOptionsSet = interestOptions
    .slice(12, interestOptions.length)
    .map((option, index) => {
      return <option key={index}>{option}</option>;
    });

  return (
    <Modal>
      <form>
        <h3 className="font-bold text-lg">Create a Club Server</h3>
        <input
          type="text"
          placeholder="Enter server name"
          className="input input-bordered w-full  mt-4"
        />
        <label className="label mt-2">Tags</label>
        <CloseModal />
        <div className="tags-container flex items-center gap-4 mt-3">
          <select className="select select-bordered w-full max-w-xs">
            <option disabled selected>
              # Tag 1
            </option>
            {firstOptionsSet}
          </select>
          <select className="select select-bordered w-full max-w-xs">
            <option disabled selected>
              # Tag 2
            </option>
            {secondOptionsSet}
          </select>
        </div>
        <div className="flex justify-center mt-6">
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClubServerForm;
