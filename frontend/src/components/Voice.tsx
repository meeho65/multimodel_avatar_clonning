import React, { useState } from "react";

export const Voice: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingCompleted(true);
  };

  const handleContinue = () => {
    // Handle continuation to avatar creation
  };

  const handleRecordAgain = () => {
    setRecordingCompleted(false);
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        color: "#222",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          textAlign: "left",
        }}
      >
        Voice Cloning
      </h2>
      <div
        style={{
          border: "1px solid #fff",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px auto",
          width: "400px",
        }}
        className="bg-light bg-gradient"
      >
        <h3>Record Your Voice</h3>
        <p>
          Record a short audio sample to clone your voice. For best results,
          speak clearly in a quiet environment.
        </p>
        {isRecording ? (
          <>
            <p style={{ color: "red" }}>Recording...</p>
            <button
              onClick={stopRecording}
              style={{
                backgroundColor: "#6c63ff",
                color: "#fff",
                padding: "10px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Stop Recording
            </button>
          </>
        ) : recordingCompleted ? (
          <>
            <p>Recording complete!</p>
            <audio controls>
              <source src="recording-url" type="audio/wav" />
            </audio>
            <button
              onClick={handleContinue}
              style={{
                backgroundColor: "#6c63ff",
                color: "#fff",
                padding: "10px",
                margin: "10px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Continue to Avatar Creation
            </button>
            <button
              onClick={handleRecordAgain}
              style={{
                backgroundColor: "#ccc",
                color: "#000",
                padding: "10px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Record Again
            </button>
          </>
        ) : (
          <button
            onClick={startRecording}
            style={{
              backgroundColor: "#6c63ff",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Start Recording
          </button>
        )}
      </div>

      <div
        style={{
          border: "1px solid #fff",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px auto",
          backgroundColor: "rgb(230, 230, 230)",
          textAlign: "left",
        }}
      >
        <h4>Tips for Better Voice Cloning:</h4>
        <ul>
          <li>Record in a quiet environment with minimal background noise</li>
          <li>Speak clearly and at a consistent pace</li>
          <li>Use a good quality microphone if available</li>
          <li>
            Read a variety of sentences to capture your voice characteristics
          </li>
        </ul>
      </div>
    </div>
  );
};
