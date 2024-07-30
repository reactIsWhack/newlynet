import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import axios from 'axios';
import InterestsSelect from './pages/InterestsSelect';
import { useState } from 'react';

axios.defaults.withCredentials = true;

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    school: null,
    grade: null,
    interests: [],
  });
  console.log(formData);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/signup"
          element={<Signup formData={formData} setFormData={setFormData} />}
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
      </Routes>
    </>
  );
}

export default App;
