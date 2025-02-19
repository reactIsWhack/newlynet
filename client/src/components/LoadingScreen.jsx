import React from 'react';
import loadingScreenGif from '../assets/loading-screen.gif';

const LoadingScreen = () => {
  return (
    <div
      className="loading-screen flex items-center h-screen"
      id="loading-screen"
    >
      <span className="loading-message text-slate-800">Loading...</span>
      <img src={loadingScreenGif} />
    </div>
  );
};

export default LoadingScreen;
