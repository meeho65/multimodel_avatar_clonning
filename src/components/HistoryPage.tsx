// src/components/HistoryPage.tsx
import React, { useState, useEffect } from "react";

// Re-use the interface (or define it in a shared types file)
interface VideoHistoryItem {
  id: number;
  prompt: string;
  videoUrl: string;
  timestamp: number;
}

export const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<VideoHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedHistory = localStorage.getItem("videoHistory");
      if (storedHistory) {
        // Parse and sort by timestamp descending (newest first)
        const parsedHistory: VideoHistoryItem[] = JSON.parse(storedHistory);
        parsedHistory.sort((a, b) => b.timestamp - a.timestamp); // Sort newest first
        setHistoryItems(parsedHistory);
      } else {
        setHistoryItems([]); // Ensure it's an empty array if nothing is stored
      }
    } catch (error) {
      console.error("Failed to load or parse video history:", error);
      setHistoryItems([]); // Set empty on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means run only once on mount

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(); // Simple locale string format
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-body">Video Generation History</h2>

      {isLoading && (
        <div className="text-center text-muted">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading history...</span>
          </div>
          <p>Loading history...</p>
        </div>
      )}

      {!isLoading && historyItems.length === 0 && (
        <div className="alert alert-info" role="alert">
          No video history found. Generate some videos in the 'Avatar Chat'
          section first!
        </div>
      )}

      {!isLoading && historyItems.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {historyItems.map((item) => (
            <div key={item.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-header small text-muted">
                  Generated: {formatTimestamp(item.timestamp)}
                </div>
                {/* Video Player */}
                <div
                  className="card-body p-2 bg-body-tertiary d-flex justify-content-center align-items-center"
                  style={{ minHeight: "150px" }}
                >
                  <video
                    controls
                    preload="metadata" // Only load metadata initially
                    className="img-fluid rounded" // Use img-fluid for responsiveness
                    style={{ maxHeight: "250px" }} // Control max video height
                    src={item.videoUrl} // Set source directly
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
                {/* Optional Footer for actions */}
                {/* <div className="card-footer d-flex justify-content-end">
                                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
