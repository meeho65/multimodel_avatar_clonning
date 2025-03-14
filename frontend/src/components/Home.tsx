export const Home: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  return (
    <div className="container">
      <div className="text-center mt-4">
        <h1 className="display-4 text-white mb-3">
          Multimodal Synthetic Avatar Cloning System
        </h1>
        <p className="lead text-white mb-5">
          Create realistic digital avatars that look and sound like you
        </p>

        <div className="row justify-content-center">
          <div className="col-md-3 m-2">
            <div className="card py-4 px-2 h-100 bg-light bg gradient">
              <div className="text-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#6c5ce7"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </div>
              <h3 className="h5 mb-3">Realistic Avatars</h3>
              <p className="text-muted small">
                Generate lifelike avatars from text descriptions or images
              </p>
            </div>
          </div>

          <div className="col-md-3 m-2">
            <div className="card py-4 px-2 h-100 bg-light bg gradient">
              <div className="text-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#6c5ce7"
                  className="bi bi-mic-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                </svg>
              </div>
              <h3 className="h5 mb-3">Voice Cloning</h3>
              <p className="text-muted small">
                Clone your voice for natural-sounding speech synthesis
              </p>
            </div>
          </div>

          <div className="col-md-3 m-2">
            <div className="card py-4 px-2 h-100 bg-light bg gradient">
              <div className="text-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#6c5ce7"
                  className="bi bi-film"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
                </svg>
              </div>
              <h3 className="h5 mb-3">Facial Animations</h3>
              <p className="text-muted small">
                Create synchronized lip movements and expressions
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 mb-5">
          <button
            className="btn btn-primary btn-lg px-4 py-2"
            style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
            onClick={() => setActiveTab("create")}
          >
            Create Your Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
