import React from 'react';

const SocialMediaForm = () => {
  return (
    <div className="flex flex-col gap-4 bg-base-200 p-6 rounded-lg shadow-lg">
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
            required
            name="snapchat"
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
            required
            name="instagram"
          />
        </div>
        <div className="mt-6 justify-center flex">
          <button className="btn btn-active btn-primary">Connect</button>
        </div>
      </form>
    </div>
  );
};

export default SocialMediaForm;
