import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import Sitemap from "vite-plugin-sitemap";
import { createClient } from "@supabase/supabase-js";

// Helper to match your SEO URL structure (e.g., "It Will Be Okay" -> "it-will-be-okay")
const slugify = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

export default defineConfig(async ({ mode }) => {
  // 1. Load environment variables to connect to Supabase
  const env = loadEnv(mode, process.cwd(), '');
  
  // Start with your static categories
  const dynamicRoutes = [
    "/category/wallpaper",
    "/category/ringtone",
    "/category/video"
  ];

  // 2. Connect to Supabase to fetch your FILES
  console.log("Generatig Sitemap: Connecting to Supabase...");
  
  try {
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
      const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

      // ✅ FIX: Using your exact schema table 'files' and column 'file_name'
      // We also check public_id to ensure we only list valid files
      const { data: files, error } = await supabase
        .from('files') 
        .select('id, file_name')
        .order('id', { ascending: false }); // Get newest files first

      if (!error && files) {
        // 3. Convert database files into Sitemap URLs
        // Format: /item/ID/SLUG
        const itemRoutes = files.map((file) => {
          const slug = slugify(file.file_name);
          return `/item/${file.id}/${slug}`;
        });
        
        dynamicRoutes.push(...itemRoutes);
        console.log(`✅ Successfully added ${itemRoutes.length} items to sitemap from 'files' table.`);
      } else {
        console.error("⚠️ Supabase Error:", error?.message);
      }
    } else {
      console.warn("⚠️ SKIPPING SITEMAP DB FETCH: VITE_SUPABASE_URL or ANON_KEY missing in Environment Variables.");
    }
  } catch (e) {
    console.error("⚠️ Failed to fetch from Supabase:", e);
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },

    plugins: [
      react(),
      Sitemap({
        hostname: "https://kaviarts.com",
        dynamicRoutes: dynamicRoutes,
        generateRobotsTxt: true,
        // Optional: Ensure clean XML formatting
        readable: true, 
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    optimizeDeps: {
      include: ["fuse.js"],
    },

    build: {
      cssCodeSplit: true,
      sourcemap: false,

      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-slot', 'lucide-react', 'clsx', 'tailwind-merge']
          },
        },
      },
    },
  };
});