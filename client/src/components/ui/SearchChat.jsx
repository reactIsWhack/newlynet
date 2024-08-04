import React from 'react';
import { FaPlus } from 'react-icons/fa6';

const SearchChat = ({ setRenderModal }) => {
  const handleClick = async () => {
    await setRenderModal(true);
    document.getElementById('my_modal_3').showModal();
  };

  return (
    <div className="flex items-center gap-4">
      <form className="flex-1">
        <input
          type="text"
          placeholder="Search a chat..."
          className="input input-bordered rounded-full w-full"
        />
      </form>
      <button
        className="btn btn-circle bg-sky-500 text-white"
        onClick={handleClick}
      >
        <FaPlus size={20} />
      </button>
    </div>
  );
};

export default SearchChat;
