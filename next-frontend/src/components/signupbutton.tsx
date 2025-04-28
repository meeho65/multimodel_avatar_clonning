import React from "react";
import { SignupModal } from "./SignupModal";

const SignupButton = () => {
  return (
    <>
      <SignupModal />
      {/* Sign Up Button */}
      <button
        // btn-light is styled via Theme.css for dark mode
        className="btn btn-light btn-sm btn-animated"
        type="button"
        // onClick={openSignupModal}
      >
        Sign Up
      </button>
    </>
  );
};

export default SignupButton;
