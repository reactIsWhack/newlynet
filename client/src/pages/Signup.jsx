import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SchoolSelect from '../components/ui/SchoolSelect';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, signup } from '../app/features/user/userSlice';
import useRedirectUser from '../hooks/useRedirectUser';

const Signup = ({ formData, setFormData, schoolQuery, setSchoolQuery }) => {
  useRedirectUser();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(selectUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(signup({ formData, navigate }));
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-lvh">
        <div
          className={`bg-gray-800 px-6 py-6 rounded-lg shadow-lg max-[550px]:px-0 ${
            isLoading ? 'opacity-40' : ''
          }`}
        >
          <h1 className="text-3xl font-semibold text-center text-gray-300">
            Signup
            <span className="text-blue-500"> NewlyNet</span>
          </h1>

          <form className="min-w-96 mt-6" onSubmit={handleSubmit}>
            <fieldset disabled={isLoading ? true : false}>
              <div className="flex items-center gap-3 max-[550px]:px-3">
                <div>
                  <label className="label p-2">
                    <span className="text-base label-text">Firstname</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter firstname"
                    className="w-full input input-bordered h-10"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="max-[550px]:px-3">
                  <label className="label p-2">
                    <span className="text-base label-text">Lastname</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter lastname"
                    className="w-full input input-bordered h-10"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 max-[550px]:px-3">
                <div className="max-[550px]:px-3">
                  <label className="label p-2">
                    <span className="text-base label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full input input-bordered h-10"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="text-base label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full input input-bordered h-10"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <SchoolSelect
                setFormData={setFormData}
                formData={formData}
                schoolQuery={schoolQuery}
                setSchoolQuery={setSchoolQuery}
              />
              <div className="flex items-center justify-between mb-2">
                <Link
                  to="/login"
                  className="text-sm hover:underline hover:text-blue-600 mt-4 inline-block max-[550px]:px-3"
                >
                  Already have an account?
                </Link>
                <Link
                  to="/select-interests"
                  className="text-sm hover:underline hover:text-blue-600 mt-4 inline-block max-[550px]:px-3"
                >
                  Select your interests {`-->`}
                </Link>
              </div>
              <div className="max-[550px]:px-3">
                <button className="btn btn-block btn-sm mt-2">Sign up</button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
