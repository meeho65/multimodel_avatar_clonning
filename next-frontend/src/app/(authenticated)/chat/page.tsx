"use client";
import { generateVideo, getUserAvatars } from "@/actions/actions";
import { AuthErrorResponse } from "@/components/modal-signup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { PersonCircle, SendFill } from "react-bootstrap-icons";
import { toast } from "sonner";

interface AvatarProfile {
  id: string;
  name: string;
  description: string;
  style: string;
  background: string;
  accessories: string;
  clothes: string;
  previewUrl: string | null;
  createdAt: number;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "avatar";
}

const Page = () => {
  const { data: session } = useSession();

  const [audio, setAudio] = useState<File | null | undefined>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null); // Use null for none selected

  const handleAvatarSelect = (avatarId: string) => {
    console.log("Avatar selected via sidebar:", avatarId);
    setSelectedAvatarId(avatarId);
    setMessages([]); // Clear chat on avatar switch
    setVideoUrl(null); // Clear video on avatar switch
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sidebarAvatars"],
    queryFn: () => getUserAvatars(session?.accessToken),
    enabled: !!session?.accessToken,
  });

  const genVideoMutation = useMutation({
    mutationFn: () =>
      generateVideo(session?.accessToken, selectedAvatarId, audio, inputValue),
    onSuccess: (data) => {
      setVideoUrl(data.video_url);
      toast.success("Video generated successfully");
    },
    onError: (error: unknown) => {
      const err = error as AuthErrorResponse;
      toast.error(err?.error || "Video generation failed");
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    event.target.style.height = "auto"; // Auto-resize
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 text-body">Avatar Chat & Video</h2>
      <div className="chat-page-layout">
        {/* Avatar Sidebar */}
        <div className="avatar-sidebar">
          <h5 className="text-body px-2 mb-2">Your Avatars</h5>
          {isLoading && (
            <div className="text-center text-muted p-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!isLoading && data?.length === 0 && (
            <p className="text-muted small px-2">
              No avatars saved yet. Use Create Avatar.
            </p>
          )}
          {!isLoading && data?.length > 0 && (
            <ul className="avatar-list list-unstyled mb-0">
              {data?.map(
                (
                  avatar: { avatar_name: string; preview_url: string },
                  index: number
                ) => (
                  <li key={index}>
                    <button
                      type="button"
                      className={`avatar-list-item d-flex align-items-center text-start w-100 p-2 ${
                        selectedAvatarId === avatar.avatar_name ? "active" : ""
                      }`}
                      onClick={() => handleAvatarSelect(avatar.avatar_name)}
                    >
                      {avatar.preview_url ? (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            position: "relative",
                          }}
                        >
                          <Image
                            src={avatar.preview_url}
                            alt={`preview`}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <PersonCircle className="avatar-placeholder-icon" />
                      )}
                      <span className="avatar-name text-truncate ms-2">
                        {avatar.avatar_name}
                      </span>
                    </button>
                  </li>
                )
              )}
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
                {genVideoMutation.isPending && (
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
                {!genVideoMutation.isPending && videoUrl && (
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
                {!genVideoMutation.isPending && !videoUrl && (
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
                  {genVideoMutation.isPending &&
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
                  {!isLoading && !selectedAvatarId && (
                    <p className="text-center text-muted mt-3">
                      Select an avatar to start chatting.
                    </p>
                  )}
                  {/* No Avatars Placeholder */}
                  {!isLoading && (
                    <p className="text-center text-muted mt-3">
                      No avatars created yet.
                    </p>
                  )}
                </>
              </div>
              {/* Chat Input */}
              {/* <div className="card-footer p-0 border-top">
                <form
                  // onSubmit={handleSendMessage}
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
                    // onKeyDown={handleKeyDown}
                    rows={1}
                    style={{
                      resize: "none",
                      overflowY: "auto",
                      maxHeight: "100px",
                    }}
                    disabled={genVideoMutation.isPending || !selectedAvatarId}
                    aria-label="Chat input"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-animated"
                    disabled={
                      genVideoMutation.isPending ||
                      !inputValue.trim() ||
                      !selectedAvatarId
                    }
                    aria-label="Send message"
                  >
                    {" "}
                    <SendFill />{" "}
                  </button>
                </form>
              </div> */}

              <div className="card-footer">
                {/* Audio Upload */}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudio(file);
                    }
                  }}
                  className="form-control mb-2"
                />

                {/* Message Input + Send Button */}
                <div className="input-group">
                  <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Type your message..."
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (!inputValue && !audio) {
                        toast.error(
                          "Please enter a message or upload an audio file!"
                        );
                        return;
                      }
                      setMessages((prev) => [
                        ...prev,
                        { id: Date.now(), text: inputValue, sender: "user" },
                      ]);
                      genVideoMutation.mutate();
                    }}
                  >
                    <SendFill />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* End Main Content Area */}
      </div>{" "}
      {/* End Main Layout */}
    </div>
  ); //
};

export default Page;
