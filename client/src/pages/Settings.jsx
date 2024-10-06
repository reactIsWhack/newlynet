import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SchoolSelect from '../components/ui/SchoolSelect';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonNewStudents,
  resetStudents,
  selectUser,
  updateProfile,
} from '../app/features/user/userSlice';
import useRedirectUser from '../hooks/useRedirectUser';
import InterestDisplayBtn from '../components/ui/InterestDisplayBtn';
import { Link, useNavigate } from 'react-router-dom';
import SocialMediaForm from '../components/ui/SocialMediaForm';
import useListenNotifications from '../hooks/useListenNotifications';
import useUpdateStreak from '../hooks/useUpdateStreak';

const Settings = ({ formData, setFormData, setUpdatingInterests, filter }) => {
  useRedirectUser();
  useListenNotifications();
  useUpdateStreak();
  const { grade, school, interests, updateLoading } = useSelector(selectUser);
  const [schoolQuery, setSchoolQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    school && setSchoolQuery(school.formattedName);
  }, [school]);

  const interestDisplayBtn = formData.interests.map((interest, index) => {
    return (
      <InterestDisplayBtn
        interest={interest}
        key={index}
        preventDefault={true}
      />
    );
  });

  const handleClick = async () => {
    await setUpdatingInterests(true);
    navigate('/select-interests');
  };
  const checkInterestsSame = () => {
    const interestsSame =
      interests.length == formData.interests.length &&
      interests.every((interest, index) => {
        return interest === formData.interests[index];
      });
    return interestsSame;
  };

  const shouldDisableBtn = () => {
    if (
      checkInterestsSame() &&
      grade === formData.grade &&
      school.schoolId === formData.school.schoolId
    )
      return true;

    return false;
  };
  const saveDisabled = shouldDisableBtn();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      grade: formData.grade,
      school: formData.school,
      interests: checkInterestsSame() ? [] : formData.interests,
      replacedInterests: interests,
    };

    await dispatch(updateProfile(updatedData)).then(async (res) => {
      if (!res.meta.rejectedWithValue) {
        await dispatch(resetStudents());
        dispatch(getCommonNewStudents({ filter, cursor: '' }));
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex gap-12 items-center justify-center py-20 max-[550px]:flex-col max-[550px]:py-10">
        <div className="flex-1 max-w-[500px] bg-base-200 min-h-40 rounded-lg shadow-xl pt-6 pb-8 ">
          <h1 className="text-xl font-semibold text-center mb-3">
            Personal Information
          </h1>
          <form onSubmit={handleSubmit}>
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
                  className="text-sm hover:underline hover:text-blue-600 cursor-pointer"
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
              {updateLoading ? (
                <span className="loading loading-spinner loading-lg mt-8"></span>
              ) : (
                <button
                  className={`btn btn-primary min-w-20 mt-8 ${
                    saveDisabled ? 'disabled' : ''
                  }`}
                  disabled={saveDisabled}
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
        <SocialMediaForm />
      </div>
    </>
  );
};

export default Settings;
