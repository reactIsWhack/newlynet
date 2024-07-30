import React from 'react';
import interestOptions from '../../data';
import InterestBtn from '../components/ui/InterestBtn';
import '../styles/InterestBtn.css';
import { useNavigate } from 'react-router-dom';

const InterestsSelect = ({ route, setFormData, formData }) => {
  const interestBtn = interestOptions.map((interest) => {
    return (
      <InterestBtn
        interest={interest}
        setFormData={setFormData}
        formData={formData}
      />
    );
  });
  const navigate = useNavigate();

  return (
    <div className="py-12 text-2xl font-semibold max-[550px]:py-12 px-4">
      <h1 className="text-center">Select Your Interests</h1>
      <div className="mt-8 interest-btn-container">{interestBtn}</div>
      <div className="flex justify-center mt-8">
        <button
          className="btn btn-active btn-primary px-8 text-zinc-200 text-base"
          onClick={() => navigate(route)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default InterestsSelect;
