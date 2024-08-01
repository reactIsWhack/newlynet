import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getCommonNewStudents,
  resetStudents,
} from '../../app/features/user/userSlice';

const Dropdown = ({ filter, setFilter }) => {
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    await setFilter(e.target.value);
    await dispatch(resetStudents());
    dispatch(getCommonNewStudents({ filter: e.target.value, cursor: '' }));
  };

  return (
    <select
      className="select select-bordered max-w-xs min-h-10 h-10 w-28"
      onChange={handleChange}
    >
      <option value={'grade'}>Grade</option>
      <option value={'interests'}>Interests</option>
    </select>
  );
};

export default Dropdown;
