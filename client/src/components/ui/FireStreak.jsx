import React from 'react';
import { FaFire } from 'react-icons/fa';
import styleChatStreak from '../../utils/styleChatStreak';

const FireStreak = ({ streak }) => {
  const fireStyles = styleChatStreak(streak);

  let fireRef = 'fire-gradient';
  if (streak > 10) fireRef = 'blue-fire-gradient';
  if (streak > 20) fireRef = 'purple-fire-gradient';

  return (
    <>
      <svg width="0" height="0">
        <linearGradient id="fire-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor={'#FF6F00'} offset="0%" />
          <stop stopColor={'#D32F2F'} offset="100%" />
        </linearGradient>
        <linearGradient
          id="blue-fire-gradient"
          x1="100%"
          y1="100%"
          x2="0%"
          y2="0%"
        >
          <stop stopColor={'#4A90E2'} offset="0%" />
          <stop stopColor={'#0033A0'} offset="100%" />
        </linearGradient>
        <linearGradient
          id="purple-fire-gradient"
          x1="100%"
          y1="100%"
          x2="0%"
          y2="0%"
        >
          <stop stopColor={'#7a6ded'} offset="0%" />
          <stop stopColor={'#591885'} offset="100%" />
        </linearGradient>
      </svg>

      <FaFire style={{ fill: `url(#${fireRef})` }} size={fireStyles.size} />
      <span className={`${fireStyles.textColor}`}>{streak}</span>
    </>
  );
};

export default FireStreak;
