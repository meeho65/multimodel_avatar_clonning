// src/components/Voice.tsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowRightCircleFill } from "react-bootstrap-icons";
// Import an audio library if needed, e.g., Mic-Recorder-To-MP3 or native MediaRecorder API

interface VoiceProps {
  setActiveTab: (tab: string) => void; // Accept navigation prop
}

export const Voice: React.FC<VoiceProps> = ({ setActiveTab }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // State for cloning process

  // Refs for media recorder (example using native API)
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        mediaRecorder.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = []; // Clear previous chunks

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" }); // Or 'audio/webm', etc.
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordingCompleted(true);
        setIsRecording(false);
        // Clean up the stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingCompleted(false); // Reset completion state
      setAudioURL(null); // Clear previous URL
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "Could not access microphone. Please ensure permission is granted."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      // State updates happen in the onstop handler
    }
  };

  const handleProcessVoice = async () => {
    if (!audioURL) return;
    setIsProcessing(true);
    console.log("Processing voice sample:", audioURL);
    // --- Placeholder for API call to clone voice ---
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Voice sample processed successfully! (Simulated)");
      // alert("Voice sample processed successfully! (Simulated)"); // Maybe skip alert if navigating

      // *** Navigate to chat page after successful processing ***
      setActiveTab("chat");
    } catch (error) {
      console.error("Voice cloning/processing failed:", error);
      alert("Voice processing failed. Please try again.");
      setIsProcessing(false); // Only set processing false on error if not navigating
    }
    // } finally {
    // }
    // --- End Placeholder ---
  };

  const handleRecordAgain = () => {
    setRecordingCompleted(false);
    setAudioURL(null);
    setIsRecording(false);
    setIsProcessing(false);
    // Clean up previous blob URL
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Voice Cloning</h2>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 mb-4 text-dark shadow-sm">
            {" "}
            {/* Added shadow */}
            <h3 className="text-center mb-3">Record Your Voice</h3>
            <p className="text-center text-muted mb-4">
              Record a short audio sample (5-10 seconds recommended) in a quiet
              environment. Speak clearly as you would normally.
            </p>
            <div className="text-center">
              {!isRecording && !recordingCompleted && (
                <button
                  onClick={startRecording}
                  className="btn btn-lg btn-success btn-animated px-5" // Use Bootstrap classes
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="bi bi-mic-fill me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                  </svg>
                  Start Recording
                </button>
              )}

              {isRecording && (
                <>
                  <p className="text-danger fw-bold mb-3">
                    <span
                      className="spinner-grow spinner-grow-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Recording...
                  </p>
                  <button
                    onClick={stopRecording}
                    className="btn btn-lg btn-danger btn-animated px-5" // Use Bootstrap classes
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-stop-circle-fill me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5h-3z" />
                    </svg>
                    Stop Recording
                  </button>
                </>
              )}

              {recordingCompleted && audioURL && (
                <>
                  <p className="text-success fw-bold mb-2">
                    Recording complete!
                  </p>
                  <audio controls src={audioURL} className="mb-3 w-100">
                    Your browser does not support the audio element.
                  </audio>
                  <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <button
                      onClick={handleRecordAgain}
                      className="btn btn-secondary btn-animated" // Use Bootstrap classes
                      disabled={isProcessing}
                    >
                      Record Again
                    </button>
                    <button
                      onClick={handleProcessVoice}
                      className="btn btn-primary btn-animated" // Use Bootstrap classes
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#6c5ce7",
                        borderColor: "#6c5ce7",
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          Process Voice Sample {/* Old Text */}
                          Use Voice & Chat{" "}
                          <ArrowRightCircleFill className="ms-2" />{" "}
                          {/* New Text & Icon */}
                        </>
                      )}
                    </button>
                    {/* Example: Add a button to navigate to the next logical step after processing */}
                    {/* <button
                       onClick={() => setActiveTab('animation')} // Navigate to animation/integration step
                       className="btn btn-info btn-animated"
                       disabled={isProcessing} // Enable after processing is successful?
                     >
                       Next: Animate Avatar
                     </button> */}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="card bg-light border-0 p-3">
            <div className="card-body text-dark">
              <h4 className="h6 text-muted">Tips for Better Voice Cloning:</h4>
              <ul className="list-unstyled small text-muted mb-0">
                <li className="mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    className="bi bi-check-circle-fill me-1 text-success"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  Record in a quiet room.
                </li>
                <li className="mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    className="bi bi-check-circle-fill me-1 text-success"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  Speak clearly at a normal pace.
                </li>
                <li className="mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    className="bi bi-check-circle-fill me-1 text-success"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  Use a decent microphone if possible.
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    className="bi bi-check-circle-fill me-1 text-success"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  Aim for 5-10 seconds of continuous speech.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
