import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setIsLoggedIn } from '../app/features/user/userSlice';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_SERVER_URL;

const useRedirectUser = (blockInterstsPage) => {
  const { isLoggedIn } = useSelector(selectUser);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const getLoggedInStatus = async () => {
    const response = await axios.get(`${baseUrl}/api/auth/loginstatus`);
    console.log(`logged in: ${response.data}`);

    if (
      !response.data &&
      pathname !== '/signup' &&
      pathname !== '/select-interests'
    ) {
      navigate('/login');
    }

    if (
      (pathname === '/login' || pathname === '/signup') &&
      response.data &&
      isLoggedIn
    ) {
      navigate('/');
    }
    dispatch(setIsLoggedIn(response.data));
  };

  useEffect(() => {
    getLoggedInStatus();
  }, [isLoggedIn]);
};

export default useRedirectUser;
