import React from 'react';

const Modal = ({ children }) => {
  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">{children}</div>
      </dialog>
    </>
  );
};

export default Modal;
