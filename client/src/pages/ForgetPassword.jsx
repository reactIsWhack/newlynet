import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  sendForgetPasswordEmail,
} from '../app/features/user/userSlice';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(sendForgetPasswordEmail(email)).then((res) => {
      console.log(res);
      if (
        !res.meta.rejectedWithValue &&
        res.meta.requestStatus !== 'rejected'
      ) {
        setEmailSent(true);
      }
    });
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <form
        className="bg-gray-800 p-4 rounded-lg shadow-xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="font-medium text-lg mb-2">Forgot Password</h2>
        <label className="label">
          <span className="text-base label-text">Email</span>
        </label>
        <input
          type="text"
          placeholder="Enter email"
          className="w-full input input-bordered h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!emailSent && (
          <div className="flex justify-center mt-5">
            {isLoading ? (
              <span className="loading loading-spinner loading-md h-11"></span>
            ) : (
              <button className="btn btn-primary min-h-11 h-11">Send</button>
            )}
          </div>
        )}
        {emailSent && (
          <div className="badge badge-primary p-4 flex justify-center mt-5 mx-auto cursor-default">
            Email Sent!
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgetPassword;
