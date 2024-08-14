import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import useRedirectUser from '../hooks/useRedirectUser';
import ClubServerSidebar from '../components/ClubServerSidebar';
import useDetectMobile from '../hooks/useDetectMobile';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { IoArrowBack } from 'react-icons/io5';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import CustomServerCard from '../components/ui/CustomServerCard';

const ClubServerInfo = () => {
  useRedirectUser();
  const [renderSidebar, setRenderSidebar] = useState(true);
  const { serverInvites } = useSelector(selectUser);
  const mobile = useDetectMobile();
  const { suggestedClubServers } = useSelector(selectClubChat);

  const customServerCard = suggestedClubServers.map((server) => {
    return <CustomServerCard key={server._id} {...server} />;
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden gap-2">
        {(renderSidebar || !mobile) && (
          <ClubServerSidebar setRenderSidebar={setRenderSidebar} />
        )}
        <div className="flex-1 overflow-auto py-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg  font-medium">Server Invites</h4>
            {mobile && (
              <IoArrowBack
                size={22}
                className="stroke-blue-400"
                cursor="pointer"
                onClick={() => setRenderSidebar(true)}
              />
            )}
          </div>
          {serverInvites.length > 0 ? null : <span>No pending invites</span>}
          <div className="divider"></div>
          <div className="mt-4">
            <h4 className="text-lg font-medium">Suggested Servers For You</h4>
            <div className="grid grid-cols-3 mt-4 gap-4">
              {suggestedClubServers.length > 0 ? (
                customServerCard
              ) : (
                <span>No server suggestions</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubServerInfo;
