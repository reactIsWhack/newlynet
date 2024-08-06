import React from 'react';
import { FaInstagram, FaSnapchatGhost } from 'react-icons/fa';

const Badge = ({ text, label }) => {
  const icon = label === 'instagram' ? <FaInstagram /> : <FaSnapchatGhost />;
  const platform =
    label === 'instagram' ? 'Instagram Username' : 'Snapchat Username';

  return (
    <div className="tooltip tooltip-bottom" data-tip={platform}>
      <div className="badge badge-primary flex items-center gap-2 p-3 rounded-full cursor-default">
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Badge;
