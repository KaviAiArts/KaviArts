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

  // ⭐ REQUIRED FIX FOR FUSE.JS v7 (Keep this)
  optimizeDeps: {
    include: ["fuse.js"],
  },

  build: {
    cssCodeSplit: true,
    sourcemap: false,

    rollupOptions: {
      // ensure fuse.js is bundled and not treated as external
      external: [],
      
      // ⚡ NEW: Splits big libraries into separate files for faster loading
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-slot', 'lucide-react', 'clsx', 'tailwind-merge']
        },
      },
    },
  },
}));