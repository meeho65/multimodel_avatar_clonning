// src/components/HistoryPage.tsx
import React, { useState, useEffect } from "react";
import { PersonCircle, ArrowLeftCircleFill } from "react-bootstrap-icons"; // Add Back icon

// Interfaces (should match definitions elsewhere or be imported)
interface AvatarProfile {
  id: number;
  name: string;
  description: string;
  style: string;
  background: string;
  accessories: string;
  clothes: string;
  previewUrl: string | null;
  createdAt: number;
}
interface VideoHistoryItem {
  id: number;
  prompt: string;
  videoUrl: string;
  timestamp: number;
  avatarId: number; // Include avatarId
}

export const HistoryPage: React.FC = () => {
  // State for loaded data
  const [allAvatars, setAllAvatars] = useState<AvatarProfile[]>([]);
  const [allHistory, setAllHistory] = useState<VideoHistoryItem[]>([]);

  // State for UI control
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarProfile | null>(
    null
  ); // Store the selected avatar object
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list"); // 'list' or 'detail'

  // Load ALL data on mount
  useEffect(() => {
    setIsLoading(true);
    console.log("HistoryPage: Loading data...");
    try {
      // Load Avatars
      const storedAvatars = localStorage.getItem("savedAvatars");
      const parsedAvatars: AvatarProfile[] = storedAvatars
        ? JSON.parse(storedAvatars)
        : [];
      parsedAvatars.sort((a, b) => b.createdAt - a.createdAt); // Sort newest first
      setAllAvatars(parsedAvatars);
      console.log("HistoryPage: Loaded avatars", parsedAvatars.length);

      // Load Video History
      const storedHistory = localStorage.getItem("videoHistory");
      const parsedHistory: VideoHistoryItem[] = storedHistory
        ? JSON.parse(storedHistory)
        : [];
      parsedHistory.sort((a, b) => b.timestamp - a.timestamp); // Sort newest first
      setAllHistory(parsedHistory);
      console.log("HistoryPage: Loaded history items", parsedHistory.length);
    } catch (error) {
      console.error("HistoryPage: Failed to load data:", error);
      setAllAvatars([]);
      setAllHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Run only once on mount

  // Function to handle clicking on an avatar profile card
  const handleSelectAvatar = (avatar: AvatarProfile) => {
    setSelectedAvatar(avatar);
    setViewMode("detail");
  };

  // Function to go back to the avatar list view
  const handleGoBackToList = () => {
    setSelectedAvatar(null);
    setViewMode("list");
  };

  // Filter video history for the selected avatar
  const filteredHistory = selectedAvatar
    ? allHistory.filter((item) => item.avatarId === selectedAvatar.id)
    : [];

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // --- Render Logic ---
  return (
    <div className="container mt-4">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-muted">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading data...</p>
        </div>
      )}

      {/* View: Avatar List */}
      {!isLoading && viewMode === "list" && (
        <>
          <h2 className="mb-4 text-body">Avatar Profiles</h2>
          {allAvatars.length === 0 && (
            <div className="alert alert-info" role="alert">
              No avatars saved yet. Go to 'Create Avatar' to make one.
            </div>
          )}
          {allAvatars.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {allAvatars.map((avatar) => (
                <div key={avatar.id} className="col">
                  {/* Make card clickable */}
                  <div
                    className="card h-100 shadow-sm btn-animated text-decoration-none text-body"
                    role="button" // Indicate it's clickable
                    tabIndex={0} // Make it focusable
                    onClick={() => handleSelectAvatar(avatar)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSelectAvatar(avatar)
                    } // Allow Enter key selection
                    style={{ cursor: "pointer" }} // Change cursor on hover
                  >
                    <div
                      className="card-img-top bg-body-tertiary d-flex align-items-center justify-content-center"
                      style={{ height: "150px" }}
                    >
                      {avatar.previewUrl ? (
                        <img
                          src={avatar.previewUrl}
                          alt={`${avatar.name} preview`}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                            borderRadius: "0.375rem 0.375rem 0 0",
                          }}
                        />
                      ) : (
                        <PersonCircle
                          size={60}
                          className="text-secondary opacity-50"
                        />
                      )}
                    </div>
                    <div className="card-body text-center">
                      <h5 className="card-title h6">{avatar.name}</h5>
                      <p className="card-text small text-muted mb-0">
                        {avatar.style}
                      </p>
                    </div>
                    <div className="card-footer text-center small text-muted">
                      Created: {formatTimestamp(avatar.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* View: Video History for Selected Avatar */}
      {!isLoading && viewMode === "detail" && selectedAvatar && (
        <>
          <div className="d-flex align-items-center mb-4">
            <button
              className="btn btn-link p-0 me-3"
              onClick={handleGoBackToList}
              title="Back to Avatar List"
            >
              <ArrowLeftCircleFill size={24} />
            </button>
            <h2 className="text-body mb-0">
              History for: {selectedAvatar.name} ({selectedAvatar.style})
            </h2>
          </div>

          {filteredHistory.length === 0 && (
            <div className="alert alert-secondary" role="alert">
              No video history found for this avatar yet.
            </div>
          )}
          {filteredHistory.length > 0 && (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header small text-muted">
                      Generated: {formatTimestamp(item.timestamp)}
                    </div>
                    <div
                      className="card-body p-2 bg-body-tertiary d-flex justify-content-center align-items-center"
                      style={{ minHeight: "150px" }}
                    >
                      <video
                        controls
                        preload="metadata"
                        className="img-fluid rounded"
                        style={{ maxHeight: "250px" }}
                        src={item.videoUrl}
                      >
                        Your browser does not support the video tag.
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download video
                        </a>
                      </video>
                    </div>
                    <div className="card-body pt-2">
                      <p className="card-text small fst-italic">
                        <strong className="text-primary">Prompt:</strong> "
                        {item.prompt}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div> // End Container
  );
};
