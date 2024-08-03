import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import InterestDisplayBtn from './ui/InterestDisplayBtn';
import editIcon from '../assets/editIcon.svg';

const PrimaryUserCard = () => {
  const { firstName, lastName, school, grade, interests, profilePicture } =
    useSelector(selectUser);

  const interestDisplayBtn = interests.map((interest, index) => {
    return <InterestDisplayBtn interest={interest} key={index} />;
  });

  return (
    <div className="card bg-base-100 w-72 shadow-xl">
      <figure className="h-32">
        <img
          src="https://www.businessworldit.com/wp-content/uploads/2018/12/4-Types-of-Business-Networking-Opportunities-to-Consider.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="card-body items-center py-6 px-8 relative">
        <img
          src={profilePicture}
          className="h-20 w-20 -mt-14 object-cover rounded-full border-2 border-gray-300"
        />
        <h2 className="card-title capitalize">{firstName + ' ' + lastName}</h2>
        {school && school.formattedName && (
          <p className="text-center">{`${school.formattedName} - ${grade}`}</p>
        )}
        <div className="divider my-0"></div>
        <div className="my-2 flex items-center flex-wrap justify-center gap-2">
          <img src={editIcon} className="h-6 cursor-pointer" />
          {interestDisplayBtn}
        </div>
        {/* <div className="card-actions justify-end mt-1">
          <button className="btn btn-primary">Some Btn</button>
        </div> */}
      </div>
    </div>
  );
};

export default PrimaryUserCard;
