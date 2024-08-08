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
    const response = await axios.get(
      `http://localhost:4000/api/auth/loginstatus`
    );

    dispatch(setIsLoggedIn(response.data));

    if (!response.data && pathname !== '/signup') {
      navigate('/login');
    }

    if ((pathname === '/login' || pathname === '/signup') && response.data)
      navigate('/');

    if (!blockInterstsPage && pathname === '/select-interests') {
      navigate('/settings');
    }
  };

  useEffect(() => {
    getLoggedInStatus();
  }, [isLoggedIn, pathname]);
};

export default useRedirectUser;
