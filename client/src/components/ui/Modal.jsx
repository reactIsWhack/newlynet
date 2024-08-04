import React from 'react';

const Modal = ({ children }) => {
  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create a chat</h3>
          {children}
        </div>
      </dialog>
    </>
  );
};

export default Modal;
