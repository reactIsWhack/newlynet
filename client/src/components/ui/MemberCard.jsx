import React from 'react';
import { IoIosClose } from 'react-icons/io';

const MemberCard = ({ name, setAddedMembers, id }) => {
  return (
    <div
      className=" flex items-center border border-sky-500 rounded-lg min-h-8 h-8 px-2"
      onClick={(e) => e.preventDefault()}
    >
      <span className="text-sky-500 font-medium text-sm">{name}</span>
      <span
        className="text-2xl ml-2 -mt-1 text-white cursor-pointer"
        id={id}
        onClick={(e) =>
          setAddedMembers((prev) =>
            prev.filter((item) => item._id !== e.target.id)
          )
        }
      >
        -
      </span>
    </div>
  );
};

export default MemberCard;
