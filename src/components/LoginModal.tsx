// src/components/LoginModal.tsx
import React, { useState, forwardRef } from "react"; // Import forwardRef

interface LoginModalProps {
  show: boolean; // Added to control visibility via Bootstrap classes
  onClose: () => void;
  onSwitchToSignup: () => void;
}

// Use forwardRef to accept the ref from App.tsx for CSSTransition
export const LoginModal = forwardRef<HTMLDivElement, LoginModalProps>(
  ({ show, onClose, onSwitchToSignup }, ref) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Logging in with:", { email, password });
      // Add actual login logic here (API call, etc.)
      // Consider showing feedback (loading/error) instead of instantly closing
      onClose(); // Close modal after login attempt (or on success)
    };

    // Add Bootstrap classes for modal display and fade effect
    const modalClass = `modal fade ${show ? "show d-block" : "d-none"}`;
    // The `tabIndex="-1"` and `aria-labelledby` are important for accessibility
    return (
      <div
        ref={ref} // Attach the ref here
        className={modalClass}
        tabIndex={-1}
        aria-labelledby="loginModalLabel"
        aria-hidden={!show}
        role="dialog"
        style={{ zIndex: 1055 }} // Ensure modal is above overlay
      >
        <div className="modal-dialog modal-dialog-centered">
          {" "}
          {/* Center the modal */}
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
            <form onSubmit={handleLogin}>
              {" "}
              {/* Wrap body and footer in form */}
              <div className="modal-body text-dark">
                {" "}
                {/* Use text-dark */}
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="loginEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-3 mb-0">
                  Don't have an account?{" "}
                  <button
                    type="button" // Set type to button to prevent form submission
                    className="btn btn-link p-0 align-baseline btn-animated" // Style as link
                    onClick={onSwitchToSignup} // Use the correct handler
                  >
                    Sign up here
                  </button>
                </p>
              </div>
              <div className="modal-footer">
                {/* Standard Close Button */}
                <button
                  type="button" // Prevent form submission
                  className="btn btn-secondary btn-animated"
                  onClick={onClose}
                >
                  Close
                </button>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-animated"
                  style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

// Set display name for React DevTools
LoginModal.displayName = "LoginModal";
