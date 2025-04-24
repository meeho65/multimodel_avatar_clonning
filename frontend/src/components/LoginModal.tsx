import React, { useState } from "react";

export const LoginModal: React.FC<{
  onClose: () => void;
  onSwitchToSignup: () => void;
}> = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    onClose(); // Close modal after login attempt
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              margin: "10px 0",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              margin: "10px 0",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#6c63ff",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "4px",
              width: "100%",
            }}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            style={{
              background: "none",
              border: "none",
              color: "#6c63ff",
              cursor: "pointer",
            }}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};
