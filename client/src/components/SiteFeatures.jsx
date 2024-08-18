import React from 'react';
import Modal from './ui/Modal';
import CloseModal from './ui/CloseModal';
import FeatureDesc from './ui/FeatureDesc';

const SiteFeatures = () => {
  return (
    <Modal>
      <CloseModal />
      <h3 className="font-bold text-xl">Site Features</h3>
      <FeatureDesc />
      <div className="flex items-center gap-3 justify-center mt-4">
        <button className="btn btn-secondary min-h-9 h-9">
          {' '}
          <span class="mr-2">←</span> Previous
        </button>
        <button className="btn btn-secondary min-h-9 h-9">
          {' '}
          Next <span class="ml-2">→</span>
        </button>
      </div>
    </Modal>
  );
};

export default SiteFeatures;
