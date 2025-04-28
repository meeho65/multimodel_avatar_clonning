"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function Home() {
  const { theme } = useTheme();
  return (
    <div className="container">
      <div className="text-center mt-4">
        {/* --- LOGO IMAGE --- */}
        <Image
          src={theme === "light" ? "/logo-for-white.png" : "/logoforblack.png"}
          alt="Avatar Cloning System Logo"
          width={110}
          height="110" // Keep desired height
          className="mb-4 d-block mx-auto"
          style={{ filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.4))" }}
        />
        {/* --- End Logo Image --- */}

        {/* Use theme-aware text classes */}
        <h1 className="display-4 text-body mb-3">
          Multimodal Synthetic Avatar Cloning System
        </h1>
        <p className="lead text-muted mb-5">
          Create realistic digital avatars that look and sound like you
        </p>

        {/* Feature Cards */}
        <div className="row justify-content-center g-4">
          {/* Card 1 */}
          <div className="col-md-4 col-lg-3">
            {/* Remove text-dark, let card handle theme */}
            <div className="card h-100 text-center shadow-sm btn-animated">
              <div className="card-body d-flex flex-column">
                {/* Icon should adapt via CSS */}
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    className="bi bi-person-video3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-6 5.7c-1.5 0-2.5-1.2-2.5-2.7C5.5 11 6.5 9.7 8 9.7c1.5 0 2.5 1.2 2.5 2.8.1 1.5-.9 2.7-2.5 2.7Z" />
                    <path d="M0 1a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1.133a2 2 0 0 1 0 3.734V15a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1Zm13 1.867a1 1 0 1 0 0 1.998V3a1 1 0 0 0-1-1H1v11.133a1 1 0 0 0 0 1.998V15h11v-.133a1 1 0 0 0 0-1.998V2.867Z" />
                  </svg>
                </div>
                <h3 className="h5 card-title">Realistic Avatars</h3>
                <p className="card-text text-muted small flex-grow-1">
                  Generate lifelike avatars from text descriptions or images
                  using advanced AI.
                </p>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="col-md-4 col-lg-3">
            {/* Remove text-dark */}
            <div className="card h-100 text-center shadow-sm btn-animated">
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  {/* Icon should adapt via CSS */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    className="bi bi-mic-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </div>
                <h3 className="h5 card-title">Voice Cloning</h3>
                <p className="card-text text-muted small flex-grow-1">
                  Clone your unique voice for natural-sounding speech synthesis
                  in minutes.
                </p>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="col-md-4 col-lg-3">
            {/* Remove text-dark */}
            <div className="card h-100 text-center shadow-sm btn-animated">
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  {/* Icon should adapt via CSS */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    className="bi bi-camera-reels-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path d="M9 6a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7z" />
                  </svg>
                </div>
                <h3 className="h5 card-title">Facial Animations</h3>
                <p className="card-text text-muted small flex-grow-1">
                  Generate synchronized lip movements and realistic facial
                  expressions automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-5 mb-5">
          {/* Use standard btn-primary, remove inline style */}
          <button
            className="btn btn-primary btn-lg px-5 py-3 btn-animated"
            // onClick={() => setActiveTab("create")}
          >
            Get Started - Create Your Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
