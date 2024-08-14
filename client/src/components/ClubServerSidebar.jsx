import React from 'react';
import ClubChatStats from './ui/ClubChatStats';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import ClubServerItem from './ui/ClubServerItem';
import useDetectMobile from '../hooks/useDetectMobile';

const ClubServerSidebar = ({ setRenderSidebar }) => {
  const { school, serverInvites } = useSelector(selectUser);
  const { customClubServers } = useSelector(selectClubChat);
  const mobile = useDetectMobile();

  const customCard = customClubServers.map((server) => {
    return <ClubServerItem key={server._id} {...server} server={server} />;
  });

  return (
    <div className="border-r border-slate-400 p-6">
      <div className="flex-col flex">
        <h3 className="text-center mb-4 font-semi-bold text-[17px]">
          Club Server of {school?.formattedName}
        </h3>
        <ClubChatStats />
        {mobile && (
          <div className="text-center mt-3 flex items-center gap-3 justify-center">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setRenderSidebar(false)}
            >
              See club server feed and invites
            </span>
            {serverInvites.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                {serverInvites.length}
              </span>
            )}
          </div>
        )}
        <div className="divider mb-2 mt-3 max-[550px]:mt-2"></div>
        <div className="overflow-auto max-h-96">
          <h3 className="text-center text-[17px] font-semi-bold mb-3">
            Your club servers
          </h3>
          {customCard}
        </div>
      </div>
    </div>
  );
};

export default ClubServerSidebar;
