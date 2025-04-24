// src/components/ChatPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { SendFill } from "react-bootstrap-icons";

// Interfaces
interface VideoHistoryItem {
  id: number;
  prompt: string;
  videoUrl: string;
  timestamp: number;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "avatar";
}

const PLACEHOLDER_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Effect to scroll chat history to the bottom
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]); // Run when messages array changes

  // Handler for textarea input change
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // This is crucial: update the state with the current value
    setInputValue(event.target.value);
    // Auto-resize logic (optional but nice)
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  // Handler for pressing Enter key in textarea
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isLoading) {
      // Also check isLoading here
      event.preventDefault(); // Prevent newline
      handleSendMessage(); // Trigger send
    }
  };

  // Handler for sending a message (form submission or Enter key)
  const handleSendMessage = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault(); // Prevent full page reload on form submit

    const trimmedInput = inputValue.trim();
    // Prevent sending empty messages or sending while already loading
    if (!trimmedInput || isLoading) return;

    const userMessageId = Date.now(); // Use a consistent ID for user message + history item
    const newUserMessage: Message = {
      id: userMessageId,
      text: trimmedInput,
      sender: "user",
    };

    // Update messages state and clear input FIRST
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");

    // Reset textarea height after clearing value
    const textarea = document.getElementById(
      "chat-input-textarea"
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = "auto";
    }

    // Set loading state and clear previous video
    setIsLoading(true); // <-- Set loading TRUE
    setVideoUrl(null);

    console.log("Simulating avatar response for:", trimmedInput);

    // Simulate the async operation (API call + video generation)
    setTimeout(() => {
      try {
        // 1. Generate simulated response
        const avatarResponseText = `Okay, processing "${trimmedInput.substring(
          0,
          30
        )}${trimmedInput.length > 30 ? "..." : ""}". Generating video...`;
        const newAvatarMessage: Message = {
          id: Date.now() + 1, // Simple unique enough ID
          text: avatarResponseText,
          sender: "avatar",
        };

        // 2. Simulate video URL generation
        const generatedVideoUrl = PLACEHOLDER_VIDEO + `?t=${userMessageId}`;

        // 3. Save to History
        try {
          const currentHistoryString =
            localStorage.getItem("videoHistory") || "[]";
          const currentHistory: VideoHistoryItem[] =
            JSON.parse(currentHistoryString);
          const newItem: VideoHistoryItem = {
            id: userMessageId,
            prompt: trimmedInput,
            videoUrl: generatedVideoUrl,
            timestamp: userMessageId,
          };
          const updatedHistory = [newItem, ...currentHistory];
          localStorage.setItem("videoHistory", JSON.stringify(updatedHistory));
          console.log("Saved video to history:", newItem);
        } catch (error) {
          console.error("Failed to save video history:", error);
        }

        // 4. Update state with response and video
        setMessages((prevMessages) => [...prevMessages, newAvatarMessage]);
        setVideoUrl(generatedVideoUrl);
      } catch (error) {
        console.error("Error during simulated response generation:", error);
        // Optionally: Add an error message to the chat
        const errorMessage: Message = {
          id: Date.now() + 2,
          text: "Sorry, something went wrong.",
          sender: "avatar",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        // *** CRITICAL: Always reset loading state ***
        setIsLoading(false); // <-- Set loading FALSE
      }
    }, 2500); // Simulation delay
  };

  // --- JSX RETURN STATEMENT ---
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-body">Avatar Chat & Video</h2>
      <div className="row g-4">
        {/* Video Column */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h5 className="mb-0 card-title">Avatar Response</h5>
            </div>
            <div
              className="card-body d-flex justify-content-center align-items-center bg-body-tertiary position-relative"
              style={{ minHeight: "300px" }}
            >
              {isLoading && (
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Generating video...</span>
                </div>
              )}
              {!isLoading && videoUrl && (
                <video
                  key={videoUrl}
                  controls
                  autoPlay
                  muted
                  className="img-fluid rounded"
                  style={{ maxHeight: "500px" }}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {!isLoading && !videoUrl && (
                <div className="text-center text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    fill="currentColor"
                    className="bi bi-camera-video-off mb-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 6H1.274l-1.17-1.17.94-.94L12.44 12.44l-.94.94-1.17-1.17A1.99 1.99 0 0 0 10.961 12.365ZM3.818 6.5H9.5a1 1 0 0 1 1 1v.684l2 2V11.73l-2-2V7.5a.5.5 0 0 0-.5-.5H5.06l.94.94.683-.194zM1 13.5a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v.684l-2 2V13.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v.184l-2-2V12.5A1 1 0 0 1 1 11.5Zm.847-8.808 1.17-1.17A1 1 0 0 1 4 3h6a1 1 0 0 1 1 1v.684l-2-2V4a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5v.184Z"
                    />
                  </svg>
                  <p>Video response will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Column */}
        <div className="col-lg-5">
          <div
            className="card shadow-sm d-flex flex-column"
            style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}
          >
            <div className="card-header">
              <h5 className="mb-0 card-title">Chat</h5>
            </div>
            {/* Chat History */}
            <div
              ref={chatHistoryRef}
              className="card-body flex-grow-1 overflow-auto p-3"
            >
              {messages.map(
                (
                  msg: Message // Ensure msg is typed
                ) => (
                  <div
                    key={msg.id}
                    className={`d-flex ${
                      msg.sender === "user"
                        ? "justify-content-end"
                        : "justify-content-start"
                    } mb-2`}
                  >
                    <div
                      className={`p-2 rounded shadow-sm mw-75 ${
                        msg.sender === "user"
                          ? "bg-primary text-white"
                          : "bg-body-secondary text-body"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                )
              )}
              {/* Typing Indicator */}
              {isLoading &&
                messages.length > 0 &&
                (messages[messages.length - 1] as Message).sender ===
                  "user" && (
                  <div className="d-flex justify-content-start mb-2">
                    <div className="p-2 rounded shadow-sm bg-body-secondary text-muted fst-italic">
                      <span
                        className="spinner-grow spinner-grow-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Avatar is generating...
                    </div>
                  </div>
                )}
            </div>
            {/* Chat Input */}
            <div className="card-footer p-0 border-top">
              <form
                onSubmit={handleSendMessage}
                className="d-flex align-items-end p-2"
              >
                <textarea
                  id="chat-input-textarea"
                  className="form-control me-2"
                  placeholder="Type your message..."
                  value={inputValue} // Value depends on state
                  onChange={handleInputChange} // Updates state
                  onKeyDown={handleKeyDown} // Handles Enter key
                  rows={1}
                  style={{
                    resize: "none",
                    overflowY: "auto",
                    maxHeight: "100px",
                  }}
                  disabled={isLoading} // Disabled based on state
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-animated"
                  disabled={isLoading || !inputValue.trim()}
                  aria-label="Send message"
                >
                  <SendFill />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
