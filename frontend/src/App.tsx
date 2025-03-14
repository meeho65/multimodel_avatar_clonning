import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { CreateAvatar } from "./components/CreateAvatar";
import { Voice } from "./components/Voice";
import { Info } from "./components/Info";
import { LoginModal } from "./components/LoginModal";
import { SignupModal } from "./components/SignupModal";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <Home setActiveTab={setActiveTab} />;
      case "create":
        return <CreateAvatar />;
      case "voice":
        return <Voice />;
      case "info":
        return <Info />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        setActiveTab={setActiveTab}
        openLoginModal={() => setLoginModalOpen(true)}
      />
      <main className="flex-grow-1 container py-4">{renderTabContent()}</main>
      <Footer />

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          onSwitchToSignup={() => {
            setLoginModalOpen(false);
            setSignupModalOpen(true);
          }}
        />
      )}

      {isSignupModalOpen && (
        <SignupModal onClose={() => setSignupModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
