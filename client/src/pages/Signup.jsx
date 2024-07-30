import React from 'react';
import { Link } from 'react-router-dom';
import SchoolSelect from '../components/ui/SchoolSelect';

const Signup = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-lvh">
        <div className="bg-gray-800 px-6 py-6 rounded-lg shadow-lg max-[550px]:px-0">
          <h1 className="text-3xl font-semibold text-center text-gray-300">
            Signup
            <span className="text-blue-500"> NewlyNet</span>
          </h1>

          <form className="min-w-96 mt-6">
            <div className="flex items-center gap-3 max-[550px]:px-3">
              <div>
                <label className="label p-2">
                  <span className="text-base label-text">Fullname</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter fullname"
                  className="w-full input input-bordered h-10"
                />
              </div>
              <div className="max-[550px]:px-3">
                <label className="label p-2">
                  <span className="text-base label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full input input-bordered h-10"
                />
              </div>
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
            <SchoolSelect />
            <div className="flex items-center justify-between mb-2">
              <Link
                to="/login"
                className="text-sm hover:underline hover:text-blue-600 mt-4 inline-block max-[550px]:px-3"
              >
                Already have an account?
              </Link>
              <Link
                to="/login"
                className="text-sm hover:underline hover:text-blue-600 mt-4 inline-block max-[550px]:px-3"
              >
                Select your interests {`-->`}
              </Link>
            </div>
            <div className="max-[550px]:px-3">
              <button className="btn btn-block btn-sm mt-2">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
