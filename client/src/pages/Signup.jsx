import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SchoolSelect from '../components/ui/SchoolSelect';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, signup } from '../app/features/user/userSlice';
import useRedirectUser from '../hooks/useRedirectUser';

const Signup = ({
  formData,
  setFormData,
  schoolQuery,
  setSchoolQuery,
  setUpdatingInterests,
}) => {
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

    navigate('/select-interests');
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
            <span className="text-blue-500"> FirstDay</span>
          </h1>

          <form
            className="min-w-96 mt-6 max-[550px]:px-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="flex items-center gap-3 ">
              <div>
                <label className="label p-2">
                  <span className="text-base label-text">First name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="w-full input input-bordered h-10"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label p-2">
                  <span className="text-base label-text">Last name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="w-full input input-bordered h-10"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-3 ">
              <div>
                <label className="label p-2">
                  <span className="text-base label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter email"
                  className="w-full input input-bordered h-10"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  required
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
                className="text-sm hover:underline hover:text-blue-600 mt-4"
              >
                Already have an account?
              </Link>
            </div>
            <div className="">
              <button className="btn btn-block btn-sm mt-2">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
