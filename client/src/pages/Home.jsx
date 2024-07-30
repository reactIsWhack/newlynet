import React from 'react';
import useRedirectUser from '../hooks/useRedirectUser';

const Home = () => {
  useRedirectUser();

  return <div>Home</div>;
};

export default Home;
