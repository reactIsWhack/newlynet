import { useEffect } from 'react';
import {
  getCommonNewStudents,
  getUserProfile,
  selectUser,
  setFetchedInitialData,
  setRenderLoadingScreen,
} from '../app/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, selectChats } from '../app/features/chats/chatSlice';
import {
  getClubServer,
  getCustomClubServers,
  getSuggestedClubServers,
} from '../app/features/clubChat/clubChatSlice';

const useGetData = () => {
  const { isLoggedIn, initialDataFetched, renderLoadingScreen } =
    useSelector(selectUser);
  const { chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();

  const getData = async () => {
    if (isLoggedIn && !initialDataFetched && renderLoadingScreen.firstVisit) {
      dispatch(getUserProfile());
      await Promise.all([
        dispatch(getCommonNewStudents({ filter: 'grade', cursor: '' })),

        dispatch(getConversations(chatFilter)),
        dispatch(getClubServer()),
        dispatch(getCustomClubServers()),
        dispatch(getSuggestedClubServers()),
      ]);
      dispatch(setFetchedInitialData(true));
      if (renderLoadingScreen.firstVisit)
        dispatch(setRenderLoadingScreen({ render: false, firstVisit: false }));
    }
  };

  useEffect(() => {
    getData();
  }, [isLoggedIn]);
};

export default useGetData;
