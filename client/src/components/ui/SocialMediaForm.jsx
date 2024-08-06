import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSocialMediaInfo,
  selectUser,
} from '../../app/features/user/userSlice';

const SocialMediaForm = () => {
  const { socialMediaInfo, isLoading } = useSelector(selectUser);
  const [socialMediaData, setSocialMediaData] = useState({
    snapchat: socialMediaInfo.snapchat,
    instagram: socialMediaInfo.instagram,
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(addSocialMediaInfo(socialMediaData));
  };

  useEffect(() => {
    setSocialMediaData({
      snapchat: socialMediaInfo.snapchat,
      instagram: socialMediaInfo.instagram,
    });
  }, [socialMediaInfo]);

  return (
    <div
      className="flex flex-col gap-4 bg-base-200 p-6 rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h1 className="text-lg font-semibold text-center">
        Social Media Connect
      </h1>
      <h2 className="text-center">
        Add your social media usernames for your added contacts to see!
      </h2>
      <form>
        <div className="mb-4">
          <label className="label">
            <span className="text-base label-text">Snapchat</span>
          </label>
          <input
            type="text"
            placeholder="Enter snapchat username"
            className="w-full input input-bordered h-10"
            name="snapchat"
            value={socialMediaData.snapchat}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">
            <span className="text-base label-text">Instagram</span>
          </label>
          <input
            type="text"
            placeholder="Enter instagram username"
            className="w-full input input-bordered h-10"
            name="instagram"
            value={socialMediaData.instagram}
            onChange={handleChange}
          />
        </div>
        <div className="mt-6 justify-center flex">
          {isLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <button className="btn btn-active btn-primary">Connect</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SocialMediaForm;
