import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    // Absolute asset URLs so deep links like /dashboard still load /assets/*
    assetsDir: "assets",
  },
});
