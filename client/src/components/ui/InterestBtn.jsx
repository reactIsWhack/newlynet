import React from 'react';

const InterestBtn = ({ interest, setFormData, formData }) => {
  const inFormData = formData.interests.includes(interest);

  console.log(inFormData, formData);
  const interestsFiltered = formData.interests.filter(
    (interestItem) => interestItem !== interest
  );

  const handleClick = () => {
    if (formData.interests.length < 3) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        interests: !inFormData
          ? [...prevFormData.interests, interest]
          : interestsFiltered,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        interests: interestsFiltered,
      }));
    }
  };

  return (
    <button
      className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg m-3 ${
        inFormData && 'btn-primary'
      }`}
      onClick={handleClick}
    >
      {interest}
    </button>
  );
};

export default InterestBtn;
