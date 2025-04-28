import ModalWrapper from "@/wrapper/modal";
import { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./modal-signup";

const AuthButtons = () => {
  const [isOpen, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  return (
    <>
      <ModalWrapper show={isOpen} onClose={() => setOpen(false)}>
        {showLogin ? (
          <LoginModal setOpen={setOpen} setShowLogin={setShowLogin} />
        ) : (
          <SignUpModal setOpen={setOpen} setShowLogin={setShowLogin} />
        )}
      </ModalWrapper>

      <button
        className="btn btn-link text-decoration-none btn-sm btn-animated px-2"
        type="button"
        style={{ color: "var(--custom-navbar-color)", opacity: 0.9 }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "0.9")}
        onClick={() => setOpen(true)}
      >
        Login
      </button>
      <button
        // btn-light is styled via Theme.css for dark mode
        className="btn btn-light btn-sm btn-animated"
        type="button"
        onClick={() => {
          setShowLogin(false);
          setOpen(true);
        }}
      >
        Sign Up
      </button>
    </>
  );
};

export default AuthButtons;
