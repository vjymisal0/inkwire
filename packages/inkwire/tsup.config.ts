import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "framer-motion"],
  // Every component uses hooks, so the whole bundle is a client module for RSC frameworks.
  banner: { js: '"use client";' },
});
