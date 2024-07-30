import React from 'react';
import { Link } from 'react-router-dom';
import landingImage from '../assets/landing-image.png';

const Login = () => {
  return (
    <div className="flex items-center justify-center w-lvw">
      <div className="flex items-center justify-center h-lvh">
        <div className="bg-gray-800 py-6 px-6 rounded-lg shadow-lg max-[550px]:px-0">
          <h1 className="text-3xl font-semibold text-center text-gray-300">
            Login
            <span className="text-blue-500"> NewlyNet</span>
          </h1>

          <form className="min-w-96 mt-6">
            <div className="max-[550px]:px-3">
              <label className="label">
                <span className="text-base label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full input input-bordered h-10"
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
          </form>
        </div>
        <img src={landingImage} className="h-72 mr-9 max-[550px]:hidden" />
      </div>
    </div>
  );
};

export default Login;
