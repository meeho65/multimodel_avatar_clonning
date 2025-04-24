// src/components/SignupModal.tsx
import React, { useState, forwardRef } from "react";

interface SignupModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void; // Added prop
}

export const SignupModal = forwardRef<HTMLDivElement, SignupModalProps>(
  ({ show, onClose, onSwitchToLogin }, ref) => {
    // Destructure onSwitchToLogin
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Signing up with", { username, email, password });
      // Add actual signup logic here
      onClose(); // Close modal after signup attempt
    };

    const modalClass = `modal fade ${show ? "show d-block" : "d-none"}`;

    return (
      <div
        ref={ref} // Attach ref
        className={modalClass}
        tabIndex={-1}
        aria-labelledby="signupModalLabel"
        aria-hidden={!show}
        role="dialog"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark" id="signupModalLabel">
                Sign Up
              </h5>{" "}
              {/* Use text-dark */}
              <button
                type="button"
                className="btn-close btn-animated" // Add animation
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSignup}>
              <div className="modal-body text-dark">
                {" "}
                {/* Use text-dark */}
                <div className="mb-3">
                  <label htmlFor="signupUsername" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="signupUsername"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="signupEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="signupPassword"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-3 mb-0">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 align-baseline btn-animated" // Style as link
                    onClick={onSwitchToLogin} // *** Use the correct handler ***
                  >
                    Log in here
                  </button>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-animated"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-animated"
                  style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

SignupModal.displayName = "SignupModal";
