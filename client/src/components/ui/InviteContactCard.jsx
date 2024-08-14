import React from 'react';

const InviteContactCard = ({ profilePicture, firstName, lastName }) => {
  return (
    <div className="bg-base-300 rounded-lg shadow-lg flex justify-between p-3 mt-3">
      <div className="flex items-center gap-2">
        <img src={profilePicture} className="h-9 rounded-full" />
        <span>
          {firstName} {lastName}
        </span>
      </div>
      <button className="btn btn-primary min-h-10 h-10">Invite</button>
    </div>
  );
};

export default InviteContactCard;
