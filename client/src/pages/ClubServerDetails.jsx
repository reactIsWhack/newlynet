import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import useRedirectUser from '../hooks/useRedirectUser';
import ClubServerSidebar from '../components/ClubServerSidebar';
import useDetectMobile from '../hooks/useDetectMobile';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { IoArrowBack } from 'react-icons/io5';

const ClubServerInfo = () => {
  useRedirectUser();
  const [renderSidebar, setRenderSidebar] = useState(true);
  const { serverInvites } = useSelector(selectUser);
  const mobile = useDetectMobile();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden gap-6">
        {(renderSidebar || !mobile) && (
          <ClubServerSidebar setRenderSidebar={setRenderSidebar} />
        )}
        <div className="flex-1 overflow-auto py-6 max-[550px]:px-4">
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
        </div>
      </div>
    </div>
  );
};

export default ClubServerInfo;
