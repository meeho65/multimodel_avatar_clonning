// src/components/CreateAvatar.tsx
import React, { useState } from "react";

// Define the structure for a saved avatar profile
interface AvatarProfile {
  id: number; // Unique ID (timestamp for now)
  name: string;
  description: string;
  style: string;
  background: string;
  accessories: string;
  clothes: string;
  previewUrl: string | null; // The generated placeholder/image URL
  createdAt: number; // Timestamp for sorting later if needed
}

interface CreateAvatarProps {
  setActiveTab: (tab: string) => void; // Keep for potential navigation later
}

// Sample Options (replace with your actual options)
const backgroundOptions = [
  "Office",
  "Space Station",
  "Forest",
  "Abstract Purple",
  "None",
];
const accessoriesOptions = ["Glasses", "Hat", "Scarf", "Earrings", "None"];
const clothesOptions = [
  "Business Suit",
  "T-Shirt & Jeans",
  "Sci-Fi Uniform",
  "Casual Hoodie",
  "None",
];

export const CreateAvatar: React.FC<CreateAvatarProps> = ({ setActiveTab }) => {
  const [avatarName, setAvatarName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarStyle, setAvatarStyle] = useState("Realistic");
  // --- New State ---
  const [background, setBackground] = useState(backgroundOptions[0]);
  const [accessories, setAccessories] = useState(
    accessoriesOptions[accessoriesOptions.length - 1]
  ); // Default to 'None'
  const [clothes, setClothes] = useState(clothesOptions[1]); // Default to T-shirt
  // ---------------
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(
    null
  ); // Renamed for clarity
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // For save button state

  const handleGeneratePreview = async () => {
    // Renamed function
    setIsLoading(true);
    setGeneratedAvatarUrl(null);
    console.log("Generating preview for:", {
      avatarName,
      description,
      avatarStyle,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Shorter delay for preview
    setGeneratedAvatarUrl(
      "https://via.placeholder.com/150/" +
        (document.documentElement.getAttribute("data-bs-theme") === "dark"
          ? "888"
          : "ddd") +
        "/000?text=" +
        encodeURIComponent(avatarName || "Preview")
    );
    setIsLoading(false);
  };

  const handleSaveAvatar = () => {
    if (!avatarName || !description || !generatedAvatarUrl) {
      alert(
        "Please provide a name, description, and generate a preview before saving."
      );
      return;
    }
    setIsSaving(true);

    const newAvatar: AvatarProfile = {
      id: Date.now(), // Use timestamp as unique ID
      name: avatarName,
      description: description,
      style: avatarStyle,
      background: background,
      accessories: accessories,
      clothes: clothes,
      previewUrl: generatedAvatarUrl, // Save the preview URL
      createdAt: Date.now(),
    };

    console.log("Saving Avatar:", newAvatar);

    try {
      const currentAvatarsString = localStorage.getItem("savedAvatars") || "[]";
      const currentAvatars: AvatarProfile[] = JSON.parse(currentAvatarsString);
      const updatedAvatars = [newAvatar, ...currentAvatars]; // Add new one to the start
      localStorage.setItem("savedAvatars", JSON.stringify(updatedAvatars));
      alert(`Avatar "${avatarName}" saved successfully!`);
      handleClear(); // Clear form after saving
    } catch (error) {
      console.error("Failed to save avatar to localStorage:", error);
      alert("Error saving avatar. Please check console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setAvatarName("");
    setDescription("");
    setAvatarStyle("Realistic");
    setBackground(backgroundOptions[0]);
    setAccessories(accessoriesOptions[accessoriesOptions.length - 1]);
    setClothes(clothesOptions[1]);
    setGeneratedAvatarUrl(null);
    setIsLoading(false);
    setIsSaving(false);
  };

  // Removed handleNext function

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-body">Create & Save New Avatar</h2>

      <div className="row g-4">
        {/* Input Column */}
        <div className="col-md-6">
          <div className="card p-4 h-100">
            <h3 className="mb-3 card-title">Avatar Configuration</h3>

            {/* --- Existing Fields --- */}
            <div className="mb-3">
              <label htmlFor="avatarName" className="form-label">
                Avatar Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="avatarName"
                placeholder="E.g., Alex, Project Assistant"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                disabled={isLoading || isSaving}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                rows={3}
                placeholder="E.g., mid-30s male..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading || isSaving}
                required
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
                disabled={isLoading || isSaving}
              >
                <option value="Realistic">Realistic</option>
                <option value="Cartoon">Cartoon</option>
                <option value="Anime">Anime</option>
                <option value="Stylized">Stylized</option>
              </select>
            </div>

            {/* --- New Dropdowns --- */}
            <div className="mb-3">
              <label htmlFor="background" className="form-label">
                Background
              </label>
              <select
                className="form-select"
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                disabled={isLoading || isSaving}
              >
                {backgroundOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="accessories" className="form-label">
                Accessories
              </label>
              <select
                className="form-select"
                id="accessories"
                value={accessories}
                onChange={(e) => setAccessories(e.target.value)}
                disabled={isLoading || isSaving}
              >
                {accessoriesOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="clothes" className="form-label">
                Clothes
              </label>
              <select
                className="form-select"
                id="clothes"
                value={clothes}
                onChange={(e) => setClothes(e.target.value)}
                disabled={isLoading || isSaving}
              >
                {clothesOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* --- End New Dropdowns --- */}

            <div className="mt-auto d-flex justify-content-start flex-wrap gap-2 pt-3">
              {/* Generate Preview Button */}
              <button
                className="btn btn-info btn-animated"
                onClick={handleGeneratePreview}
                disabled={isLoading || isSaving || !description}
              >
                {isLoading ? (
                  <>
                    {" "}
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Generating...{" "}
                  </>
                ) : (
                  "Generate Preview"
                )}
              </button>
              {/* Save Button */}
              <button
                className="btn btn-success btn-animated"
                onClick={handleSaveAvatar}
                disabled={
                  isLoading || isSaving || !generatedAvatarUrl || !avatarName
                }
              >
                {isSaving ? (
                  <>
                    {" "}
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Saving...{" "}
                  </>
                ) : (
                  "Save Avatar"
                )}
              </button>
              {/* Clear Button */}
              <button
                className="btn btn-secondary btn-animated"
                onClick={handleClear}
                disabled={isLoading || isSaving}
              >
                Clear
              </button>
              {/* Removed Next Button */}
            </div>
          </div>
        </div>

        {/* Preview Column (shows the generated image only) */}
        <div className="col-md-6">
          <div className="card p-4 h-100 d-flex flex-column">
            <h3 className="mb-3 text-start card-title">Preview</h3>
            <div className="text-center flex-grow-1 d-flex justify-content-center align-items-center bg-body-tertiary rounded p-3">
              {isLoading ? (
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  {" "}
                  <span className="visually-hidden">Loading...</span>{" "}
                </div>
              ) : generatedAvatarUrl ? (
                <div>
                  <img
                    src={generatedAvatarUrl}
                    alt={avatarName || "Generated Preview"}
                    className="img-fluid rounded mb-2"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                  <p className="mb-0 fw-bold">
                    {avatarName || "Your Avatar Name"}
                  </p>
                  <p className="text-muted small mb-0">{avatarStyle} Style</p>
                </div>
              ) : (
                <div className="text-secondary">
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
                  <p>Generate a preview to see the basic look.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
