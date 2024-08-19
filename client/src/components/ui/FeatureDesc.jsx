import React from 'react';

const FeatureDesc = ({ html, feature, index }) => {
  return (
    <div className="mt-3">
      <h2 className="font-medium text-[17px]">
        {index}. {feature}
      </h2>
      <div className="shadow-xl rounded-lg bg-base-200 my-3 p-4 max-h-[370px] max-[550px]:max-h-[280px] overflow-auto">
        {html}
      </div>
    </div>
  );
};

export default FeatureDesc;
