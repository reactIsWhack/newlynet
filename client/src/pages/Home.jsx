import { useState, useEffect } from 'react';
import useRedirectUser from '../hooks/useRedirectUser';
import Navbar from '../components/Navbar';
import PrimaryUserCard from '../components/PrimaryUserCard';
import HomeMainContent from '../components/HomeMainContent';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonNewStudents,
  selectUser,
} from '../app/features/user/userSlice';
import useDetectMobile from '../hooks/useDetectMobile';
import useListenMessages from '../hooks/useListenMessages';
import useListenNotifications from '../hooks/useListenNotifications';

const Home = ({ filter, setFilter }) => {
  useRedirectUser();
  useListenNotifications();

  const mobile = useDetectMobile();
  const { isLoading } = useSelector(selectUser);
  const dispatch = useDispatch();

  return (
    <div>
      <Navbar />
      <div className={`py-8 ${!mobile ? 'px-12' : ''} flex gap-12 items-start`}>
        {!mobile && window.screen.width > 1000 && (
          <div className="sticky primary-user-card">
            <PrimaryUserCard />
          </div>
        )}
        <HomeMainContent filter={filter} setFilter={setFilter} />
        {!mobile && <div className="home-right w-1/4"></div>}
      </div>{' '}
    </div>
  );
};

export default Home;
