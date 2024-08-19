import { useState, useEffect } from 'react';
import useRedirectUser from '../hooks/useRedirectUser';
import Navbar from '../components/Navbar';
import PrimaryUserCard from '../components/PrimaryUserCard';
import HomeMainContent from '../components/HomeMainContent';
import useDetectMobile from '../hooks/useDetectMobile';
import useListenNotifications from '../hooks/useListenNotifications';
import useUpdateStreak from '../hooks/useUpdateStreak';
import ClubChatStats from '../components/ui/ClubChatStats';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import ClubServerMenu from '../components/ui/ClubServerMenu';
import { selectPopup, setRenderModal } from '../app/features/popup/popupSlice';
import CreateClubServerForm from '../components/CreateClubServerForm';
import CustomServerCard from '../components/ui/CustomServerCard';
import ClubServerInfo from '../components/ClubServerInfo';

const Home = ({ filter, setFilter }) => {
  useRedirectUser();
  useListenNotifications();
  useUpdateStreak();

  const mobile = useDetectMobile();
  const { school } = useSelector(selectUser);
  const { clubChatLoading, serverId, customClubServers } =
    useSelector(selectClubChat);
  const {
    renderModal: { render, name },
  } = useSelector(selectPopup);
  const dispatch = useDispatch();
  const renderClubServerInfo = window.screen.width > 1000;

  return (
    <div>
      <Navbar />
      <div
        className={`py-8 ${
          !mobile ? 'px-6' : 'overflow-x-hidden'
        } flex gap-12 items-start max-[550px]:pt-2 max-[1100px]:px-3 max-[550px]:px-0`}
      >
        {!mobile && window.screen.width > 1100 && (
          <div className="sticky primary-user-card">
            <PrimaryUserCard />
          </div>
        )}
        <HomeMainContent filter={filter} setFilter={setFilter} />
        {!mobile && renderClubServerInfo && (
          <div className="home-right w-1/3 -ml-4 sticky py-4">
            <h2 className="mb-3 text-lg text-center my-0">
              Main Club Server at {school?.formattedName}
            </h2>
            {clubChatLoading && !serverId ? (
              <div className="flex justify-center mt-4">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ClubServerInfo />
              </div>
            )}
          </div>
        )}
      </div>{' '}
      {render && name === 'create-server' && <CreateClubServerForm />}
    </div>
  );
};

export default Home;
