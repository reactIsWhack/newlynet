import React from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../../app/features/clubChat/clubChatSlice';
import { format, add } from 'date-fns';

const ClubChatStats = () => {
  const { members, activatedAt, topic } = useSelector(selectClubChat);

  let startingTime;
  let endingTime;
  if (activatedAt) {
    startingTime = format(new Date(activatedAt), 'h:mm a');
    const endingDate = add(new Date(activatedAt), { hours: 1 });
    endingTime = format(endingDate, 'h:mm a');
  }

  return (
    <>
      <div className="stats shadow h-28">
        <div className="stat max-w-32 px-4">
          <div className="stat-title">Members</div>
          <div className="stat-value text-3xl">{members.length}</div>
          <div className="stat-desc">
            {startingTime} - {endingTime}
          </div>
        </div>

        <div className="stat max-w-32 px-4 flex-1">
          <div className="stat-title text-center">Topic</div>
          <div className="stat-value text-3xl text-center w-full">{topic}</div>
        </div>
        <div className="stat max-w-32 px-4">
          <div className="stat-title">Schedule</div>
          <div className="stat-value text-3xl">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
    </>
  );
};

export default ClubChatStats;
