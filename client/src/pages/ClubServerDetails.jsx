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
import { selectPopup } from '../app/features/popup/popupSlice';
import InviteForm from '../components/InviteForm';
import useListenMessages from '../hooks/useListenMessages';
import useListenNotifications from '../hooks/useListenNotifications';
import CreateClubServerForm from '../components/CreateClubServerForm';
import useGetData from '../hooks/useGetData';

const ClubServerInfo = () => {
  useRedirectUser();
  useListenMessages();
  useListenNotifications();

  const [renderSidebar, setRenderSidebar] = useState(true);
  const { serverInvites } = useSelector(selectUser);
  const mobile = useDetectMobile();
  const { suggestedClubServers } = useSelector(selectClubChat);
  const {
    renderModal: { render, name },
  } = useSelector(selectPopup);

  const filteredSuggestions = suggestedClubServers.filter(
    (suggestion) =>
      !serverInvites.some((invite) => invite.server?._id === suggestion._id)
  );
  const customServerCard = filteredSuggestions.map((server) => {
    return <CustomServerCard key={server._id} {...server} />;
  });

  let serverInviteCard;
  if (serverInvites.length > 0) {
    serverInviteCard = serverInvites.map((serverInvite) => {
      return (
        <CustomServerCard
          key={serverInvite.server?._id}
          {...serverInvite.server}
          sender={serverInvite.sender}
        />
      );
    });
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden gap-2">
        {(renderSidebar || !mobile) && (
          <ClubServerSidebar setRenderSidebar={setRenderSidebar} />
        )}
        <div className="flex-1 overflow-auto py-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h4 className="text-lg  font-medium">Server Invites</h4>
              {serverInvites.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                  {serverInvites.length}
                </span>
              )}
            </div>
            {mobile && (
              <IoArrowBack
                size={22}
                className="stroke-blue-400"
                cursor="pointer"
                onClick={() => setRenderSidebar(true)}
              />
            )}
          </div>
          {serverInvites.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[900px]:grid-cols-1 2xl:grid-cols-4">
              {serverInviteCard}
            </div>
          ) : (
            <span>No pending invites</span>
          )}
          <div className="divider"></div>
          <div className="mt-4">
            <h4 className="text-lg font-medium">Suggested Servers For You</h4>
            <div className="grid grid-cols-3 mt-4 gap-4 max-[1100px]:grid-cols-2 max-[900px]:grid-cols-1 2xl:grid-cols-4">
              {filteredSuggestions.length > 0 ? (
                customServerCard
              ) : (
                <span>No server suggestions</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {render && name === 'invite-form' && <InviteForm />}
      {render && name === 'create-server' && <CreateClubServerForm />}
    </div>
  );
};

export default ClubServerInfo;
