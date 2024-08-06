import React from 'react';
import { FaInstagram, FaSnapchatGhost } from 'react-icons/fa';

const Badge = ({ text, label }) => {
  const icon = label === 'Insta' ? <FaInstagram /> : <FaSnapchatGhost />;
  return (
    <div className="badge badge-primary flex items-center gap-2 p-3 rounded-full cursor-default">
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default Badge;
