import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ⭐ REQUIRED FIX FOR FUSE.JS v7 (Vercel + Rollup compatible)
  optimizeDeps: {
    include: ["fuse.js"],
  },

  build: {
    cssCodeSplit: true,
    sourcemap: false,

    rollupOptions: {
      // ensure fuse.js is bundled and not treated as external
      external: [],
    },
  },
}));
