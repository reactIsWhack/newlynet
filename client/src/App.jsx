import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import axios from 'axios';
import InterestsSelect from './pages/InterestsSelect';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonNewStudents,
  getUserProfile,
  selectUser,
} from './app/features/user/userSlice';
import Chats from './pages/Chats';
import { useSocket } from './context/SocketContext';
import NoChatSelected from './components/ui/NoChatSelected';
import Messages from './components/Messages';
import { getConversations, selectChats } from './app/features/chats/chatSlice';
import Contacts from './pages/Contacts';
import { selectPopup } from './app/features/popup/popupSlice';
import UserDetails from './components/UserDetails';
import Settings from './pages/Settings';
import LoadingScreen from './components/LoadingScreen';
import ClubChat from './pages/ClubChat';
import GeneralMessages from './pages/GeneralMessages';
import SectionMessages from './pages/SectionMessages';
import { getClubServer } from './app/features/clubChat/clubChatSlice';
import useUpdateClubServer from './hooks/useUpdateClubServer';

axios.defaults.withCredentials = true;

function App() {
  useUpdateClubServer();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    school: { description: '', placeId: '' },
    grade: null,
    interests: [],
  });
  const [schoolQuery, setSchoolQuery] = useState('');
  const { isLoggedIn, grade, interests, school } = useSelector(selectUser);
  const { selectedConversation, chatFilter } = useSelector(selectChats);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('grade');
  const {
    renderModal: { render, name },
  } = useSelector(selectPopup);
  const [updatingInterests, setUpdatingInterests] = useState(false);
  const [settingsData, setSettingsData] = useState({
    grade: 0,
    interests: [],
    school: {},
  });
  const [renderLoadingScreen, setRenderLoadingScreen] = useState(false);

  console.log(renderLoadingScreen);
  const getData = async () => {
    if (isLoggedIn) setRenderLoadingScreen(true);
    await dispatch(getUserProfile()).then(() => setRenderLoadingScreen(false));
    await Promise.all([
      dispatch(getCommonNewStudents({ filter: 'grade', cursor: '' })),

      dispatch(getConversations(chatFilter)),
      dispatch(getClubServer()),
    ]);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    grade &&
      setSettingsData((prev) => ({
        ...prev,
        grade: grade,
        interests: interests,
        school: school,
      }));
  }, [grade, interests, school]);

  return (
    <>
      {renderLoadingScreen ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login setFormData={setFormData} />}
          ></Route>
          <Route
            path="/signup"
            element={
              <Signup
                formData={formData}
                setFormData={setFormData}
                schoolQuery={schoolQuery}
                setSchoolQuery={setSchoolQuery}
              />
            }
          ></Route>
          <Route
            path="/"
            element={<Home filter={filter} setFilter={setFilter} />}
          ></Route>
          <Route
            path="/select-interests"
            element={
              <InterestsSelect
                setFormData={updatingInterests ? setSettingsData : setFormData}
                formData={updatingInterests ? settingsData : formData}
                route={updatingInterests ? '/settings' : '/signup'}
                updatingInterests={updatingInterests}
              />
            }
          ></Route>
          <Route path="/chats" element={<Chats filter={filter} />}>
            <Route
              index
              element={!selectedConversation ? <NoChatSelected /> : null}
            ></Route>
            <Route path=":id" element={<Messages />} />
          </Route>
          <Route
            path="/contacts"
            element={<Contacts filter={filter} />}
          ></Route>
          <Route
            path="/settings"
            element={
              <Settings
                setUpdatingInterests={setUpdatingInterests}
                formData={settingsData}
                setFormData={setSettingsData}
                filter={filter}
              />
            }
          ></Route>
          <Route path="/clubchat" element={<ClubChat />}>
            <Route index element={<GeneralMessages />}></Route>
            <Route path=":sectionId" element={<SectionMessages />}></Route>
          </Route>
        </Routes>
      )}
      <Toaster />
      {render && name === 'user-detail' && <UserDetails filter={filter} />}
    </>
  );
}

export default App;
