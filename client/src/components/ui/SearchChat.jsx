import React from 'react';
import { FaPlus } from 'react-icons/fa6';

const SearchChat = () => {
  return (
    <div className="flex items-center gap-4">
      <form className="flex-1">
        <input
          type="text"
          placeholder="Search a chat..."
          className="input input-bordered rounded-full w-full"
        />
      </form>
      <button className="btn btn-circle bg-sky-500 text-white">
        <FaPlus size={20} />
      </button>
    </div>
  );
};

export default SearchChat;
