import React from 'react';

const InterestDisplayBtn = ({ interest, includeMargin, preventDefault }) => {
  return (
    <button
      className={`btn btn-outline btn-primary min-h-8 h-8 whitespace-nowrap ${
        includeMargin ? 'mx-1' : ''
      }`}
      onClick={(e) => (preventDefault ? e.preventDefault() : null)}
    >
      {interest}
    </button>
  );
};

export default InterestDisplayBtn;
