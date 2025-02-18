import React from 'react';
import ClubChatStats from './ui/ClubChatStats';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import ClubServerItem from './ui/ClubServerItem';
import useDetectMobile from '../hooks/useDetectMobile';
import { IoIosCreate } from 'react-icons/io';
import { setRenderModal } from '../app/features/popup/popupSlice';

const ClubServerSidebar = ({ setRenderSidebar }) => {
  const { school, serverInvites, unreadClubChats } = useSelector(selectUser);
  const { customClubServers, chats } = useSelector(selectClubChat);
  const mobile = useDetectMobile();
  const dispatch = useDispatch();

  const unreadServers = unreadClubChats.filter(
    (server) => !chats.some((chat) => chat._id === server.chat._id)
  );
  const customCard = customClubServers.map((server) => {
    return <ClubServerItem key={server._id} {...server} server={server} />;
  });

  const handleClick = async () => {
    await dispatch(setRenderModal({ render: true, name: 'create-server' }));
    document.getElementById('my_modal_3').showModal();
  };

  return (
    <div className="border-r border-slate-400 p-6 max-w-[380px]">
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
          <div className="flex items-center mb-3 gap-3 justify-center">
            <h3 className="text-center text-[17px] font-semi-bold">
              Your club servers
            </h3>
            <IoIosCreate size={23} cursor="pointer" onClick={handleClick} />
          </div>

          {customCard}
        </div>
      </div>
    </div>
  );
};

export default ClubServerSidebar;
