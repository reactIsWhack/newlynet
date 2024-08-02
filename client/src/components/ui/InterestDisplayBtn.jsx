import React from 'react';

const InterestDisplayBtn = ({ interest }) => {
  return (
    <button className="btn btn-outline btn-primary min-h-8 h-8 whitespace-nowrap">
      {interest}
    </button>
  );
};

export default InterestDisplayBtn;
