import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  joinClubChat,
  selectClubChat,
} from '../../app/features/clubChat/clubChatSlice';
import { add, differenceInMinutes } from 'date-fns';
import { selectUser } from '../../app/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';

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
  const { topic, activatedAt, members, clubChatLoading } =
    useSelector(selectClubChat);
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const [minutesRemaining, setMinutesRemaining] = useState(
    getMinutesUntilEnding(activatedAt)
  );
  const { userId, school } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();

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

  const join = async () => {
    await dispatch(joinClubChat()).then((res) => {
      navigate('/clubchat');
    });
  };
  const resumeClubHour = () => {
    navigate('/clubchat');
  };

  const inClubChat = members.find((member) => member._id === userId);

  return (
    <div className="card bg-base-100 text-neutral-content w-full mt-4 shadow-lg">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Topic: {topic}</h2>
        {!topic ? (
          <p>Loading...</p>
        ) : (
          <p>{minutesRemaining} minutes remaining</p>
        )}
        <div className="card-actions justify-end">
          {clubChatLoading ? (
            <span className="loading loading-spinner loading-lg mt-3"></span>
          ) : inClubChat ? (
            <button className="btn btn-primary mt-3" onClick={resumeClubHour}>
              Resume club hour
            </button>
          ) : (
            <button className="btn btn-primary mt-3" onClick={join}>
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubChatInfo;
