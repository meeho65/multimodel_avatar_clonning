import React, { ChangeEvent, useState } from "react";
import { LoginModalInterface } from "./LoginModal";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { register } from "@/actions/actions";
import { signIn } from "next-auth/react";

const REQUIRED_FILE_COUNT = 12;

export type AuthErrorResponse = { error: string };

const SignUpModal = ({ setOpen, setShowLogin }: LoginModalInterface) => {
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
      setFileError(`Please select exactly ${REQUIRED_FILE_COUNT} image files.`);
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

  const registerMutation = useMutation({
    mutationFn: () => register(username, email, password, selectedFiles),
    onSuccess: () => {
      signIn("credentials", {
        username,
        email,
        redirect: false,
      });
      toast.success("Registration successful");
    },
    onError: (error: unknown) => {
      const err = error as AuthErrorResponse;
      toast.error(err?.error || "Registration Failed");
    },
  });

  return (
    <form>
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
          Please upload exactly {REQUIRED_FILE_COUNT} clear photos of your face
          from various angles and lighting conditions.
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
              Selected: {selectedFiles.length} / {REQUIRED_FILE_COUNT} files
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
            onClick={() => setShowLogin(true)}
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
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Close
        </button>
        <button
          onClick={() => registerMutation.mutate()}
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
  );
};

export default SignUpModal;
