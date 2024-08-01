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
import {
  getConversations,
  selectChats,
  setSelectedChat,
} from './app/features/chats/chatSlice';

axios.defaults.withCredentials = true;

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    school: { description: '', placeId: '' },
    grade: null,
    interests: [],
  });
  const [schoolQuery, setSchoolQuery] = useState('');
  const { isLoggedIn } = useSelector(selectUser);
  const { selectedConversation } = useSelector(selectChats);
  const dispatch = useDispatch();

  const getData = async () => {
    await dispatch(getUserProfile());
    await dispatch(getCommonNewStudents({ filter: 'grade', cursor: '' }));
    await dispatch(getConversations('individual'));
  };

  useEffect(() => {
    if (isLoggedIn) {
      getData();
    }
  }, [isLoggedIn]);

  return (
    <>
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
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/select-interests"
          element={
            <InterestsSelect
              setFormData={setFormData}
              formData={formData}
              route={'/signup'}
            />
          }
        ></Route>
        <Route path="/chats" element={<Chats />}>
          <Route
            index
            element={!selectedConversation ? <NoChatSelected /> : null}
          ></Route>
          <Route path=":id" element={<Messages />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
