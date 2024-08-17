import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import landingImage from '../assets/landing-image.png';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUser } from '../app/features/user/userSlice';
import useRedirectUser from '../hooks/useRedirectUser';

const Login = ({ setFormData }) => {
  useRedirectUser();

  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectUser);
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(loginUser({ formData: data, navigate }));
  };

  useEffect(() => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      school: { description: '', placeId: '' },
      grade: null,
      interests: [],
    });
  }, []);

  return (
    <div className="flex items-center justify-center w-lvw">
      <div className="flex items-center justify-center h-lvh">
        <div
          className={`bg-gray-800 py-6 px-6 rounded-lg shadow-lg max-[550px]:px-0 ${
            isLoading ? 'opacity-40' : ''
          }`}
        >
          <h1 className="text-3xl font-semibold text-center text-gray-300">
            Login
            <span className="text-blue-500"> NewlyNet</span>
          </h1>

          <form
            className="min-w-96 mt-6"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <fieldset disabled={isLoading ? true : false}>
              <div className="max-[550px]:px-3">
                <label className="label">
                  <span className="text-base label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter email"
                  className="w-full input input-bordered h-10"
                  onChange={handleChange}
                  required
                  name="email"
                  value={data.email}
                />
              </div>
              <div className="max-[550px]:px-3">
                <label className="label">
                  <span className="text-base label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full input input-bordered h-10"
                  onChange={handleChange}
                  required
                  name="password"
                  value={data.password}
                />
              </div>
              <Link
                to="/signup"
                className="text-sm hover:underline hover:text-blue-600 mt-4 inline-block max-[550px]:px-3"
              >
                Don't have an account?
              </Link>
              <div className="max-[550px]:px-3">
                <button className="btn btn-block btn-sm mt-2">Login</button>
              </div>
              <div className="text-center mt-3">
                <Link
                  to="/forgetpassword"
                  className=" hover:underline hover:text-blue-600 mt-1 inline-block"
                >
                  Forgot password?
                </Link>
              </div>
            </fieldset>
          </form>
        </div>
        <img src={landingImage} className="h-72 mr-9 max-[550px]:hidden" />
      </div>
    </div>
  );
};

export default Login;
