import { useState, useEffect } from 'react';

const useDetectMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth <= 550);

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 500);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return mobile;
};

export default useDetectMobile;
