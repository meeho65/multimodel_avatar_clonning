// src/main.tsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// --- ENSURE THIS ORDER ---
import "bootstrap/dist/css/bootstrap.css"; // 1. Bootstrap Core CSS
import "./Theme.css"; // 2. Your Custom Theme Overrides
import "./animations.css"; // 3. Animations (if separate)
// -------------------------

import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
