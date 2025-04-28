"use client";
import { generateAvatar } from "@/actions/actions";
import { AuthErrorResponse } from "@/components/modal-signup";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { data: session } = useSession();
  // const [avatarName, setAvatarName] = useState("");
  // const [description, setDescription] = useState("");
  const [avatarStyle, setAvatarStyle] = useState("realistic");
  const [gender, setGender] = useState("male");
  const [facialDetails, setFacialDetails] = useState("beard");
  // --- New State ---
  const [background, setBackground] = useState("plain");
  const [accessories, setAccessories] = useState("none");
  const [clothes, setClothes] = useState("casual");
  const [expression, setExpression] = useState("relaxed face");
  // ---------------
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(
    null
  ); // Renamed for clarity

  const [src, setSrc] = useState(null);

  const handleClear = () => {
    // setAvatarName("");
    // setDescription("");
    setGender("male");
    setAvatarStyle("realistic");
    setBackground("plain");
    setAccessories("none");
    setClothes("casual");
    setExpression("relaxed face");
    setGeneratedAvatarUrl(null);
  };

  const createAvatarMutation = useMutation({
    mutationFn: () =>
      generateAvatar(
        session?.accessToken,
        gender,
        background,
        avatarStyle,
        accessories,
        clothes,
        expression,
        facialDetails
      ),
    onSuccess: (data) => {
      console.log(data);
      setSrc(data.image_url);
      toast.success("Avatar created successfully");
    },
    onError: (error: unknown) => {
      const err = error as AuthErrorResponse;
      toast.error(err?.error || "Create Avatar Failed");
    },
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-body">Create & Save New Avatar</h2>

      <div className="row g-4">
        {/* Input Column */}
        <div className="col-md-6">
          <div className="card p-4 h-100">
            <h3 className="mb-3 card-title">Avatar Configuration</h3>

            {/* --- Existing Fields --- */}
            {/* <div className="mb-3">
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
            </div> */}
            {/* <div className="mb-3">
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
            </div> */}

            <div className="mb-3">
              <label htmlFor="avatarStyle" className="form-label">
                Gender
              </label>
              <select
                className="form-select"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={createAvatarMutation.isPending}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="avatarStyle" className="form-label">
                Facial Details
              </label>
              <select
                className="form-select"
                id="facialDetails"
                value={facialDetails}
                onChange={(e) => setFacialDetails(e.target.value)}
                disabled={createAvatarMutation.isPending}
              >
                <option value="beard">Beard</option>
                <option value="no beard">No Beard</option>
              </select>
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
                disabled={createAvatarMutation.isPending}
              >
                <option value="realistic">Realistic</option>
                <option value="cartoon">Cartoon</option>
                <option value="anime">Anime</option>
                <option value="cyberpunk">Cyberpunk</option>
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
                disabled={createAvatarMutation.isPending}
              >
                <option value="plain">Plain</option>
                <option value="outdoor">Outdoor</option>
                <option value="room">Room</option>
                <option value="fantasy">Fantasy</option>
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
                disabled={createAvatarMutation.isPending}
              >
                <option value="none">None</option>
                <option value="glasses">Glasses</option>
                <option value="hat">Hat</option>
                <option value="earrings">Earrings</option>
                <option value="headphones">Headphones</option>
                <option value="necklace">Necklace</option>
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
                disabled={createAvatarMutation.isPending}
              >
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="streetwear">Streetwear</option>
                <option value="traditional">Traditional</option>
                <option value="sportswear">Sportswear</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="clothes" className="form-label">
                Expression Desc
              </label>
              <select
                className="form-select"
                id="clothes"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                disabled={createAvatarMutation.isPending}
              >
                <option value="relaxed face">Relaxed Face</option>
                <option value="smiling naturally">Smiling Naturally</option>
                <option value="confident look">Confident Look</option>
                <option value="suprised expression">Suprised Expression</option>
              </select>
            </div>

            {/* --- End New Dropdowns --- */}

            <div className="mt-auto d-flex justify-content-start flex-wrap gap-2 pt-3">
              {/* Generate Preview Button */}
              <button
                className="btn btn-info btn-animated"
                onClick={() => createAvatarMutation.mutate()}
                disabled={createAvatarMutation.isPending}
              >
                {createAvatarMutation.isPending ? (
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
              {/* Clear Button */}
              <button
                className="btn btn-secondary btn-animated"
                onClick={handleClear}
                disabled={createAvatarMutation.isPending}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Preview Column (shows the generated image only) */}
        <div className="col-md-6">
          <div className="card p-4 h-100 d-flex flex-column">
            <h3 className="mb-3 text-start card-title">Preview</h3>
            <div className="text-center flex-grow-1 d-flex justify-content-center align-items-center bg-body-tertiary rounded p-3">
              {createAvatarMutation.isPending ? (
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  {" "}
                  <span className="visually-hidden">Loading...</span>{" "}
                </div>
              ) : src ? (
                <div>
                  <Image
                    width={500}
                    height={500}
                    src={src}
                    alt={"Generated Preview"}
                    className="img-fluid rounded mb-2"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
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

export default Page;
