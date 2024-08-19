import React from 'react';
import ClubChatStats from './ui/ClubChatStats';
import ClubServerMenu from './ui/ClubServerMenu';
import { useDispatch, useSelector } from 'react-redux';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import CustomServerCard from './ui/CustomServerCard';
import { IoIosCreate } from 'react-icons/io';
import { setRenderModal } from '../app/features/popup/popupSlice';
import { selectUser } from '../app/features/user/userSlice';

const ClubServerInfo = () => {
  const {
    customClubServers,
    clubChatFilter,
    clubChatLoading,
    suggestedClubServers,
  } = useSelector(selectClubChat);
  const dispatch = useDispatch();
  const { serverInvites } = useSelector(selectUser);

  const contentToRender = () => {
    if (clubChatFilter === 'suggested') {
      return suggestedClubServers.length > 0 ? (
        suggestedClubServers.slice(0, 5).map((server) => {
          return <CustomServerCard key={server._id} {...server} />;
        })
      ) : (
        <span>No server suggestions.</span>
      );
    } else if (clubChatFilter === 'invites') {
      let serverInviteCard;
      if (serverInvites.length > 0) {
        serverInviteCard = serverInvites.map((serverInvite) => {
          return (
            <CustomServerCard
              key={serverInvite.server._id}
              {...serverInvite.server}
              sender={serverInvite.sender}
            />
          );
        });
      }
      return serverInvites.length > 0 ? (
        serverInviteCard
      ) : (
        <span>No pending server invites</span>
      );
    } else {
      return customClubServers.length > 0 ? (
        customClubServers.slice(0, 5).map((server) => {
          return (
            <CustomServerCard
              key={server._id}
              {...server}
              renderUnreadCount={true}
            />
          );
        })
      ) : (
        <span>You are not a part of any servers currently.</span>
      );
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

      {clubChatLoading ? (
        <div className="flex justify-center mt-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center overflow-auto max-h-[380px] max-[1100px]:max-h-[900px] 2xl:pb-4 2xl:max-h-[550px]">
          <div className="flex  items-center mb-3 gap-3 mt-5">
            <ClubServerMenu />
            <IoIosCreate size={23} cursor="pointer" onClick={handleClick} />
          </div>
          {contentToRender()}
        </div>
      )}
    </>
  );
};

export default ClubServerInfo;
