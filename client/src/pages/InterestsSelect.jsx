import React, { useEffect } from 'react';
import interestOptions from '../../data';
import InterestBtn from '../components/ui/InterestBtn';
import '../styles/InterestBtn.css';
import { useNavigate } from 'react-router-dom';
import useRedirectUser from '../hooks/useRedirectUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, signup } from '../app/features/user/userSlice';

const InterestsSelect = ({
  setSchoolQuery,
  setFormData,
  formData,
  updatingInterests,
}) => {
  useRedirectUser(updatingInterests);
  const interestBtn = interestOptions.map((interest, index) => {
    return (
      <InterestBtn
        interest={interest}
        setFormData={setFormData}
        formData={formData}
        key={index}
      />
    );
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn } = useSelector(selectUser);

  const disableBtn = formData.interests.length < 1;

  const handleClick = () => {
    if (!updatingInterests) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        school: { description: '', placeId: '' },
        grade: null,
        interests: [],
      });
      setSchoolQuery('');
      return dispatch(signup({ formData, navigate }));
    }

    navigate('/settings');
  };

  useEffect(() => {
    if (isLoggedIn && !updatingInterests) {
      navigate('/settings');
    }
  }, []);

  return (
    <div className="py-12 text-2xl font-semibold max-[550px]:py-12 px-4 min-h-screen">
      <h1 className="text-center">Select Your Interests</h1>
      <div className="mt-8 interest-btn-container">{interestBtn}</div>
      <div className="flex justify-center mt-12 max-[550px]:mt-6 gap-3">
        {isLoading ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : (
          <>
            {!updatingInterests && (
              <button
                className="btn btn-ghost btn-wide max-[550px]:w-36 text-base"
                onClick={() => navigate('/signup')}
              >
                Back
              </button>
            )}
            <button
              className={`btn btn-wide max-[550px]:w-36 text-zinc-200 text-base ${
                disableBtn ? 'btn-disabled' : ''
              }`}
              aria-disabled={`${disableBtn}`}
              onClick={handleClick}
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InterestsSelect;
