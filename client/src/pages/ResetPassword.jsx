import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, selectUser } from '../app/features/user/userSlice';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const { isLoading } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(resetPassword({ newPassword, token })).then((res) => {
      if (!res.meta.rejectedWithValue) navigate('/login');
    });
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <form
        className="bg-gray-800 p-4 rounded-lg shadow-xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="font-medium text-lg mb-2">Reset Password</h2>
        <label className="label">
          <span className="text-base label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full input input-bordered h-10"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="flex justify-center mt-5">
          {isLoading ? (
            <span className="loading loading-spinner loading-md h-11"></span>
          ) : (
            <button className="btn btn-primary min-h-11 h-11">Reset</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
