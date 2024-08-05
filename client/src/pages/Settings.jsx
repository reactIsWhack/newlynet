import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SchoolSelect from '../components/ui/SchoolSelect';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import useRedirectUser from '../hooks/useRedirectUser';
import InterestDisplayBtn from '../components/ui/InterestDisplayBtn';
import { Link } from 'react-router-dom';

const Settings = ({ formData, setFormData }) => {
  useRedirectUser();
  const { grade, school, interests } = useSelector(selectUser);
  const [schoolQuery, setSchoolQuery] = useState('');

  useEffect(() => {
    setSchoolQuery(school?.formattedName);
  }, [school]);

  const interestDisplayBtn = interests.map((interest, index) => {
    return <InterestDisplayBtn interest={interest} key={index} />;
  });

  return (
    <>
      <Navbar />
      <div className="flex gap-6 items-start justify-center py-20 ">
        <div className="flex-1 max-w-[500px] bg-base-200 min-h-40 rounded-lg shadow-xl pt-6 pb-8 px-5">
          <h1 className="text-xl font-semibold text-center mb-3">
            Personal Information
          </h1>
          <form>
            <SchoolSelect
              formData={formData}
              setFormData={setFormData}
              setSchoolQuery={setSchoolQuery}
              schoolQuery={schoolQuery}
            />
            <label className="label w-full mt-2">
              <div className="w-full flex items-center justify-between">
                <span className="text-base label-text">Interests</span>
                <Link
                  className="text-sm hover:underline hover:text-blue-600"
                  to="/select-interests"
                >
                  Select your interests {`-->`}
                </Link>
              </div>
            </label>
            <div className="my-2 flex items-center flex-wrap justify-center gap-2">
              {interestDisplayBtn}
            </div>
            <div className="flex justify-center">
              <button className="btn btn-primary min-w-20 mt-8">Save</button>
            </div>
          </form>
        </div>
        <div>Connect to Social Media</div>
      </div>
    </>
  );
};

export default Settings;
