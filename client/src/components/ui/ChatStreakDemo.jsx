import React from 'react';
import { FaFire } from 'react-icons/fa6';
import FireStreak from './FireStreak';

const ChatStreakDemo = () => {
  return (
    <div className="flex items-center gap-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <FireStreak streak={10} />
        </div>
        <div className="text-center text-base">Level 1</div>
        <div className="text-center">(0-10)</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <FireStreak streak={20} />
        </div>
        <div className="text-center text-base">Level 2</div>
        <div className="text-center">(10-20)</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <FireStreak streak={30} />
        </div>
        <div className="text-center text-base">Level 3</div>
        <div className="text-center">(30+)</div>
      </div>
    </div>
  );
};

export default ChatStreakDemo;
