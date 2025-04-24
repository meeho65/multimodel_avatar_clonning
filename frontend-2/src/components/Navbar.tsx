// src/components/Navbar.tsx
import React from "react";
import { SunFill, MoonStarsFill } from "react-bootstrap-icons";
import logoSrc from "../assets/logo.jpg";

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

  // Use CSS variable defined in theme.css for background
  // Add padding and shadow
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm py-2" // Added shadow & padding
      style={
        {
          /* backgroundColor: defined by .navbar style in CSS */
        }
      }
    >
      <div className="container">
        {/* Make brand slightly bolder */}
        <a
          // Added d-flex and align-items-center for vertical alignment if text is included
          className={`navbar-brand d-flex align-items-center fw-semibold nav-link-animated ${
            activeTab === "home" ? "active" : ""
          }`}
          href="#"
          onClick={(e) => handleNavClick(e, "home")}
          title="Avatar Cloning System - Home"
        >
          <img
            src={logoSrc} // Use the imported logo source
            height="50" // Increased height (adjust as needed)
            className="d-inline-block align-top me-3" // Increased margin-right slightly
            alt="Avatar Cloning System Logo" // Important for accessibility
          />
        </a>
        {/* --- End Logo Link --- */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>{" "}
          {/* Icon color handled by CSS */}
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 px-md-3">
            {" "}
            {/* Added padding */}
            <li className="nav-item">
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "create" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "create")}
              >
                Create Avatar
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "voice" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "voice")}
              >
                Voice Cloning
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link nav-link-animated ${
                  activeTab === "info" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => handleNavClick(e, "info")}
              >
                How It Works
              </a>
            </li>
          </ul>

          {/* Right Aligned Items */}
          <div className="d-flex align-items-center gap-2">
            {" "}
            {/* Use gap for spacing */}
            {/* Theme Toggle Button - Circular */}
            <button
              onClick={toggleTheme}
              // Use custom class for specific size/shape + standard button classes
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
            {/* Auth Buttons - Smaller Size */}
            <button
              className="btn btn-outline-light btn-sm btn-animated" // Added btn-sm
              type="button"
              onClick={openLoginModal}
            >
              Login
            </button>
            {/* Use btn-light for better contrast on purple bg */}
            <button
              className="btn btn-light btn-sm btn-animated" // Added btn-sm
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
