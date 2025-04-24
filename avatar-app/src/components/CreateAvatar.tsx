// src/components/CreateAvatar.tsx
import React, { useState } from "react";

interface CreateAvatarProps {
  setActiveTab: (tab: string) => void;
}

export const CreateAvatar: React.FC<CreateAvatarProps> = ({ setActiveTab }) => {
  const [avatarName, setAvatarName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarStyle, setAvatarStyle] = useState("Realistic");
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null); // Type for potential image URL
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const handleGenerate = async () => {
    // Make async if calling API
    setIsLoading(true);
    setGeneratedAvatar(null); // Clear previous
    console.log("Generating avatar with:", {
      avatarName,
      description,
      avatarStyle,
    });
    // --- Placeholder for API call ---
    // try {
    //   // const response = await fetch('/api/generate-avatar', { method: 'POST', ... });
    //   // const data = await response.json();
    //   // setGeneratedAvatar(data.imageUrl); // Assuming API returns an image URL
    //   // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
    setGeneratedAvatar(
      "https://via.placeholder.com/150/6c5ce7/FFFFFF?text=" +
        encodeURIComponent(avatarName || "Avatar")
    ); // Example placeholder image
    // } catch (error) {
    //   console.error("Avatar generation failed:", error);
    //   // Show error message to user
    // } finally {
    setIsLoading(false);
    // }
    // --- End Placeholder ---
  };

  const handleClear = () => {
    setAvatarName("");
    setDescription("");
    setAvatarStyle("Realistic");
    setGeneratedAvatar(null);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (generatedAvatar) {
      // Only allow next if avatar is generated? (optional logic)
      setActiveTab("voice"); // Navigate to the Voice tab
    } else {
      alert("Please generate an avatar first."); // Or provide other feedback
    }
  };

  return (
    // Use text-dark for card content if base is text-light from App.tsx
    <div className="container mt-4">
      <h2 className="mb-4">Create Your Avatar</h2>{" "}
      {/* Explicitly set text color for visibility against dark background */}
      <div className="row">
        {/* Input Column */}
        <div className="col-md-6 mb-4 mb-md-0">
          <div className="card p-4 h-100 text-dark">
            {" "}
            {/* Add text-dark */}
            <h3 className="mb-3">Avatar Configuration</h3>
            <div className="mb-3">
              <label htmlFor="avatarName" className="form-label">
                Avatar Name
              </label>
              <input
                type="text"
                className="form-control"
                id="avatarName"
                placeholder="E.g., Alex, Project Assistant"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                rows={4}
                placeholder="E.g., mid-30s male, short brown hair, wearing glasses and a blue shirt"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="avatarStyle" className="form-label">
                Avatar Style
              </label>
              <select
                className="form-select"
                id="avatarStyle"
                value={avatarStyle}
                onChange={(e) => setAvatarStyle(e.target.value)}
                disabled={isLoading}
              >
                <option value="Realistic">Realistic</option>
                <option value="Cartoon">Cartoon</option>
                <option value="Anime">Anime</option>
                <option value="Stylized">Stylized</option>
              </select>
            </div>
            <div className="mt-auto d-flex justify-content-start pt-3">
              {" "}
              {/* Use mt-auto to push buttons down */}
              <button
                className="btn btn-primary me-2 btn-animated" // Add class
                onClick={handleGenerate}
                disabled={isLoading || !description} // Disable if loading or no description
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Generating...
                  </>
                ) : (
                  "Generate Avatar"
                )}
              </button>
              <button
                className="btn btn-secondary me-2 btn-animated" // Add class
                onClick={handleClear}
                disabled={isLoading}
              >
                Clear
              </button>
              {/* Next Button - Conditionally enable? */}
              <button
                className="btn btn-success btn-animated" // Add class
                onClick={handleNext}
                disabled={isLoading || !generatedAvatar} // Disable if loading or no avatar generated
              >
                Next: Add Voice
              </button>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="col-md-6">
          <div className="card p-4 h-100 d-flex flex-column text-dark">
            {" "}
            {/* Add text-dark */}
            <h3 className="mb-3 text-start">Preview</h3>
            <div className="text-center flex-grow-1 d-flex justify-content-center align-items-center bg-light rounded p-3">
              {isLoading ? (
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : generatedAvatar ? (
                <div>
                  <img
                    // Use the state variable for the source
                    src={generatedAvatar}
                    alt={avatarName || "Generated Avatar"}
                    className="img-fluid rounded" // Make image responsive and rounded
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }} // Control size
                  />
                  <p className="mt-2 mb-0 fw-bold">
                    {avatarName || "Your Avatar"}
                  </p>
                  <p className="text-muted small mb-0">{avatarStyle} Style</p>
                </div>
              ) : (
                <div className="text-muted">
                  {/* Default placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="currentColor"
                    className="bi bi-person-bounding-box mb-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                  <p>
                    Configure and generate your avatar to see a preview here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
