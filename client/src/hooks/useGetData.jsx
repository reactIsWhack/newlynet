import { useEffect } from 'react';
import {
  getCommonNewStudents,
  getUserProfile,
  selectUser,
} from '../app/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, selectChats } from '../app/features/chats/chatSlice';
import {
  getClubServer,
  getCustomClubServers,
  getSuggestedClubServers,
} from '../app/features/clubChat/clubChatSlice';

const useGetData = () => {
  const { isLoggedIn } = useSelector(selectUser);
  const { chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();

  const getData = async () => {
    if (isLoggedIn) {
      dispatch(getUserProfile());
      await Promise.all([
        dispatch(getCommonNewStudents({ filter: 'grade', cursor: '' })),

        dispatch(getConversations(chatFilter)),
        dispatch(getClubServer()),
        dispatch(getCustomClubServers()),
        dispatch(getSuggestedClubServers()),
      ]);
    }
  };

  useEffect(() => {
    getData();
  }, [isLoggedIn]);
};

export default useGetData;
