import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import InterestDisplayBtn from './ui/InterestDisplayBtn';
import editIcon from '../assets/editIcon.svg';
import Badge from './ui/Badge';
import { useNavigate } from 'react-router-dom';

const PrimaryUserCard = () => {
  const {
    firstName,
    lastName,
    school,
    grade,
    interests,
    profilePicture,
    socialMediaInfo,
  } = useSelector(selectUser);
  const navigate = useNavigate();

  const interestDisplayBtn = interests.map((interest, index) => {
    return <InterestDisplayBtn interest={interest} key={index} />;
  });
  const hasSocialMedia =
    socialMediaInfo?.snapchat || socialMediaInfo?.instagram;
  let socialMediaTag;

  if (socialMediaInfo) {
    socialMediaTag = Object.values(socialMediaInfo).map((value, index) => {
      if (value)
        return (
          <Badge
            key={index}
            text={value}
            label={Object.keys(socialMediaInfo)[index]}
          />
        );
    });
  }

  return (
    <div className="card bg-base-100 w-[18.5rem] shadow-xl">
      <figure className="h-24">
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
        <div className="flex flex-col items-center gap-3 -my-1">
          <h3 className="text-base">Social Media Info</h3>
          {hasSocialMedia ? (
            <div className="flex gap-2 items-center flex-wrap">
              {socialMediaTag}
            </div>
          ) : (
            <div className="text-sm">
              No social media info, add in settings.
            </div>
          )}
        </div>
        <div className="divider my-0"></div>
        <div className="my-2 flex items-center flex-wrap justify-center gap-2">
          <img
            src={editIcon}
            className="h-6 cursor-pointer"
            onClick={() => navigate('/settings')}
          />
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
