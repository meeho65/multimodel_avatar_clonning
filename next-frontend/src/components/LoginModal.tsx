import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { toast } from "sonner";

export interface LoginModalInterface {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  setShowLogin: React.Dispatch<SetStateAction<boolean>>;
}
const LoginModal = ({ setOpen, setShowLogin }: LoginModalInterface) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setIsLoading(false);
    if (res?.error) {
      toast.error(res.code);
    } else if (res?.ok) {
      toast.success("Login successful");
      router.replace("/chat");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <form>
      <div className="modal-body text-dark">
        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="loginEmail"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="loginPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="mt-3 mb-0">
          Don&apos;t have an account?{" "}
          <button
            type="button" // Set type to button to prevent form submission
            className="btn btn-link p-0 align-baseline btn-animated" // Style as link
            onClick={() => setShowLogin(false)} // Use the correct handler
          >
            Sign up here
          </button>
        </p>
      </div>
      <div className="modal-footer">
        {/* Standard Close Button */}
        <button
          type="button" // Prevent form submission
          className="btn btn-secondary btn-animated"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn btn-primary btn-animated"
          style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default LoginModal;
