import React, { useState } from "react";

export const CreateAvatar: React.FC = () => {
  const [avatarName, setAvatarName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [avatarStyle, setAvatarStyle] = React.useState("Realistic");
  const [generatedAvatar, setGeneratedAvatar] = React.useState(null);

  const handleGenerate = () => {
    // In a real implementation, this would call an API
    // console.log("Generating avatar with:", {
    //   avatarName,
    //   description,
    //   avatarStyle,
    // });
    // // For now, we'll just set a flag to show that generation was attempted
    // setGeneratedAvatar({
    //   name: avatarName,
    //   description: description,
    //   style: avatarStyle,
    // });
  };

  const handleClear = () => {
    setAvatarName("");
    setDescription("");
    setAvatarStyle("Realistic");
    setGeneratedAvatar(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-black mb-4">Create Your Avatar</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h3 className="mb-4">Avatar Generation</h3>

            <div className="mb-3">
              <label htmlFor="avatarName" className="form-label">
                Avatar Name
              </label>
              <input
                type="text"
                className="form-control"
                id="avatarName"
                placeholder="Enter a name for your avatar"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
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
                placeholder="Describe the features of your avatar (e.g., gender, age, hair color, facial features)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              >
                <option value="Realistic">Realistic</option>
                <option value="Cartoon">Cartoon</option>
                <option value="Anime">Anime</option>
                <option value="Stylized">Stylized</option>
              </select>
            </div>

            <div className="mt-3">
              <button
                className="btn btn-primary me-2"
                onClick={handleGenerate}
                style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
              >
                Generate Avatar
              </button>
              <button className="btn btn-secondary" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4 h-100 d-flex flex-column">
            <div>
              <h3 className="mb-4 text-start">Preview</h3>
            </div>
            <div className="text-center h-100 d-flex justify-content-center align-items-center bg-light bg-gradient">
              {generatedAvatar ? (
                <div>
                  {/* This would be replaced with the actual avatar image */}
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZTBlMGUwIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg=="
                    alt="Generated Avatar"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <p className="mt-2">{avatarName || "Your Avatar"}</p>
                </div>
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="#c4c4c4"
                    className="bi bi-person-circle mb-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                  <p color="#c4c4c4">Your avatar will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
