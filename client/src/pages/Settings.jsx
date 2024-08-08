import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SchoolSelect from '../components/ui/SchoolSelect';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/user/userSlice';
import useRedirectUser from '../hooks/useRedirectUser';
import InterestDisplayBtn from '../components/ui/InterestDisplayBtn';
import { Link, useNavigate } from 'react-router-dom';
import SocialMediaForm from '../components/ui/SocialMediaForm';
import useListenNotifications from '../hooks/useListenNotifications';
import useUpdateStreak from '../hooks/useUpdateStreak';

const Settings = ({ formData, setFormData, setUpdatingInterests }) => {
  useRedirectUser();
  useListenNotifications();
  useUpdateStreak();
  const { grade, school, interests } = useSelector(selectUser);
  const [schoolQuery, setSchoolQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    school && setSchoolQuery(school.formattedName);
  }, [school]);

  const interestDisplayBtn = formData.interests.map((interest, index) => {
    return <InterestDisplayBtn interest={interest} key={index} />;
  });

  const handleClick = async () => {
    await setUpdatingInterests(true);
    navigate('/select-interests');
  };

  const shouldDisableBtn = () => {
    const interestsSame =
      interests.length == formData.interests.length &&
      interests.every((interest, index) => {
        return interest === formData.interests[index];
      });

    if (
      interestsSame &&
      grade === formData.grade &&
      school.schoolId === formData.school.schoolId
    )
      return true;

    return false;
  };
  const saveDisabled = shouldDisableBtn();

  return (
    <>
      <Navbar />
      <div className="flex gap-12 items-start justify-center py-20 max-[550px]:flex-col">
        <div className="flex-1 max-w-[500px] bg-base-200 min-h-40 rounded-lg shadow-xl pt-6 pb-8 ">
          <h1 className="text-xl font-semibold text-center mb-3">
            Personal Information
          </h1>
          <form>
            <div className="px-7 max-[550px]:px-1">
              <SchoolSelect
                formData={formData}
                setFormData={setFormData}
                setSchoolQuery={setSchoolQuery}
                schoolQuery={schoolQuery}
              />
            </div>
            <label className="label w-full mt-2 max-[550px]:px-4 px-7">
              <div className="w-full flex items-center justify-between">
                <span className="text-base label-text">Interests</span>
                <span
                  className="text-sm hover:underline hover:text-blue-600"
                  onClick={handleClick}
                >
                  Select your interests {`-->`}
                </span>
              </div>
            </label>
            <div className="my-2 flex items-center flex-wrap justify-center gap-2">
              {interestDisplayBtn}
            </div>
            <div className="flex justify-center">
              <button
                className={`btn btn-primary min-w-20 mt-8 ${
                  saveDisabled ? 'disabled' : ''
                }`}
                disabled={saveDisabled}
              >
                Save
              </button>
            </div>
          </form>
        </div>
        <SocialMediaForm />
      </div>
    </>
  );
};

export default Settings;
