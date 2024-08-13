import React from 'react';
import ClubChatStats from './ui/ClubChatStats';
import ClubServerMenu from './ui/ClubServerMenu';
import { useDispatch, useSelector } from 'react-redux';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import CustomServerCard from './ui/CustomServerCard';
import { IoIosCreate } from 'react-icons/io';
import { setRenderModal } from '../app/features/popup/popupSlice';

const ClubServerInfo = () => {
  const { customClubServers, clubChatFilter } = useSelector(selectClubChat);
  const dispatch = useDispatch();

  const contentToRender = () => {
    if (clubChatFilter === 'suggested') {
      return <span>Suggested Servers</span>;
    } else if (clubChatFilter === 'invites') {
      return <span>Invites</span>;
    } else {
      return customClubServers.slice(0, 2).map((server) => {
        return <CustomServerCard key={server._id} {...server} />;
      });
    }
  };

  const handleClick = async () => {
    await dispatch(setRenderModal({ render: true, name: 'create-server' }));
    document.getElementById('my_modal_3').showModal();
  };

  return (
    <>
      <ClubChatStats />
      <div className="divider -mb-2"></div>

      <h3 className="my-3">See all info at Club Server Page</h3>
      <div className="flex  items-center mb-3 gap-3">
        <ClubServerMenu />
        <IoIosCreate size={23} cursor="pointer" onClick={handleClick} />
      </div>
      {contentToRender()}
    </>
  );
};

export default ClubServerInfo;
