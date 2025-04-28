"use client";
import { useTheme } from "@/context/ThemeContext";
import { paths } from "@/utils/paths";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonStarsFill, SunFill } from "react-bootstrap-icons";
import AuthButtons from "./loginButton";
import { signOut, useSession } from "next-auth/react";

export const Navbar = ({}) => {
  const { theme, toggleTheme } = useTheme();
  const pathName = usePathname();
  const { data: session } = useSession();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-2">
      <div className="container">
        {/* Logo */}
        <Link
          className={`navbar-brand d-flex align-items-center fw-semibold nav-link-animated ${
            pathName === "/" ? "active" : ""
          }`}
          href="/"
          // onClick={(e) => handleNavClick(e, "home")}
          title="Avatar Cloning System - Home"
        >
          <Image
            src={
              theme === "light" ? "/logo-for-white.png" : "/logoforblack.png"
            }
            alt="Avatar Cloning System Logo"
            width={110}
            height="110" // Keep desired height
            className="mb-4 d-block mx-auto"
            style={{ filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.4))" }}
          />
        </Link>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Removed extra spaces from list items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {session && (
              <>
                {paths.map(({ title, href }, index) => (
                  <li key={index} className="nav-item">
                    {" "}
                    <Link
                      className={`nav-link nav-link-animated ${
                        pathName === "create-avatar" ? "active" : ""
                      }`}
                      href={href}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-light btn-theme-toggle btn-animated d-flex align-items-center justify-content-center"
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <MoonStarsFill size={18} />
              ) : (
                <SunFill size={18} />
              )}
            </button>
            {session ? (
              <button
                className="btn btn-link text-decoration-none btn-sm btn-animated px-2"
                type="button"
                style={{ color: "var(--custom-navbar-color)", opacity: 0.9 }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.9")}
                onClick={() => signOut()}
              >
                Logout
              </button>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
