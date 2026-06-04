// PATH: src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async"; // ✅ NEW
import "./index.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider> {/* ✅ NEW */}
      <App />
    </HelmetProvider> {/* ✅ NEW */}
  </StrictMode>
);