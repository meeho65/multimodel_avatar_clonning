import React, { useState } from "react";

interface SignupModalProps {
  onClose: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your signup logic here
    console.log("Signing up with", { username, email, password });
    onClose(); // Close modal after signup attempt
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
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6c63ff",
              cursor: "pointer",
            }}
          >
            Log in here
          </button>
        </p>
      </div>
    </div>
  );
};
