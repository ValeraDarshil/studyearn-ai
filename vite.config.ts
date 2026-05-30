import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Target modern browsers for smaller bundles
    target: "es2020",
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React — loads first
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "react-core";
          }
          // Router — separate chunk
          if (id.includes("react-router-dom") || id.includes("react-router/")) {
            return "router";
          }
          // Heavy libraries — lazy loaded
          if (id.includes("lottie-react")) {
            return "lottie";
          }
          if (id.includes("lucide-react")) {
            return "icons";
          }
          // App pages — split by route group
          if (id.includes("/src/pages/codelearn/")) {
            return "pages-codelearn";
          }
          if (
            id.includes("/src/pages/AskAI") ||
            id.includes("/src/pages/PPTGenerator") ||
            id.includes("/src/pages/PDFTools") ||
            id.includes("/src/pages/QuizGenerator")
          ) {
            return "pages-tools";
          }
          if (
            id.includes("/src/pages/Dashboard") ||
            id.includes("/src/pages/Analytics") ||
            id.includes("/src/pages/BrainDashboard") ||
            id.includes("/src/pages/Profile")
          ) {
            return "pages-dashboard";
          }
          // Other node_modules
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },
  },
  publicDir: "public",
});