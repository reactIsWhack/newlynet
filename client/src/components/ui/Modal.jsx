import React from 'react';

const Modal = ({ children }) => {
  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create a chat</h3>
          <form method="dialog">
            {children}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
