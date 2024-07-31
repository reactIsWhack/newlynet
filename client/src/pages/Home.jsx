import { useState, useEffect } from 'react';
import useRedirectUser from '../hooks/useRedirectUser';
import Navbar from '../components/Navbar';
import PrimaryUserCard from '../components/PrimaryUserCard';
import HomeMainContent from '../components/HomeMainContent';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';

const Home = () => {
  useRedirectUser();
  const [mobile, setMobile] = useState(window.innerWidth <= 550);
  const { isLoading } = useSelector(selectUser);

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 500);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div
        className={`py-8 px-12 flex gap-12 items-start ${
          isLoading ? 'h-screen' : ''
        }`}
      >
        <div className="sticky primary-user-card">
          {!mobile && <PrimaryUserCard />}
        </div>
        <HomeMainContent />
        {!mobile && <div className="home-right w-1/4"></div>}
      </div>{' '}
    </div>
  );
};

export default Home;
