import { useEffect } from 'react';
import {
  getCommonNewStudents,
  getUserProfile,
  selectUser,
  setFetchedInitialData,
} from '../app/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, selectChats } from '../app/features/chats/chatSlice';
import {
  getClubServer,
  getCustomClubServers,
  getSuggestedClubServers,
} from '../app/features/clubChat/clubChatSlice';

const useGetData = () => {
  const { isLoggedIn, initialDataFetched } = useSelector(selectUser);
  const { chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();

  const getData = async () => {
    if (isLoggedIn && !initialDataFetched) {
      dispatch(getUserProfile());
      await Promise.all([
        dispatch(getCommonNewStudents({ filter: 'grade', cursor: '' })),

        dispatch(getConversations(chatFilter)),
        dispatch(getClubServer()),
        dispatch(getCustomClubServers()),
        dispatch(getSuggestedClubServers()),
      ]);
      dispatch(setFetchedInitialData(true));
    }
  };

  useEffect(() => {
    getData();
  }, [isLoggedIn]);
};

export default useGetData;
