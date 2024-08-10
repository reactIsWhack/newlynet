import React from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../../app/features/clubChat/clubChatSlice';
import { format, add } from 'date-fns';
import { useSocket } from '../../context/SocketContext';

const ClubChatStats = () => {
  const { members, activatedAt, topic, nextTopic } =
    useSelector(selectClubChat);
  const { usersInClubChat } = useSocket();

  let startingTime;
  let endingTime;
  let futureEndingTime;
  if (activatedAt) {
    startingTime = format(new Date(activatedAt), 'h:mm a');
    const endingDate = add(new Date(activatedAt), { hours: 1 });
    const futureEndingDate = add(new Date(endingDate), { hours: 1 });
    endingTime = format(endingDate, 'h:mm a');
    futureEndingTime = format(futureEndingDate, 'h:mm a');
  }

  let truncatedNextTopic = nextTopic;
  if (nextTopic.length > 14) {
    truncatedNextTopic = nextTopic.substring(0, 14) + '...';
  }

  return (
    <>
      <div className="stats shadow h-28 w-full overflow-hidden flex">
        <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
          <div className="stat-title">Members</div>
          <div className="stat-value text-3xl">{members.length}</div>
          <div className="stat-desc">
            {startingTime} - {endingTime}
          </div>
        </div>

        <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
          <div className="stat-title text-center w-full ">Online Users</div>
          <div className="stat-value text-3xl text-center w-full">
            {usersInClubChat.length}
          </div>
        </div>
        <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
          <div className="stat-title">Schedule</div>
          <div className="stat-value text-lg font-normal">
            {futureEndingTime}
          </div>
          <div
            className="stat-desc text-[13px] tooltip relative text-left"
            data-tip={nextTopic}
          >
            {truncatedNextTopic}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubChatStats;
