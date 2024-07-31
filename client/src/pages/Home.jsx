import React from 'react';
import useRedirectUser from '../hooks/useRedirectUser';
import Navbar from '../components/Navbar';
import PrimaryUserCard from '../components/PrimaryUserCard';

const Home = () => {
  useRedirectUser();

  return (
    <div>
      <Navbar />
      <div className="py-8 px-12">
        <PrimaryUserCard />
      </div>{' '}
      {/* home page container */}
    </div>
  );
};

export default Home;
