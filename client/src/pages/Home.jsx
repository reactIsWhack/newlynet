import { useState, useEffect } from 'react';
import useRedirectUser from '../hooks/useRedirectUser';
import Navbar from '../components/Navbar';
import PrimaryUserCard from '../components/PrimaryUserCard';
import HomeMainContent from '../components/HomeMainContent';
import useDetectMobile from '../hooks/useDetectMobile';
import useListenNotifications from '../hooks/useListenNotifications';
import useUpdateStreak from '../hooks/useUpdateStreak';
import ClubChatStats from '../components/ui/ClubChatStats';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import { selectClubChat } from '../app/features/clubChat/clubChatSlice';
import ClubChatInfo from '../components/ui/ClubChatInfo';

const Home = ({ filter, setFilter }) => {
  useRedirectUser();
  useListenNotifications();
  useUpdateStreak();

  const mobile = useDetectMobile();
  const { school } = useSelector(selectUser);
  const { clubChatLoading, topic } = useSelector(selectClubChat);

  const loading = true;
  return (
    <div>
      <Navbar />
      <div
        className={`py-8 ${
          !mobile ? 'px-12' : ''
        } flex gap-12 items-start max-[550px]:pt-2`}
      >
        {!mobile && window.screen.width > 1000 && (
          <div className="sticky primary-user-card">
            <PrimaryUserCard />
          </div>
        )}
        <HomeMainContent filter={filter} setFilter={setFilter} />
        {!mobile && (
          <div className="home-right w-1/3 -ml-6 sticky py-4">
            <h2 className="mb-3 text-lg text-center my-0">
              Current club hour at {school?.formattedName}
            </h2>
            {clubChatLoading && !topic ? (
              <div className="flex justify-center mt-4">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                <ClubChatStats />
                <ClubChatInfo />
              </>
            )}
          </div>
        )}
      </div>{' '}
    </div>
  );
};

export default Home;
