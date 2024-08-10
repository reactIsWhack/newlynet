import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../../app/features/clubChat/clubChatSlice';
import { add, differenceInMinutes } from 'date-fns';

// Function to calculate minutes between now and ending time
const getMinutesUntilEnding = (activatedAt) => {
  // Define the endingDate as one hour after activatedAt
  const endingDate = add(new Date(activatedAt), { hours: 1 });

  // Get the current time
  const now = new Date();

  // Calculate the difference in minutes
  const minutesDifference = differenceInMinutes(endingDate, now);

  return minutesDifference;
};

const ClubChatInfo = () => {
  const { topic, activatedAt } = useSelector(selectClubChat);
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const [minutesRemaining, setMinutesRemaining] = useState(
    getMinutesUntilEnding(activatedAt)
  );

  useEffect(() => {
    // This effect runs every time the minute changes
    console.log('Minute has changed:', currentMinute);
    setMinutesRemaining(getMinutesUntilEnding(activatedAt));
  }, [currentMinute, minutesRemaining]); // Depend on currentMinute so it triggers when it changes

  useEffect(() => {
    const checkMinuteChange = () => {
      const now = new Date();
      const newMinute = now.getMinutes();

      if (newMinute !== currentMinute) {
        setCurrentMinute(newMinute);
      }
    };

    // Check the minute every 30 seconds
    const intervalId = setInterval(checkMinuteChange, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentMinute]);

  return (
    <div className="card bg-base-100 text-neutral-content w-96 mt-4 shadow-lg">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Topic: {topic}</h2>
        <p>{minutesRemaining} minutes remaining</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary mt-3">Join</button>
        </div>
      </div>
    </div>
  );
};

export default ClubChatInfo;
