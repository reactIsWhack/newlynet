import React from 'react';

const InterestDisplayBtn = ({ interest, includeMargin }) => {
  return (
    <button
      className={`btn btn-outline btn-primary min-h-8 h-8 whitespace-nowrap ${
        includeMargin ? 'mx-1' : ''
      }`}
    >
      {interest}
    </button>
  );
};

export default InterestDisplayBtn;
