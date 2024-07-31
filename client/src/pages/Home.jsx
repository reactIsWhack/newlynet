import React from 'react';
import useRedirectUser from '../hooks/useRedirectUser';
import Navbar from '../components/Navbar';

const Home = () => {
  useRedirectUser();

  return (
    <div>
      <Navbar />
      <h1>Home</h1>
    </div>
  );
};

export default Home;
