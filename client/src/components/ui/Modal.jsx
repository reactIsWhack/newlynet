import React from 'react';

const Modal = ({ children, modalType }) => {
  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div
          className={`modal-box overflow-hidden ${
            modalType === 'user-detail' ? 'p-2' : ''
          } `}
        >
          {children}
        </div>
      </dialog>
    </>
  );
};

export default Modal;
