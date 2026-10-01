import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// DOCS_BASE lets the same build serve from a sub-path (GitHub Pages: /inkwire/) or the root (Vercel).
export default defineConfig({ base: process.env.DOCS_BASE ?? "/", plugins: [react()] });
