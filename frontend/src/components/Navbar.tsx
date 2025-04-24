import React from "react";

interface NavbarProps {
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  setActiveTab,
  openLoginModal,
}) => {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#6c5ce7" }}
    >
      <div className="container">
        <a
          className="navbar-brand text-white"
          href="#"
          onClick={() => setActiveTab("home")}
        >
          Avatar Cloning System
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn btn-outline-light mx-1"
                onClick={() => setActiveTab("create")}
              >
                Create Avatar
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-light mx-1"
                onClick={() => setActiveTab("voice")}
              >
                Voice Cloning
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-light mx-1"
                onClick={() => setActiveTab("info")}
              >
                How It Works
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={openLoginModal}>
                <img
                  src="path/to/your/login/logo.png"
                  alt="Login"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
