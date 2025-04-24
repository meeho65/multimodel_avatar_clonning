// src/components/SignupModal.tsx
import React, { useState, forwardRef, ChangeEvent } from "react";

interface SignupModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

// Define max number of files required
const REQUIRED_FILE_COUNT = 10;

export const SignupModal = forwardRef<HTMLDivElement, SignupModalProps>(
  ({ show, onClose, onSwitchToLogin }, ref) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    // *** Declare the isLoading state ***
    const [isLoading, setIsLoading] = useState(false); // Initialize to false

    // Handler for file input changes
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const filesArray = Array.from(event.target.files);
        setSelectedFiles(filesArray); // Store the selected files

        // Validate the number of files
        if (filesArray.length !== REQUIRED_FILE_COUNT) {
          setFileError(
            `Please select exactly ${REQUIRED_FILE_COUNT} image files.`
          );
        } else {
          setFileError(null); // Clear error if count is correct
        }
      } else {
        setSelectedFiles([]);
        setFileError(
          `Please select exactly ${REQUIRED_FILE_COUNT} image files.`
        );
      }
    };

    // Function to check if all conditions are met for enabling signup
    const canSignup = (): boolean => {
      return (
        username.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        selectedFiles.length === REQUIRED_FILE_COUNT &&
        !fileError && // No file error present
        !isLoading // Not already loading/signing up
      );
    };

    // Handler for the signup form submission
    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent default form submission

      if (!canSignup()) {
        // Re-validate file count specifically if button was somehow enabled
        if (selectedFiles.length !== REQUIRED_FILE_COUNT && !fileError) {
          setFileError(
            `Please select exactly ${REQUIRED_FILE_COUNT} image files.`
          );
        }
        // Only alert if not loading (prevents alert during API call)
        if (!isLoading) {
          alert("Please fill all fields and select exactly 10 images.");
        }
        return;
      }

      console.log("Attempting signup with:", { username, email }); // Don't log password
      console.log(`Preparing to upload ${selectedFiles.length} files.`);

      // --- Prepare data for API (using FormData) ---
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password); // Send password securely (HTTPS is required)

      selectedFiles.forEach((file, index) => {
        formData.append("images", file, file.name); // Key 'images' used for all files
        // console.log(`Appending file ${index + 1}: ${file.name}`); // Optional log
      });

      // --- Simulate API Call ---
      try {
        setIsLoading(true); // Set loading state to true
        console.log("Simulating API call with FormData...");

        // --- Replace this block with your actual fetch API call ---
        // Example structure:
        // const response = await fetch('/api/signup', { // Your backend endpoint
        //     method: 'POST',
        //     body: formData, // Send FormData
        // });
        // if (!response.ok) {
        //     // Try to get error message from backend response if possible
        //     let errorMsg = `Signup failed: ${response.statusText}`;
        //     try {
        //       const errorData = await response.json();
        //       errorMsg = errorData.message || errorMsg;
        //     } catch (jsonError) { /* Ignore if response isn't JSON */ }
        //     throw new Error(errorMsg);
        // }
        // const result = await response.json();
        // console.log("Signup successful:", result);
        // --- End of actual fetch block example ---

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        alert("Signup successful (simulated)!"); // Show success message
        onClose(); // Close modal on successful signup
      } catch (error) {
        console.error("Signup failed:", error);
        // Show specific error message if available, otherwise generic
        alert(
          `Signup failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoading(false); // Reset loading state regardless of success/failure
      }
      // --- End API Call Simulation ---
    };

    // Determine modal CSS classes based on show prop
    const modalClass = `modal fade ${show ? "show d-block" : "d-none"}`;

    return (
      // Modal structure with accessibility attributes
      <div
        ref={ref}
        className={modalClass}
        tabIndex={-1}
        aria-labelledby="signupModalLabel"
        aria-hidden={!show}
        role="dialog"
        style={{ zIndex: 1055 }}
      >
        {/* Larger, centered modal dialog */}
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {" "}
            {/* Modal content uses theme variables */}
            <div className="modal-header">
              <h5 className="modal-title" id="signupModalLabel">
                Sign Up & Train Avatar
              </h5>
              {/* Close button (disabled while loading) */}
              <button
                type="button"
                className="btn-close btn-animated"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
                disabled={isLoading}
              ></button>
            </div>
            {/* Signup Form */}
            <form onSubmit={handleSignup}>
              <div className="modal-body">
                {/* User details grid */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
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
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-6">
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
                      disabled={isLoading}
                    />
                  </div>
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
                    disabled={isLoading}
                  />
                </div>

                {/* File Upload Section */}
                <hr className="my-4" />
                <h6 className="mb-3">Upload Training Images</h6>
                <p className="text-muted small">
                  Please upload exactly {REQUIRED_FILE_COUNT} clear photos of
                  your face from various angles and lighting conditions.
                </p>
                <div className="mb-3">
                  <label htmlFor="faceImages" className="form-label">
                    Face Images ({REQUIRED_FILE_COUNT} required)
                  </label>
                  {/* File input with validation styling and disabled state */}
                  <input
                    type="file"
                    className={`form-control ${
                      fileError
                        ? "is-invalid"
                        : selectedFiles.length > 0
                        ? "is-valid"
                        : ""
                    }`}
                    id="faceImages"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    required
                    disabled={isLoading}
                  />
                  {/* Error message display */}
                  {fileError && (
                    <div className="invalid-feedback d-block">{fileError}</div>
                  )}
                </div>

                {/* Selected files preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1 small">
                      Selected: {selectedFiles.length} / {REQUIRED_FILE_COUNT}{" "}
                      files
                    </p>
                    {/* Scrollable list for many files */}
                    <ul
                      className="list-group list-group-flush border rounded"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action list-group-item-sm py-1 px-2 d-flex justify-content-between align-items-center small"
                        >
                          <span className="text-truncate">{file.name}</span>
                          <span className="text-muted ms-2 flex-shrink-0">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* End File Upload Section */}

                {/* Link to switch to Login */}
                <p className="mt-4 mb-0 small">
                  {" "}
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 align-baseline btn-animated"
                    onClick={onSwitchToLogin}
                    disabled={isLoading}
                  >
                    {" "}
                    Log in here{" "}
                  </button>{" "}
                </p>
              </div>
              {/* Modal Footer with Buttons */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-animated"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-animated"
                  disabled={!canSignup() || isLoading}
                >
                  {/* Show loading state on button */}
                  {isLoading ? (
                    <>
                      {" "}
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>{" "}
                      Signing Up...{" "}
                    </>
                  ) : (
                    "Sign Up & Upload Images"
                  )}
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
SignupModal.displayName = "SignupModal";
