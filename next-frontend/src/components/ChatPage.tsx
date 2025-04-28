// src/components/ChatPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { SendFill, PersonCircle } from "react-bootstrap-icons";
// Make sure your CSS for the layout (ChatPage.css or Theme.css) is imported in main.tsx or App.tsx

// Interfaces (ensure these match definitions elsewhere or are defined here)
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
  const [availableAvatars, setAvailableAvatars] = useState<AvatarProfile[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null); // Use null for none selected
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);

  // --- Load Avatars ---
  useEffect(() => {
    console.log("Loading avatars...");
    setIsLoadingAvatars(true);
    try {
      const storedAvatars = localStorage.getItem("savedAvatars");
      if (storedAvatars) {
        const parsedAvatars: AvatarProfile[] = JSON.parse(storedAvatars);
        // *** Corrected Sorting Typo ***
        parsedAvatars.sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt
        setAvailableAvatars(parsedAvatars);
        // Check if an avatar should be selected initially *only if none is currently selected*
        if (parsedAvatars.length > 0 && selectedAvatarId === null) {
          console.log("Setting initial selected avatar:", parsedAvatars[0].id);
          setSelectedAvatarId(parsedAvatars[0].id);
        } else if (parsedAvatars.length === 0) {
          setSelectedAvatarId(null); // Ensure null if no avatars
        }
      } else {
        setAvailableAvatars([]);
        setSelectedAvatarId(null); // Ensure null if none stored
      }
    } catch (error) {
      console.error("Failed to load avatars:", error);
      setAvailableAvatars([]);
      setSelectedAvatarId(null);
    } finally {
      setIsLoadingAvatars(false);
    }
    // Only run on mount and if selectedAvatarId changes externally (usually won't)
  }, [selectedAvatarId]); // Dependency array includes selectedAvatarId to handle edge cases if needed

  // --- Scroll Chat ---
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Input/Send Handlers ---
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    event.target.style.height = "auto"; // Auto-resize
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !isLoading &&
      !!selectedAvatarId
    ) {
      // Check selectedAvatarId
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const trimmedInput = inputValue.trim();
    // Check selectedAvatarId here too
    if (!trimmedInput || isLoading || !selectedAvatarId) return;

    const selectedAvatar = availableAvatars.find(
      (a) => a.id === selectedAvatarId
    );
    console.log(
      `Sending message using Avatar ID: ${selectedAvatarId}, Name: ${selectedAvatar?.name}`
    );

    const userMessageId = Date.now();
    const newUserMessage: Message = {
      id: userMessageId,
      text: trimmedInput,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");
    const textarea = document.getElementById(
      "chat-input-textarea"
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = "auto";
    }

    setIsLoading(true);
    setVideoUrl(null);

    setTimeout(() => {
      try {
        const avatarResponseText = `Okay, I (${
          selectedAvatar?.name || "Avatar"
        }) am processing "${trimmedInput.substring(
          0,
          20
        )}...". Generating video...`;
        const newAvatarMessage: Message = {
          id: Date.now() + 1,
          text: avatarResponseText,
          sender: "avatar",
        };
        const generatedVideoUrl =
          PLACEHOLDER_VIDEO + `?t=${userMessageId}&avatar=${selectedAvatarId}`;

        // *** Restored History Saving ***
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
            avatarId: selectedAvatarId, // Save the avatar ID
          };
          const updatedHistory = [newItem, ...currentHistory];
          localStorage.setItem("videoHistory", JSON.stringify(updatedHistory));
          console.log("Saved video to history:", newItem);
        } catch (error) {
          console.error("Failed to save video history:", error);
        }
        // *** End History Saving ***

        setMessages((prevMessages) => [...prevMessages, newAvatarMessage]);
        setVideoUrl(generatedVideoUrl);
      } catch (error) {
        console.error("Error during simulated response generation:", error);
        const errorMessage: Message = {
          id: Date.now() + 2,
          text: "Sorry, something went wrong.",
          sender: "avatar",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    }, 2500);
  };

  const handleAvatarSelect = (avatarId: number) => {
    console.log("Avatar selected via sidebar:", avatarId);
    setSelectedAvatarId(avatarId);
    setMessages([]); // Clear chat on avatar switch
    setVideoUrl(null); // Clear video on avatar switch
  };

  // --- Debug Log ---
  // console.log("Render - isLoading:", isLoading, "selectedAvatarId:", selectedAvatarId);

  // --- JSX Return ---
  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 text-body">Avatar Chat & Video</h2>
      {/* Layout Requires CSS */}
      <div className="chat-page-layout">
        {/* Sidebar Column */}
        <div className="avatar-sidebar">
          <h5 className="text-body px-2 mb-2">Your Avatars</h5>
          {isLoadingAvatars && (
            <div className="text-center text-muted p-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!isLoadingAvatars && availableAvatars.length === 0 && (
            <p className="text-muted small px-2">
              No avatars saved yet. Use 'Create Avatar'.
            </p>
          )}
          {!isLoadingAvatars && availableAvatars.length > 0 && (
            <ul className="avatar-list list-unstyled mb-0">
              {availableAvatars.map((avatar) => (
                <li key={avatar.id}>
                  <button
                    type="button"
                    className={`avatar-list-item d-flex align-items-center text-start w-100 p-2 ${
                      selectedAvatarId === avatar.id ? "active" : ""
                    }`}
                    onClick={() => handleAvatarSelect(avatar.id)}
                  >
                    {avatar.previewUrl ? (
                      <img
                        src={avatar.previewUrl}
                        alt={`${avatar.name} preview`}
                      />
                    ) : (
                      <PersonCircle className="avatar-placeholder-icon" /> // Fallback icon
                    )}
                    <span className="avatar-name text-truncate ms-2">
                      {avatar.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Main Content Area (Video + Chat) */}
        <div className="chat-main-content">
          {/* Video Column */}
          <div className="chat-video-column">
            <div className="card shadow-sm h-100">
              <div className="card-header">
                <h5 className="mb-0 card-title">Avatar Response</h5>
              </div>
              <div
                className="card-body d-flex justify-content-center align-items-center bg-body-tertiary position-relative"
                style={{ minHeight: "300px" }}
              >
                {/* Video player / placeholder / loading logic */}
                {isLoading && (
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    {" "}
                    <span className="visually-hidden">
                      Generating video...
                    </span>{" "}
                  </div>
                )}
                {!isLoading && videoUrl && (
                  <video
                    key={videoUrl}
                    controls
                    autoPlay
                    muted
                    className="img-fluid rounded"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                  >
                    {" "}
                    <source src={videoUrl} type="video/mp4" /> Your browser does
                    not support the video tag.{" "}
                  </video>
                )}
                {/* Restored Video Placeholder */}
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
                        fillRule="evenodd"
                        d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 6H1.274l-1.17-1.17.94-.94L12.44 12.44l-.94.94-1.17-1.17A1.99 1.99 0 0 0 10.961 12.365ZM3.818 6.5H9.5a1 1 0 0 1 1 1v.684l2 2V11.73l-2-2V7.5a.5.5 0 0 0-.5-.5H5.06l.94.94.683-.194zM1 13.5a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v.684l-2 2V13.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v.184l-2-2V12.5A1 1 0 0 1 1 11.5Zm.847-8.808 1.17-1.17A1 1 0 0 1 4 3h6a1 1 0 0 1 1 1v.684l-2-2V4a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5v.184Z"
                      />
                    </svg>
                    <p>Video response will appear here.</p>
                  </div>
                )}
                {/* End Video Placeholder */}
              </div>
            </div>
          </div>

          {/* Chat Column */}
          <div className="chat-column">
            <div className="card shadow-sm d-flex flex-column h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 card-title">Chat</h5>
                <small className="text-muted">
                  {selectedAvatarId
                    ? `With: ${
                        availableAvatars.find((a) => a.id === selectedAvatarId)
                          ?.name
                      }`
                    : "No Avatar Selected"}
                </small>
              </div>
              {/* Chat History */}
              <div
                ref={chatHistoryRef}
                className="card-body flex-grow-1 overflow-auto p-3"
              >
                <>
                  {" "}
                  {/* Fragment */}
                  {/* Restored Message Mapping */}
                  {messages.map((msg: Message) => (
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
                  ))}
                  {/* Restored Typing Indicator */}
                  {isLoading &&
                    messages.length > 0 &&
                    (messages[messages.length - 1] as Message).sender ===
                      "user" && (
                      <div className="d-flex justify-content-start mb-2">
                        {" "}
                        <div className="p-2 rounded shadow-sm bg-body-secondary text-muted fst-italic">
                          {" "}
                          <span
                            className="spinner-grow spinner-grow-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>{" "}
                          Avatar is generating...{" "}
                        </div>{" "}
                      </div>
                    )}
                  {/* Select Avatar Placeholder */}
                  {!isLoadingAvatars &&
                    !selectedAvatarId &&
                    availableAvatars.length > 0 && (
                      <p className="text-center text-muted mt-3">
                        Select an avatar to start chatting.
                      </p>
                    )}
                  {/* No Avatars Placeholder */}
                  {!isLoadingAvatars && availableAvatars.length === 0 && (
                    <p className="text-center text-muted mt-3">
                      No avatars created yet.
                    </p>
                  )}
                </>
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
                    placeholder={
                      selectedAvatarId
                        ? "Type your message..."
                        : "Select an avatar first..."
                    }
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    style={{
                      resize: "none",
                      overflowY: "auto",
                      maxHeight: "100px",
                    }}
                    disabled={isLoading || !selectedAvatarId}
                    aria-label="Chat input"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-animated"
                    disabled={
                      isLoading || !inputValue.trim() || !selectedAvatarId
                    }
                    aria-label="Send message"
                  >
                    {" "}
                    <SendFill />{" "}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* End Main Content Area */}
      </div>{" "}
      {/* End Main Layout */}
    </div> // End Container
  );
};
