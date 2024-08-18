import React from 'react';

const FeatureDesc = () => {
  return (
    <div className="mt-3">
      <h2 className="font-medium text-[17px]">1. Student Locating</h2>
      <div className="shadow-xl rounded-lg bg-base-200 my-3 p-4">
        <p>
          On the home page, you will find a table with users who go to your
          school. Here you can sort these users by same grade or same interests.
          Adding users as contacts will save them to your contacts page where
          you can resume or start chatting them at any time.
        </p>
        <br />
        <p>
          You can also pull up full details of a user, and of course feel free
          to start chatting with them right away via the chat button.
        </p>
        <br />
        <p>
          Lastly, the pick me button find and give you the details of a user
          from the table who would be a good buddy for you based off your
          interests.
        </p>
      </div>
    </div>
  );
};

export default FeatureDesc;
