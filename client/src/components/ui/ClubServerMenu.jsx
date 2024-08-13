import React from 'react';
import { useSelector } from 'react-redux';
import { selectClubChat } from '../../app/features/clubChat/clubChatSlice';

const ClubServerMenu = () => {
  const { customClubServers } = useSelector(selectClubChat);

  return (
    <div role="tablist" className="tabs tabs-lifted mt-2">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Suggested Servers"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Tab content 1
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Invites"
        defaultChecked
      />

      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        INVITES
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="My Servers"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        {customClubServers.length > 0 ? null : <span>No servers found</span>}
      </div>
    </div>
  );
};

export default ClubServerMenu;
