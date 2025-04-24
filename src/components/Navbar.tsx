// src/components/Navbar.tsx
import React from "react";
import { SunFill, MoonStarsFill } from "react-bootstrap-icons";
import logoForLightMode from "../assets/logoforblack.png"; // Dark logo for light background
import logoForDarkMode from "../assets/logo-for-white.png"; // Light logo for dark background

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
  openSignupModal: () => void;
  currentTheme: "light" | "dark";
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openLoginModal,
  openSignupModal,
  currentTheme,
  toggleTheme,
}) => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: string
  ) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    // navbar-dark class is essential for text color on dark bg
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-2">
      <div className="container">
        {/* Logo */}
        <a
          className={`navbar-brand d-flex align-items-center fw-semibold nav-link-animated ${
            activeTab === "home" ? "active" : ""
          }`}
          href="#"
          onClick={(e) => handleNavClick(e, "home")}
          title="Avatar Cloning System - Home"
        >
          <img
            src={currentTheme === "light" ? logoForLightMode : logoForDarkMode}
            height="38"
            className="d-inline-block align-top me-2"
            alt="Avatar Cloning System Logo"
          />
        </a>
        {/* Toggler */}
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
        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Removed extra spaces from list items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {" "}
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "create" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "create")}
              >
                Create Avatar
              </a>{" "}
            </li>
            <li className="nav-item">
              {" "}
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "voice" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "voice")}
              >
                Voice Cloning
              </a>{" "}
            </li>
            <li className="nav-item">
              {" "}
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "chat" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "chat")}
              >
                Avatar Chat
              </a>{" "}
            </li>
            <li className="nav-item">
              {" "}
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "history" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "history")}
              >
                History
              </a>{" "}
            </li>
            <li className="nav-item">
              {" "}
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "info" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "info")}
              >
                How It Works
              </a>{" "}
            </li>
          </ul>
          {/* Right Controls */}
          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-light btn-theme-toggle btn-animated d-flex align-items-center justify-content-center"
              aria-label={
                currentTheme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              title={
                currentTheme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {currentTheme === "light" ? (
                <MoonStarsFill size={18} />
              ) : (
                <SunFill size={18} />
              )}
            </button>
            {/* Login Button - Rely on navbar-dark for color */}
            <button
              // Removed text-white, using btn-link which inherits color
              // Added padding for better click area
              className="btn btn-link text-decoration-none btn-sm btn-animated px-2"
              type="button"
              onClick={openLoginModal}
              // Use the CSS variable for color consistency if needed, or let navbar-dark handle it
              style={{ color: "var(--custom-navbar-color)", opacity: 0.9 }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "0.9")}
            >
              Login
            </button>
            {/* Sign Up Button */}
            <button
              // btn-light is styled via Theme.css for dark mode
              className="btn btn-light btn-sm btn-animated"
              type="button"
              onClick={openSignupModal}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
