// src/App.tsx
import React, { useState, useRef, useEffect } from "react"; // Import useEffect
import "bootstrap/dist/css/bootstrap.min.css";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { CreateAvatar } from "./components/CreateAvatar";
import { Voice } from "./components/Voice";
import { Info } from "./components/Info";
import { LoginModal } from "./components/LoginModal";
import { SignupModal } from "./components/SignupModal";
import "./animations.css";
import "./Theme.css";

// Function to get initial theme preference
const getInitialTheme = (): "light" | "dark" => {
  const persistedTheme = localStorage.getItem("theme");
  if (persistedTheme === "light" || persistedTheme === "dark") {
    return persistedTheme;
  }
  // Check OS preference if no persisted theme
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [activeTab, setActiveTab] = useState("home");
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const nodeRefLogin = useRef(null);
  const nodeRefSignup = useRef(null);
  const nodeRefOverlayLogin = useRef(null);
  const nodeRefOverlaySignup = useRef(null);
  const pageRef = useRef(null);

  // Effect to apply theme attribute and save to localStorage
  useEffect(() => {
    // Apply theme attribute to <html> element
    document.documentElement.setAttribute("data-bs-theme", theme);
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]); // Re-run only when theme changes

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <Home setActiveTab={setActiveTab} />;
      case "create":
        return <CreateAvatar setActiveTab={setActiveTab} />;
      case "voice":
        return <Voice setActiveTab={setActiveTab} />;
      case "info":
        return <Info />;
      default:
        // Bootstrap text color utilities adapt based on data-bs-theme
        return <div className="text-body">Page not found</div>;
    }
  };

  // --- Modal Handlers (remain the same) ---
  const handleCloseLogin = () => setLoginModalOpen(false);
  const handleCloseSignup = () => setSignupModalOpen(false);
  const handleSwitchToSignup = () => {
    setLoginModalOpen(false);
    setTimeout(() => setSignupModalOpen(true), 200);
  };
  const handleSwitchToLogin = () => {
    setSignupModalOpen(false);
    setTimeout(() => setLoginModalOpen(true), 200);
  };

  return (
    // Remove bg-dark and text-light here; theme is now controlled globally by data-bs-theme
    // <div className="d-flex flex-column min-vh-100 bg-dark text-light">
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openLoginModal={() => setLoginModalOpen(true)}
        openSignupModal={() => setSignupModalOpen(true)}
        currentTheme={theme} // Pass current theme
        toggleTheme={toggleTheme} // Pass toggle function
      />
      <main className="flex-grow-1 container py-4">
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={activeTab}
            nodeRef={pageRef}
            timeout={300}
            classNames="page-fade"
            unmountOnExit
          >
            <div ref={pageRef}>{renderTabContent()}</div>
          </CSSTransition>
        </SwitchTransition>
      </main>
      <Footer />

      {/* --- Modals (No changes needed here) --- */}
      {/* Overlay Login */}
      <CSSTransition
        nodeRef={nodeRefOverlayLogin}
        in={isLoginModalOpen}
        timeout={200}
        classNames="modal-overlay-fade"
        unmountOnExit
      >
        {/* Use Bootstrap's modal-backdrop */}
        <div
          ref={nodeRefOverlayLogin}
          className="modal-backdrop fade show"
          style={{ zIndex: 1050 }}
        ></div>
      </CSSTransition>
      {/* Modal Login */}
      <CSSTransition
        nodeRef={nodeRefLogin}
        in={isLoginModalOpen}
        timeout={200}
        classNames="modal-fade"
        unmountOnExit
      >
        <LoginModal
          ref={nodeRefLogin}
          show={isLoginModalOpen}
          onClose={handleCloseLogin}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </CSSTransition>
      {/* Overlay Signup */}
      <CSSTransition
        nodeRef={nodeRefOverlaySignup}
        in={isSignupModalOpen}
        timeout={200}
        classNames="modal-overlay-fade"
        unmountOnExit
      >
        <div
          ref={nodeRefOverlaySignup}
          className="modal-backdrop fade show"
          style={{ zIndex: 1050 }}
        ></div>
      </CSSTransition>
      {/* Modal Signup */}
      <CSSTransition
        nodeRef={nodeRefSignup}
        in={isSignupModalOpen}
        timeout={200}
        classNames="modal-fade"
        unmountOnExit
      >
        <SignupModal
          ref={nodeRefSignup}
          show={isSignupModalOpen}
          onClose={handleCloseSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </CSSTransition>
    </div>
  );
};

export default App;
