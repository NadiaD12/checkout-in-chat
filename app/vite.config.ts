import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Source lives in app/. The build is written to the repo root so GitHub Pages
// (main branch, root folder) serves it directly. Images, themes and docs stay at
// the repo root and are served from there in dev too.
export default defineConfig({
  plugins: [react()],
  base: "./",
  publicDir: "..",
  build: {
    outDir: "..",
    emptyOutDir: false,
    copyPublicDir: false,
    assetsDir: "assets",
  },
});
