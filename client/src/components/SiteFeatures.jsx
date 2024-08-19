import React, { useState } from 'react';
import Modal from './ui/Modal';
import CloseModal from './ui/CloseModal';
import FeatureDesc from './ui/FeatureDesc';
import { siteFeaturesData } from '../../data';

const SiteFeatures = () => {
  const [featureIndex, setFeatureIndex] = useState(0);

  const html = siteFeaturesData[featureIndex].html;
  const feature = siteFeaturesData[featureIndex].feature;

  const nextFeature = () => {
    setFeatureIndex((prev) => {
      if (prev + 1 === siteFeaturesData.length) return 0;
      else return prev + 1;
    });
  };

  const prevFeature = () => {
    setFeatureIndex((prev) => {
      if (prev === 0) return siteFeaturesData.length - 1;
      else return prev - 1;
    });
  };

  return (
    <Modal>
      <CloseModal />
      <h3 className="font-bold text-xl">Main Site Features</h3>
      <FeatureDesc feature={feature} html={html} index={featureIndex + 1} />
      <div className="flex items-center gap-3 justify-center mt-4">
        <button className="btn btn-secondary min-h-9 h-9" onClick={prevFeature}>
          {' '}
          <span class="mr-2">←</span> Previous
        </button>
        <button className="btn btn-secondary min-h-9 h-9" onClick={nextFeature}>
          {' '}
          Next <span className="ml-2">→</span>
        </button>
      </div>
    </Modal>
  );
};

export default SiteFeatures;
