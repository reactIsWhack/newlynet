import React from 'react';

const SchoolSelect = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="max-[550px]:px-3 w-2/3">
        <label className="label">
          <span className="text-base label-text">School</span>
        </label>
        <input
          type="text"
          placeholder="Enter school"
          className="w-full input input-bordered h-10"
        />
      </div>
      <div className="max-[550px]:px-3 w-1/3">
        <label className="label p-2">
          <span className="text-base label-text">Grade</span>
        </label>
        <input
          type="number"
          placeholder="Enter grade"
          className="w-full input input-bordered h-10"
          min={5}
          max={12}
        />
      </div>
    </div>
  );
};

export default SchoolSelect;
