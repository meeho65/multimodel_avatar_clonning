import React, { ReactNode } from "react";

interface ModalWrapperProps {
  children: ReactNode;
  show: boolean; // Added to control visibility via Bootstrap classes
  onClose: () => void;
}
const ModalWrapper = ({ children, show, onClose }: ModalWrapperProps) => {
  const modalClass = `modal fade ${show ? "show d-block" : "d-none"}`;

  return (
    <div
      className={modalClass}
      tabIndex={-1}
      aria-labelledby="loginModalLabel"
      aria-hidden={!show}
      role="dialog"
      style={{ zIndex: 1055 }} // Ensure modal is above overlay
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-dark" id="loginModalLabel">
              Login
            </h5>{" "}
            {/* Use text-dark for visibility */}
            {/* Bootstrap close button */}
            <button
              type="button"
              className="btn-close btn-animated" // Add animation class
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose} // Attach onClose handler
            ></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
