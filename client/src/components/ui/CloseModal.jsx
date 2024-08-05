import React from 'react';
import { useDispatch } from 'react-redux';
import { setRenderModal } from '../../app/features/popup/popupSlice';

const CloseModal = () => {
  const dispatch = useDispatch();

  const handleClose = (e) => {
    e.preventDefault();
    const element = document.getElementById('my_modal_3');
    element.open = false;
    dispatch(setRenderModal({ render: false, name: '' }));
  };

  return (
    <button
      className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-50"
      onClick={handleClose}
    >
      ✕
    </button>
  );
};

export default CloseModal;
