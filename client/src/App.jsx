import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import axios from 'axios';
import InterestsSelect from './pages/InterestsSelect';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, selectUser } from './app/features/user/userSlice';
import Chats from './pages/Chats';

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
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserProfile());
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
        <Route path="/chats" element={<Chats />}></Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
