import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClubChat,
  setClubChatFilter,
} from '../../app/features/clubChat/clubChatSlice';
import { IoIosCreate } from 'react-icons/io';

const ClubServerMenu = () => {
  const { clubChatFilter } = useSelector(selectClubChat);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setClubChatFilter(e.target.value));
  };

  return (
    <>
      <div className="join " onChange={handleChange}>
        <input
          className="join-item btn"
          type="radio"
          name="options"
          value="suggested"
          aria-label="Suggested"
          checked={clubChatFilter === 'suggested'}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          value="invites"
          aria-label="Invites"
          checked={clubChatFilter === 'invites'}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          value="personal"
          aria-label="My Servers"
          checked={clubChatFilter === 'personal'}
        />
      </div>
    </>
  );
};

export default ClubServerMenu;
