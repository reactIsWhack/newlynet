import { useState, useEffect } from 'react';
import useRedirectUser from '../hooks/useRedirectUser';
import Navbar from '../components/Navbar';
import PrimaryUserCard from '../components/PrimaryUserCard';
import HomeMainContent from '../components/HomeMainContent';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import useDetectMobile from '../hooks/useDetectMobile';
import useListenMessages from '../hooks/useListenMessages';
import useListenNotifications from '../hooks/useListenNotifications';

const Home = () => {
  useRedirectUser();
  useListenNotifications();

  const mobile = useDetectMobile();
  const { isLoading } = useSelector(selectUser);

  return (
    <div>
      <Navbar />
      <div className={`py-8 ${!mobile ? 'px-12' : ''} flex gap-12 items-start`}>
        {!mobile && (
          <div className="sticky primary-user-card">
            <PrimaryUserCard />
          </div>
        )}
        <HomeMainContent />
        {!mobile && <div className="home-right w-1/4"></div>}
      </div>{' '}
    </div>
  );
};

export default Home;
